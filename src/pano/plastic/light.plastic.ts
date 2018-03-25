import {SpotLight, CameraHelper} from 'three';

const defaultOpts = {
    color: 0xffffff,
    intensity: 1,
    debug: false
};

export default class Light {
    data: any;
    plastic: any;
    helper: any;

    constructor(opts?) {
        this.data = Object.assign({}, defaultOpts, opts);
        this.create();
    }

    create() {
        const data = this.data;
        const light = this.plastic = new SpotLight(data.color, data.intensity);

        if (data.position) {
            this.setPosition(data.position.x, data.position.y, data.position.z);
        }

        if (data.debug) {
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