import { PlaneGeometry, ShadowMaterial, Mesh, DoubleSide } from 'three';
import Plastic from '../../interface/plastic.interface';

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
    constructor(opts ? ) {
        super();
        this.opts = Object.assign({}, defaultOpts, opts);
        this.create();
    }

    create() {
        const opts = this.opts;
        const plane = this.plastic = new Mesh(new PlaneGeometry(opts.width, opts.height, 32),
            new ShadowMaterial({side: DoubleSide, opacity: opts.opacity}));

        plane.rotateX(opts.rad);
        plane.position.set(opts.x, opts.y, opts.z);
        plane.receiveShadow = true;
    }
}