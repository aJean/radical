/**
 * @file shader effects
 */

export default {
    GLOW: {
        UNIFORMS: {
            c: { value: 0.1 },
            p: { value: 1.4 },
            glowColor: { value: null },
            viewVector: { value: null }
        },

        VTEX: `
            uniform vec3 viewVector;
            uniform float c;
            uniform float p;
            varying float intensity;
            void main() 
            {
                vec3 vNormal = normalize( normalMatrix * normal );
                vec3 vNormel = normalize( normalMatrix * viewVector );
                intensity = pow( c - dot(vNormal, vNormel), p );
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }`,

        FRAGMENT: `
            uniform vec3 glowColor;
            varying float intensity;
            void main() 
            {
                vec3 glow = glowColor * intensity;
                gl_FragColor = vec4( glow, 1.0 );
            }`
    },

    ATMOSPHERE: {
        UNIFORMS: {
            coeficient: { value: 1.2 },
            power: { value: 3 },
            glowColor: { value: null }
        },

        VTEX: `
            varying vec3 vVertexWorldPosition;
            varying vec3 vVertexNormal;
            void main(){
                vVertexNormal = normalize(normalMatrix * normal);
                vVertexWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,

        FRAGMENT: `
            uniform vec3 glowColor;
            uniform float coeficient;
            uniform float power;

            varying vec3 vVertexNormal;
            varying vec3 vVertexWorldPosition;
            void main(){
                vec3 worldCameraToVertex = vVertexWorldPosition - cameraPosition;
                vec3 viewCameraToVertex = (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;;
                viewCameraToVertex = normalize(viewCameraToVertex);
                float intensity = pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);
                gl_FragColor = vec4(glowColor, intensity);
            }`
    }
};