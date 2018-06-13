import {TextureLoader, MeshBasicMaterial, PlaneGeometry, Mesh} from 'three';
import PluggableOverlay from '../../interface/overlay.interface';

/**
 * @file mesh overlay, static return three mesh object
 * @todo normalization object
 */

const defaultOpts = {
    width: 80,
    height: 80
};
export default class MeshOverlay extends PluggableOverlay {
    type = "mesh";

    constructor(data, vector?) {
        super();

        this.data = Object.assign({}, defaultOpts, data);
        this.create();
        vector && this.particle.lookAt(vector);
    }

    create() {
        const data = this.data;
        const texture = new TextureLoader().load(data.img);
        const material = new MeshBasicMaterial({
            map: texture,
            transparent: true
        });
        const plane = new PlaneGeometry(data.width, data.height);
        const planeMesh = this.particle = new Mesh(plane, material);

        planeMesh.position.set(data.location.x, data.location.y, data.location.z);
        planeMesh.name = data.id;
        planeMesh['instance'] = this;
    }

    update() {}
}