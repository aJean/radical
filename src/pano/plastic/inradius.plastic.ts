import { BackSide, MeshBasicMaterial, MeshPhongMaterial, SphereGeometry, Mesh, CubeRefractionMapping, TextureLoader } from 'three';
import Tween from '../animations/tween.animation';
import Plastic from './plastic';

/**
 * @file 内切球
 */

const defaultOpts = {
    side: BackSide,
    radius: 2000,
    widthSegments: 30,
    heightSegments: 16,
    transparent: false,
    opacity: 1,
    shadow: false
};
export default class Inradius extends Plastic {
    cloud: any;

    constructor(opts) {
        super();
        this.data = Object.assign({}, defaultOpts, opts);

        this.setRefraction(opts.envMap);
        this.create();
    }

    create() {
        const data = this.data;
        const material = data.shadow ?
            new MeshPhongMaterial({
                envMap: data.envMap,
                side: data.side,
                refractionRatio: 0,
                reflectivity: 1,
                specular: 'grey'
            }) :
            new MeshBasicMaterial({
                envMap: data.envMap,
                side: data.side,
                refractionRatio: 0,
                reflectivity: 1,
                transparent: data.transparent,
                opacity: data.opacity
            });
        const geometry = new SphereGeometry(data.radius, data.widthSegments, data.heightSegments);
        const mesh = this.plastic = new Mesh(geometry, material);

        if (data.shadow) {
            mesh.castShadow = true;
        }

        if (data.cloud) {
            this.cloud = new Mesh(
                new SphereGeometry(data.radius + 1, 40, 40),
                new MeshPhongMaterial({
                    map: new TextureLoader().load('../assets/cloud.png'),
                    transparent: true,
                    opacity: 1
                })
            );
        }

        if (data.position) {
            this.setPosition(data.position.x, data.position.y, data.position.z);
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
        this.plastic.position.set(x, y, z);
        this.cloud && this.cloud.position.set(x, y, z);
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
        scene.add(this.plastic);
        this.cloud && scene.add(this.cloud);
    }

    addBy(pano) {
        pano.addSceneObject(this.plastic);
        this.cloud && pano.addSceneObject(this.cloud);
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