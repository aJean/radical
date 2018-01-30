import {TextureLoader, MeshBasicMaterial, PlaneGeometry, Mesh} from 'three';
import {IPluggableOverlay} from './interface.overlay';

/**
 * @file mesh overlay, static return three mesh object
 * @todo normalization object
 */

export default class MeshOverlay implements IPluggableOverlay {
    data: any;
    particle: any;
    type = "mesh";

    constructor (data) {
        this.data = data;
        this.particle = this.create();
    }

    create() {
        const data = this.data;
        const loader = new TextureLoader();
        const texture = loader.load(data.img);

        const material = new MeshBasicMaterial({
            map: texture,
            transparent: true
        });

        const scale = 1;
        const plane = new PlaneGeometry(data.width * scale, data.height * scale);
        const planeMesh = new Mesh(plane, material);

        planeMesh.position.set(data.location.x, data.location.y, data.location.z);
        planeMesh.name = data.id;
        planeMesh['instance'] = this;

        return planeMesh;
    }

    update() {}

    show() {
        this.particle.visible = true;
    }

    hide() {
        this.particle.visible = false;
    }

    dispose() {
        delete this.particle['instance'];
        this.particle.geometry.dispose();
    }
}