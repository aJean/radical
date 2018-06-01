import { SpotLight, CameraHelper } from 'three';
import Plastic from './plastic';

/**
 * @file 聚光灯
 */

const defaultOpts = {
    color: 0xffffff,
    intensity: 1,
    debug: false
};
export default class Light extends Plastic {
    helper: any;

    constructor(opts ? ) {
        super();
        this.opts = Object.assign({}, defaultOpts, opts);
        this.create();
    }

    create() {
        const opts = this.opts;
        const light = this.plastic = new SpotLight(opts.color, opts.intensity);

        if (opts.position) {
            this.setPosition(opts.position.x, opts.position.y, opts.position.z);
        }

        if (opts.debug) {
            light.castShadow = true;
            this.helper = new CameraHelper(light.shadow.camera);
        }
    }

    setPosition(x, y, z) {
        this.plastic.position.set(x, y, z);
    }

    setTarget(obj) {
        this.plastic.target = obj.plastic || obj;
    }

    addTo(scene) {
        scene.add(this.plastic);
        this.helper && scene.add(this.helper);
    }

    addBy(pano) {
        pano.addSceneObject(this.plastic);
        this.helper && pano.addSceneObject(this.helper);
    }
}