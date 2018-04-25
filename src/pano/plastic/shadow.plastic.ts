import {PlaneGeometry, ShadowMaterial, Mesh, DoubleSide} from 'three';
import Plastic from './abstract.plastic';

/**
 * @file 阴影接收平面, 首先要有光
 */

const defaultOpts = {
    width: 1000,
    height: 1000,
    rad: Math.PI / 2,
    opacity: 0.2,
    x: 0,
    y: 0,
    z: 0
};
export default class Shadow extends Plastic {
    data: any;
    plastic: any;

    constructor(opts?) {
        super();
        this.data = Object.assign({}, defaultOpts, opts);
        this.create();
    }

    create() {
        const data = this.data;
        const geometry = new PlaneGeometry(data.width, data.height, 32);
        const material = new ShadowMaterial({side: DoubleSide});
        material.opacity = data.opacity;

        const plane = this.plastic = new Mesh(geometry, material);
        plane.rotateX(data.rad);        
        plane.position.set(data.x, data.y, data.z);
        plane.receiveShadow = true;
    }
}
