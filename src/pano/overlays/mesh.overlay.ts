import {TextureLoader, MeshBasicMaterial, PlaneGeometry, Mesh} from 'three';
import {IPluggableOverlay} from '../../interface/overlay.interface';

/**
 * @file mesh overlay, static return three mesh object
 * @todo normalization object
 */

export default class MeshOverlay implements IPluggableOverlay {
    data: any;
    particle: any;
    type = "mesh";

    constructor (data, vector?) {
        this.data = data;
        this.particle = this.create();
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
        const particle = this.particle;

        delete particle['instance'];
        particle.geometry.dispose();
        particle.material.map.dispose();
        particle.material.dispose();
    }
}