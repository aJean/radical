import {PlaneGeometry, MeshLambertMaterial, Mesh, DoubleSide} from 'three';

/**
 * @file 阴影接收平面, 首先要有光
 */

const defaultOpts = {
    width: 1000,
    height: 1000,
    rad: Math.PI / 4,
    opacity: 0.2,
    x: 0,
    y: 0,
    z: 0
};
export default class Shadow {
    data: any;
    plastic: any;

    constructor(opts?) {
        this.data = Object.assign({}, defaultOpts, opts);
        this.create();
    }

    create() {
        const data = this.data;
        const geometry = new PlaneGeometry(data.width, data.height, 32);
        const material = new MeshLambertMaterial({color: 0xffffff, side: DoubleSide});
        // material.opacity = data.opacity;

        const plane = this.plastic = new Mesh(geometry, material);
        plane.receiveShadow = true;
        plane.rotateX(data.rad);        
        plane.position.set(data.x, data.y, data.z);
    }

    setPosition(x, y, z) {
        this.plastic.position.set(x, y, z);
    }

    addTo(scene) {
        scene.add(this.plastic);
    }

    addBy(pano) {
        pano.addSceneObject(this.plastic);
    }
}
