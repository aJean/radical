import {TextureLoader, MeshBasicMaterial, CircleGeometry, Mesh, Vector3, Spherical, PerspectiveCamera} from 'three';
import {IPluggableOverlay} from '../interface/overlay.interface';
import Tween from '../animations/tween.animation';
import Util from '../../core/util';

/**
 * @file 星际穿越 overlay
 */

const defaultOpts = {
    radius: 50,
    effect: 'scale',
    factor: 500
};
export default class ThruOverlay implements IPluggableOverlay {
    data: any;
    particle: any;
    pano: any;
    type = "thru";

    constructor (data, pano) {
        this.pano = pano;
        this.data = Util.assign({}, defaultOpts, data);
        this.particle = this.create();
    }

    create() {
        const data = this.data;
        const texture = new TextureLoader().load(data.img);
        const material = new MeshBasicMaterial({
            map: texture,
            opacity: data.effect == 'scale' ? 1 : 0,
            transparent: true
        });
        const plane = new CircleGeometry(data.radius, 30, 30);
        const planeMesh = new Mesh(plane, material);

        planeMesh.name = data.id;
        planeMesh['instance'] = this;

        return planeMesh;
    }

    update() {}

    getIncrement() {
        return (1 - Math.random() * 2) * this.data.factor;
    }

    getVector() {
        const projectCamera = this.pano.getCamera().clone();
        projectCamera.far = 1200;
        projectCamera.updateProjectionMatrix();

        return new Vector3(0, 0, 1).unproject(projectCamera);
    }

    show() {
        const particle = this.particle;
        const pano = this.pano;
        const vector = this.getVector();

        particle.position.set(vector.x + this.getIncrement(), vector.y + this.getIncrement(), vector.z);
        particle.lookAt(pano.getCamera().position);
        
        particle.visible = true;
        this.data.effect == 'scale'
            ? new Tween({scale: 0}).to({scale: 1}).effect('backOut', 1000)
                .start(['scale'], pano).process(val => particle.scale.set(val, val, 1)) 
            : new Tween(particle.material).to({opacity: 1}).effect('quintEaseIn', 1000)
                .start(['opacity'], pano);
    }

    hide() {
        const particle = this.particle;
        
        this.data.effect == 'scale'
            ? new Tween({scale: 1}).to({scale: 0}).effect('backOut', 1000)
                .start(['scale'], this.pano).process(val => particle.scale.set(val, val, 1))
                .complete(() => particle.visible = false)
            : new Tween(particle.material).to({opacity: 0}).effect('quintEaseIn', 1000)
            .start(['opacity'], this.pano).complete(() => particle.visible = false);
    }

    dispose() {
        delete this.particle['instance'];
        this.particle.geometry.dispose();
    }
}