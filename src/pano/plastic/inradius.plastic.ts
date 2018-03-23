import {BackSide, MeshBasicMaterial, MeshPhongMaterial, SphereGeometry, Mesh, CubeRefractionMapping} from 'three';
import Tween from '../animations/tween.animation';

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
    light: false
};
export default class Inradius {
    data: any;
    plastic: any;

    constructor(data) {
        this.data = Object.assign({}, defaultOpts, data);
        
        this.setRefraction(data.envMap);
        this.create();
    }

    create() {
        const data = this.data;
        const material = data.light ? 
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
        const mesh = new Mesh(geometry, material);

        if (data.light) {
            mesh.castShadow = true;
        }

        this.plastic = mesh;
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
    }

    getPlastic() {
        return this.plastic;
    }

    addRotate(num) {
        const plastic = this.plastic;

        plastic.rotation.x += num;
        plastic.rotation.y += num;
        plastic.rotation.z += num;
    }

    addTo(scene) {
        scene.add(this.plastic);
    }

    addBy(pano) {
        pano.addSceneObject(this.plastic);
    }

    fadeIn(pano, onComplete) {
        const material = this.plastic.material;

        new Tween(material).to({opacity: 1}).effect('linear', 1500)
            .start(['opacity'], pano).complete(onComplete);
    }

    fadeOut(pano, onComplete) {
        const material = this.plastic.material;

        new Tween(material).to({opacity: 0}).effect('linear', 1500)
            .start(['opacity'], pano).complete(onComplete);
    }

    dispose() {
        const plastic = this.plastic;

        plastic.material.envMap.dispose();
        plastic.material.dispose();
        plastic.parent.remove(plastic);
    }
}