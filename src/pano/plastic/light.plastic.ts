import { SpotLight, DirectionalLight, PointLight, CameraHelper } from 'three';
import Plastic from '../../interface/plastic.interface';

/**
 * @file 光源
 */

const defaultOpts = {
    type: 1,
    color: 0xffffff,
    intensity: 1,
    angle: 90,
    debug: false,
    x: 0,
    y: 0,
    z: 0
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
        const light = this.plastic = opts.type == 1 ? new SpotLight(opts.color, opts.intensity, 0, opts.angle)
            : new PointLight(opts.color, opts.intensity, 0, 2);

        this.setPosition(opts.x, opts.y, opts.z);
        
        if (opts.target) {
            this.setTarget(opts.target);
        }

        if (opts.debug) {
            light.castShadow = true;
            this.helper = new CameraHelper(light.shadow.camera);
        }
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