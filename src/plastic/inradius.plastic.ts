import {BackSide, MeshBasicMaterial, SphereGeometry, Mesh, CubeRefractionMapping, Math as TMath} from 'three';
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
    opacity: 1
};
export default class Inradius {
    data: any;
    plastic: any;

    constructor(data) {
        this.data = Object.assign({}, defaultOpts, data);
        this.create();
    }

    create() {
        const data = this.data;
        const material = new MeshBasicMaterial({
            envMap: data.envMap,
            side: data.side,
            refractionRatio: 0,
            reflectivity: 1,
            transparent: data.transparent,
            opacity: data.opacity
        });
        const geometry = new SphereGeometry(data.radius, data.widthSegments, data.heightSegments);

        this.plastic = new Mesh(geometry, material);
    }

    getMap() {
        return this.plastic.material.envMap;
    }

    setMap(texture) {
        const tempMap = this.plastic.material.envMap;

        texture.mapping = CubeRefractionMapping;
        texture.needsUpdate = true;
        
        this.plastic.material.envMap = texture;
        tempMap.dispose();
    }

    getPlastic() {
        return this.plastic;
    }

    addTo(scene) {
        scene.add(this.plastic);
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