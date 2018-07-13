import { PlaneGeometry, MeshBasicMaterial, Mesh, DoubleSide } from 'three';
import Plastic from '../../interface/plastic.interface';

/**
 * @file line
 */

const defaultOpts = {
    name: '',
    width: 256,
    height: 256,
    order: 5,
    x: 0,
    y: 0,
    z: 0
};
export default class Line extends Plastic {
    constructor(opts) {
        super();

        this.opts = Object.assign({}, defaultOpts, opts);
        this.create();
    }

    create() {
        const opts = this.opts;
        const mesh: any = this.plastic = new Mesh(new PlaneGeometry(opts.width, opts.height),
            new MeshBasicMaterial({
                color: '#eee',
                depthTest: false,
                side: DoubleSide,
                transparent: true,
                opacity: .8
            }));
        // delete before dispose
        mesh.wrapper = this;
        mesh.position.set(opts.x, opts.y, opts.z);
        mesh.renderOrder = opts.order;
        mesh.name = opts.name;

        if (opts.hide) {
            mesh.visible = false;
        }

        if (opts.parent) {
            this.addTo(opts.parent);
        }

        return mesh;
    }

    dispose() {
        delete this.plastic['wrapper'];
        super.dispose();
    }
}