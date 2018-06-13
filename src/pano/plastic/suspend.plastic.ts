import { Scene, Mesh, SphereGeometry, MeshBasicMaterial, CubeReflectionMapping, PerspectiveCamera, Vector3 } from 'three';
import ResourceLoader from '../loaders/resource.loader';
import Log from '../../core/log';
import Util from '../../core/util';
import Plastic from '../../interface/plastic.interface';

/**
 * @file 悬浮球
 */

const myLoader = new ResourceLoader();
export default class Suspend extends Plastic {
    scene: any;
    camera: any;
    sphere: any;
    toscene: any;
    subtoken: any;

    constructor(opts, pano) {
        super();
        
        this.pano = pano;
        this.opts = Object.assign({}, opts);
        this.onThrough = this.onThrough.bind(this);
        this.create();

        this.subscribe(this.Topic.RENDER.PROCESS, () => this.update());
        pano.getCanvas().addEventListener('click', this.onThrough);
    }

    create() {
        const opts = this.opts;
        const scene = this.scene = new Scene();
        const camera = this.camera = new PerspectiveCamera(110, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(0, 0, 1000);
        const pos = Util.calcSphereToWorld(opts.lng, opts.lat);
        
        myLoader.loadTexture(opts.bxlPath || opts.texPath).then((texture: any) => {
            texture.mapping = CubeReflectionMapping;
            const sphere = this.sphere = new Mesh(new SphereGeometry(200, 48, 24),
                new MeshBasicMaterial({envMap: texture}));

            scene.add(sphere);
            this.pano.webgl.autoClear = false;
        }).catch(e => Log.errorLog(e));

        this.toscene = {bxlPath: opts.bxlPath, texPath: opts.texPath};
    }

    update() {
        const webgl = this.pano.webgl;
        const camera = this.camera;        
        
        if (this.sphere) {
            const pcamera = this.pano.getCamera();
            const vector = new Vector3();
            pcamera.getWorldDirection(vector);
            vector.x *= 1000;
            vector.y *= 1000;
            vector.z *= 1000;

            camera.position.copy(vector);
            camera.lookAt(this.sphere.position);
        }

        webgl.render(this.scene, camera);
    }

    onThrough(e) {
        const sphere = this.sphere;
        const pano = this.pano;
        const camera = this.camera;
        const size = pano.getSize();
        const pos = {
            x: (e.clientX / size.width) * 2 - 1,
            y: -(e.clientY / size.height) * 2 + 1
        };

        const ret = Util.intersect(pos, [this.sphere], this.camera);

        if (ret) {
            const data = this.toscene;
            this.toscene = pano.currentData;
            pano.enterNext(data);
            sphere.material.envMap = pano.skyBox.getMap();
        }
    }

    dispose() {
        super.dispose();
        
        const pano = this.pano;
        pano.webgl.autoClear = true;
        pano.getCanvas().removeEventListener('click', this.onThrough);
    }
}