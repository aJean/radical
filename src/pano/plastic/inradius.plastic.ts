import { BackSide, MeshBasicMaterial, MeshPhongMaterial, SphereGeometry, Mesh, CubeRefractionMapping, TextureLoader, ShaderMaterial, Color, AdditiveBlending } from 'three';
import Tween from '../animations/tween.animation';
import Plastic from './plastic';
import Text from '../plastic/text.plastic';
import Shader from '../../shader/plastic.shader';

/**
 * @file 内切球
 */

const defaultOpts = {
    side: BackSide,
    radius: 2000,
    color: '#fff',
    emissive: '#000',
    widthSegments: 40,
    heightSegments: 40,
    opacity: 1,
    shadow: false,
    visible: true
};
export default class Inradius extends Plastic {
    wrap: any;
    text: any;

    constructor(opts, pano?) {
        super();

        this.pano = pano;
        this.opts = Object.assign({}, defaultOpts, opts);
        this.create();

        if (opts.rotate) {
            this.subscribe(this.Topic.RENDER.PROCESS, () => this.addRotate());
        }
    }

    create() {
        const opts = this.opts;
        const params: any = opts.shadow ? {
                color: opts.color,
                emissive: opts.emissive,
                specular: opts.color,
                side: opts.side,
                refractionRatio: 0,
                reflectivity: 1,
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

        switch (opts.type) {
            case 'mask':
                this.createMask(sphere);
                break;
            case 'cloud':
                this.createCloud(sphere);
                break;
            case 'glow':
                this.createGlow(sphere);
                break;
        }

        if (opts.text) {
            this.createText(opts.text);
        }

        if (opts.position) {
            this.setPosition(opts.position.x, opts.position.y, opts.position.z);
        }

        const target = this.wrap || this.plastic;
        target.name = opts.name;
        target.visible = opts.visible;
        target.instance = this;
        // target.castShadow = opts.shadow;
    }

    /**
     * 创建蒙层
     */
    createMask(sphere) {
        const mask = this.wrap = new Mesh(
            new SphereGeometry(this.opts.radius, 40, 40),
            new MeshBasicMaterial({
                color: '#000',
                transparent: true,
                opacity: 0.2,
                depthTest: false
            })
        );
        mask.add(sphere);
    }

    /**
     * 创建云层
     */
    createCloud(sphere) {
        const cloud = this.wrap = new Mesh(
            new SphereGeometry(this.opts.radius, 40, 40),
            new MeshBasicMaterial({
                map: new TextureLoader().load('../assets/cloud.png'),
                transparent: true,
                depthTest: false
            })
        );
        cloud.add(sphere);
    }

    /**
     * 创建辉光
     */
    createGlow(sphere) {
        const opts = this.opts;
        const glowMaterial = new ShaderMaterial({
            uniforms: { 
                c: {type: 'f', value: 0.1},
                p: {type: 'f', value: 1.4},
                glowColor: {type: 'c', value: new Color('#999')},
                viewVector: {type: 'v3', value: opts.position}
            },
            vertexShader: Shader.GLOW.VTEX,
            fragmentShader: Shader.GLOW.FRAGMENT,
            blending: AdditiveBlending,
            transparent: true
        });

        const glow = this.wrap = new Mesh(new SphereGeometry(opts.radius, 40, 40), glowMaterial);
        glow.add(sphere);
    }

    createText(str) {
        const text = this.text = new Text({fontsize: 32, width: 128, shadow: true, 
            text: str, inverse: false});
        text.addTo(this.wrap || this.plastic);
    }

    hideText() {
        this.text && this.text.hide();
    }

    getData() {
        return this.opts.data;
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

    getPlastic() {
        return this.wrap || this.plastic;
    }

    addRotate() {
        const target = this.wrap || this.plastic;
        target.rotation.x += 0.01;
        target.rotation.y += 0.01;
        target.rotation.z += 0.01;
    }

    fadeIn(pano, onComplete) {
        const material = this.plastic.material;

        new Tween(material).to({ opacity: 1 }).effect('linear', 1000)
            .start(['opacity']).complete(onComplete);
    }

    fadeOut(pano, onComplete) {
        const material = this.plastic.material;

        new Tween(material).to({ opacity: 0 }).effect('linear', 1000)
            .start(['opacity']).complete(onComplete);
    }

    dispose() {
        const wrap = this.wrap;
        if (wrap) {
            wrap.geometry.dispose();
            wrap.material.map && wrap.material.map.dispose();
            wrap.material.dispose();
            delete wrap.data;
            delete wrap.instance;
        }

        super.dispose();
    }
}
