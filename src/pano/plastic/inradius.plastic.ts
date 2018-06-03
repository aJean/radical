import { BackSide, MeshBasicMaterial, MeshPhongMaterial, SphereGeometry, Mesh, CubeRefractionMapping, TextureLoader, ShaderMaterial, Color, AdditiveBlending } from 'three';
import Tween from '../animations/tween.animation';
import Plastic from './plastic';

/**
 * @file 内切球
 */

const defaultOpts = {
    side: BackSide,
    radius: 2000,
    color: '#fff',
    widthSegments: 30,
    heightSegments: 30,
    opacity: 1,
    shadow: false,
    visible: true
};
export default class Inradius extends Plastic {
    wrap: any;

    constructor(opts, pano?) {
        super();

        this.pano = pano;
        this.opts = Object.assign({}, defaultOpts, opts);
        this.create();

        if (opts.rotate) {
            pano.subscribe('render-process', this.addRotate, this);
        }
    }

    create() {
        const opts = this.opts;
        const params: any = opts.shadow ? {
                color: opts.color,
                side: opts.side,
                refractionRatio: 0,
                reflectivity: 1,
                specular: 'grey',
                transparent: true,
                opacity: opts.opacity                
            } : {
                color: opts.color,                
                side: opts.side,
                refractionRatio: 0,
                reflectivity: 1,
                transparent: true,
                opacity: opts.opacity
            };

        if (opts.envMap) {
            this.setRefraction(opts.envMap);
            params.envMap = opts.envMap;
        }

        const material = opts.shadow ? new MeshPhongMaterial(params) : new MeshBasicMaterial(params);
        const sphere: any = this.plastic = new Mesh(new SphereGeometry(opts.radius, opts.widthSegments, 
            opts.heightSegments), material);

        sphere.visible = opts.visible;
        sphere.name = opts.name;
        sphere.data = opts.data;
        
        // if (opts.shadow) {
        //     sphere.castShadow = true;
        // }

        if (opts.cloud) {
            const cloud = this.wrap = new Mesh(
                new SphereGeometry(opts.radius, 40, 40),
                new MeshBasicMaterial({
                    map: new TextureLoader().load('../assets/cloud.png'),
                    transparent: true,
                    depthTest: false
                })
            );
            cloud.add(sphere);
        // 辉光
        } else if (opts.glow) {
            const glowMaterial = new ShaderMaterial({
                uniforms: { 
                    c: {type: 'f', value: 0.1},
                    p: {type: 'f', value: 1.4},
                    glowColor: {type: 'c', value: new Color('#999')},
                    viewVector: {type: 'v3', value: opts.position}
                },
                vertexShader: `
                    uniform vec3 viewVector;
                    uniform float c;
                    uniform float p;
                    varying float intensity;
                    void main() {
                        vec3 vNormal = normalize( normalMatrix * normal );
                        vec3 vNormel = normalize( normalMatrix * viewVector );
                        intensity = pow( c - dot(vNormal, vNormel), p );
                        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                    }`,
                fragmentShader: `
                    uniform vec3 glowColor;
                    varying float intensity;
                    void main() {
                        vec3 glow = glowColor * intensity;
                        gl_FragColor = vec4( glow, 1.0 );
                    }`,
                blending: AdditiveBlending,
                transparent: true
            });

            const glow = this.wrap = new Mesh(new SphereGeometry(opts.radius, 40, 40), glowMaterial);
            glow.add(sphere);
        }

        if (opts.position) {
            this.setPosition(opts.position.x, opts.position.y, opts.position.z);
        }
    }

    getMap() {
        return this.plastic.material.envMap;
    }

    setMap(texture) {
        const tempMap = this.plastic.material.envMap;

        this.setRefraction(texture);
        this.plastic.material.envMap = texture;
        tempMap.dispose();
    }

    setRefraction(texture) {
        texture.mapping = CubeRefractionMapping;
        texture.needsUpdate = true;
    }

    setPosition(x, y, z) {
        const target = this.wrap || this.plastic;
        target.position.set(x, y, z);
    }

    getPlastic() {
        return this.wrap || this.plastic;
    }

    addRotate() {
        const target = this.wrap || this.plastic;
        target.rotation.x += 0.01;
        target.rotation.y += 0.01;
        target.rotation.z += 0.01;
    }

    addTo(scene) {
        scene.add(this.wrap || this.plastic);
    }

    addBy(pano) {
        pano.addSceneObject(this.wrap || this.plastic);
    }

    fadeIn(pano, onComplete) {
        const material = this.plastic.material;

        new Tween(material).to({ opacity: 1 }).effect('linear', 1000)
            .start(['opacity'], pano).complete(onComplete);
    }

    fadeOut(pano, onComplete) {
        const material = this.plastic.material;

        new Tween(material).to({ opacity: 0 }).effect('linear', 1000)
            .start(['opacity'], pano).complete(onComplete);
    }

    dispose() {
        super.dispose();

        const wrap = this.wrap;
        if (wrap) {
            wrap.geometry.dispose();
            wrap.material.map.dispose();
            wrap.material.dispose();
        }

        if (this.pano) {
            this.pano.unsubscribe('render-process', this.addRotate, this);
        }
    }
}
