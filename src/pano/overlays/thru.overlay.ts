import {TextureLoader, MeshBasicMaterial, PlaneGeometry, Mesh} from 'three';
import {IPluggableOverlay} from '../interface/overlay.interface';
import Tween from '../animations/tween.animation';

/**
 * @file 星际穿越 overlay
 */

const defaultOpts = {
    width: 100,
    height: 100
};
export default class MeshOverlay implements IPluggableOverlay {
    data: any;
    particle: any;
    pano: any;
    type = "thru";

    constructor (data, pano) {
        this.pano = pano;
        this.data = Object.assign({}, defaultOpts, data);;
        this.particle = this.create();
    }

    create() {
        const data = this.data;
        const texture = new TextureLoader().load(data.img);
        const material = new MeshBasicMaterial({
            map: texture,
            opacity: 0,
            transparent: true
        });
        const plane = new PlaneGeometry(data.width, data.height);
        const planeMesh = new Mesh(plane, material);

        planeMesh.position.set(data.location.x, data.location.y, data.location.z);
        planeMesh.name = data.id;
        planeMesh['instance'] = this;

        planeMesh.lookAt(this.pano.getCamera().position);
        return planeMesh;
    }

    update() {}

    show() {
        const particle = this.particle;
        particle.visible = true;

        new Tween(particle.material).to({opacity: 1}).effect('quintEaseIn', 1000)
            .start(['opacity'], this.pano);
    }

    hide() {
        const particle = this.particle;
        
        new Tween(particle.material).to({opacity: 0}).effect('quintEaseIn', 1000)
            .start(['opacity'], this.pano).complete(() => particle.visible = false);
    }

    dispose() {
        delete this.particle['instance'];
        this.particle.geometry.dispose();
    }
}