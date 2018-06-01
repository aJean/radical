import { BackSide, MeshBasicMaterial, MeshPhongMaterial, SphereGeometry, Mesh, CubeRefractionMapping, TextureLoader } from 'three';
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
    cloud: any;

    constructor(opts) {
        super();

        this.opts = Object.assign({}, defaultOpts, opts);
        this.create();
    }

    create() {
        const opts = this.opts;
        const params: any = opts.shadow ? {
                color: opts.color,
                side: opts.side,
                refractionRatio: 0,
                reflectivity: 1,
                specular: 'grey'
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
        const mesh = this.plastic = new Mesh(new SphereGeometry(opts.radius, opts.widthSegments, 
            opts.heightSegments), material);
        mesh.visible = opts.visible;
        
        if (opts.shadow) {
            mesh.castShadow = true;
        }

        if (opts.cloud) {
            const cloud = this.cloud = new Mesh(
                new SphereGeometry(opts.radius + 1, 40, 40),
                new MeshBasicMaterial({
                    map: new TextureLoader().load('../assets/cloud.png'),
                    transparent: true,
                    depthTest: false
                })
            );
            cloud.add(mesh);
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
        const target = this.cloud || this.plastic;
        target.position.set(x, y, z);
    }

    getPlastic() {
        return this.plastic;
    }

    addRotate(num) {
        const target = this.cloud || this.plastic;
        target.rotation.x += num;
        target.rotation.y += num;
        target.rotation.z += num;
    }

    addTo(scene) {
        scene.add(this.cloud || this.plastic);
    }

    addBy(pano) {
        pano.addSceneObject(this.cloud || this.plastic);
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
}