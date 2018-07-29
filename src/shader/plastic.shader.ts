/**
 * @file shader effects
 */

export default {
    glow: {
        uniforms: {
            c: { value: 0.1 },
            p: { value: 1.4 },
            glowColor: { value: null },
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

    atmosphere: {
        uniforms: {
            coeficient: { value: 1.2 },
            power: { value: 3 },
            glowColor: { value: null }
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