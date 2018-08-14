import { Vector3, Color } from 'three';

/**
 * @file shader effects
 */

export default {
    glow: {
        uniforms: {
            c: { value: 0.1 },
            p: { value: 1.4 },
            glowColor: { value: new Color('grey') },
            viewVector: { value: null }
        },

        vertex: [
            'uniform vec3 viewVector;',
            'uniform float c;',
            'uniform float p;',
            'varying float intensity;',
            'void main() {',
            'vec3 vNormal = normalize( normalMatrix * normal );',
            'vec3 vNormel = normalize( normalMatrix * viewVector );',
            'intensity = pow( c - dot(vNormal, vNormel), p );',
            'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            '}'
        ].join('\n'),

        fragment: [
            'uniform vec3 glowColor;',
            'varying float intensity;',
            'void main() {',
            'vec3 glow = glowColor * intensity;',
            'gl_FragColor = vec4( glow, 1.0 );',
            '}'
        ].join('\n')
    },

    /** 
     * phone's lights mask 
     */
    mask: {
        uniforms: {
            color: { value: new Color('#999') },
            ambientColor: { value: new Color('#999') },
            lightColor: { value: new Color('#999') },
            lightPos: { value: new Vector3(0, 0, 0) },
            specular: { value: 1.0 }
        },

        vertex: [
            'varying vec3 fNormal;',
            'varying vec3 fPosition;',
            'void main() {',
            'fNormal = normalize(normalMatrix * normal);',
            'vec4 pos = modelViewMatrix * vec4(position, 1.0);',
            'fPosition = pos.xyz;',
            'gl_Position = projectionMatrix * pos;',
            '}'
        ].join('\n'),

        fragment: [
            'uniform vec3 color;',
            'uniform vec3 ambientColor;',
            'uniform vec3 lightPos;',
            'uniform vec3 lightColor;',
            'uniform float specular;',
            'varying vec3 fPosition;',
            'varying vec3 fNormal;',
            'void main() {',
            'vec3 norm = normalize(fNormal);',
            'vec3 lpos = (viewMatrix * vec4(lightPos, 0.0)).xyz;',
            'vec3 ldir = normalize(lpos);',
            'vec3 ld = vec3(max(0.0, dot( norm, ldir))) * lightColor;',
            'vec3 viewDir = normalize(-fPosition);',
            'vec3 reflectDir = reflect(-ldir, norm);',
            'float specf = pow(max(dot(viewDir, reflectDir), 0.0), specular);',
            'float specularForce = 1.0;',
            'vec3 spec = specularForce * specf * lightColor;',
            'vec3 diffuse = clamp(ld, vec3(0.0), vec3(1.0));',
            'vec3 col = (ambientColor + diffuse + spec) * color;',
            'gl_FragColor = vec4(col, 1);',
            '}'
        ].join('\n')
    },

    atmosphere: {
        uniforms: {
            coeficient: { value: 1.2 },
            power: { value: 3 },
            glowColor: { value: new Color('#fff') }
        },

        vertex: [
            'varying vec3 vVertexWorldPosition;',
            'varying vec3 vVertexNormal;',
            'void main() {',
            'vVertexNormal = normalize(normalMatrix * normal);',
            'vVertexWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;',
            'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
            '}'
        ].join('\n'),

        fragment: [
            'uniform vec3 glowColor;',
            'uniform float coeficient;',
            'uniform float power;',
            'varying vec3 vVertexNormal;',
            'varying vec3 vVertexWorldPosition;',
            'void main() {',
            'vec3 worldCameraToVertex = vVertexWorldPosition - cameraPosition;',
            'vec3 viewCameraToVertex = (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;',
            'viewCameraToVertex = normalize(viewCameraToVertex);',
            'float intensity = pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);',
            'gl_FragColor = vec4(glowColor, intensity);',
            '}'
        ].join('\n')
    },
    // hdr
    tone: {
        uniforms: {
            tDiffuse: { value: null },
            averageLuminance: { value: 1.0 },
            luminanceMap: { value: null },
            maxLuminance: { value: 16.0 },
            minLuminance: { value: 0.01 },
            middleGrey: { value: 0.6 }
        },

        vertex: [
            'varying vec2 vUv;',
            'void main() {',
            'vUv = uv;',
            'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            '}'
        ].join('\n'),

        fragment: [
            '#include <common>',
            'uniform sampler2D tDiffuse;',
            'varying vec2 vUv;',

            'uniform float middleGrey;',
            'uniform float minLuminance;',
            'uniform float maxLuminance;',
            '#ifdef ADAPTED_LUMINANCE',
            'uniform sampler2D luminanceMap;',
            '#else',
            'uniform float averageLuminance;',
            '#endif',

            'vec3 ToneMap( vec3 vColor ) {',
            '#ifdef ADAPTED_LUMINANCE',
            // Get the calculated average luminance
            'float fLumAvg = texture2D(luminanceMap, vec2(0.5, 0.5)).r;',
            '#else',
            'float fLumAvg = averageLuminance;',
            '#endif',
            // Calculate the luminance of the current pixel
            'float fLumPixel = linearToRelativeLuminance( vColor );',
            // Apply the modified operator (Eq. 4)
            'float fLumScaled = (fLumPixel * middleGrey) / max( minLuminance, fLumAvg );',

            'float fLumCompressed = (fLumScaled * (1.0 + (fLumScaled / (maxLuminance * maxLuminance)))) / (1.0 + fLumScaled);',
            'return fLumCompressed * vColor;',
            '}',

            'void main() {',
            'vec4 texel = texture2D( tDiffuse, vUv );',
            'gl_FragColor = vec4( ToneMap( texel.xyz ), texel.w );',
            '}'
        ].join("\n")
    }
}