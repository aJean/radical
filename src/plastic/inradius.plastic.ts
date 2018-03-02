import {BackSide, MeshBasicMaterial, SphereGeometry, Mesh, CubeRefractionMapping, Math as TMath} from 'three';

/**
 * @file 内切球
 */

const defaultOpts = {
    side: BackSide,
    radius: 2000,
    widthSegments: 30,
    heightSegments: 16
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
            reflectivity: 1
        });
        const geometry = new SphereGeometry(data.radius, data.widthSegments, data.heightSegments);

        this.plastic = new Mesh(geometry, material);
    }

    getMap() {
        return this.plastic.material.envMap;
    }

    setMap(texture, slient) {
        const tempMap = this.plastic.material.envMap;

        this.plastic.material.envMap = texture;
        !slient && tempMap.dispose();
    }

    getPlastic() {
        return this.plastic;
    }

    addTo(scene) {
        scene.add(this.plastic);
    }

    dispose() {
        this.plastic.material.envMap.dispose();
        this.plastic.material.dispose();
    }
}