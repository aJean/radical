import { Scene, Mesh, SpotLight, SphereGeometry, MeshBasicMaterial, Raycaster, CubeReflectionMapping, PerspectiveCamera, Quaternion } from 'three';
import ResourceLoader from '../loaders/resource.loader';
import Log from '../../core/log';
import Util from '../../core/util';
import Tween from '../animations/tween.animation';

/**
 * @file 悬浮
 */

const myLoader = new ResourceLoader();
export default class Suspend {
    opts: any;
    pano: any;
    scene: any;
    camera: any;
    sphere: any;
    throughing = false;
    raycaster = new Raycaster();

    constructor(opts, pano) {
        this.pano = pano;
        this.opts = Object.assign({}, opts);
        this.onThrough = this.onThrough.bind(this);
        this.create();

        pano.subscribe('render-process', this.update, this);
        pano.getCanvas().addEventListener('click', this.onThrough);
    }

    create() {
        const opts = this.opts;
        const scene = this.scene = new Scene();
        const camera = this.camera = new PerspectiveCamera(1, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(0, 0, 1000);
        const pos = Util.calcSphereToWorld(opts.lng, opts.lat);
        
        myLoader.loadTexture(opts.bxlPath || opts.texPath).then((texture: any) => {
            // texture.mapping = CubeReflectionMapping;
            const sphere = this.sphere = new Mesh(new SphereGeometry(200, 48, 24),
                new MeshBasicMaterial({envMap: texture}));

            scene.add(sphere);
            this.pano.webgl.autoClear = false;
        }).catch(e => Log.errorLog(e));
    }

    update() {
        const webgl = this.pano.webgl;
        const camera = this.camera;        
        
        if (this.sphere && !this.throughing) {
            const pcamera = this.pano.getCamera();
            const vector = pcamera.getWorldDirection();
            vector.x *= 1000;
            vector.y *= 1000;
            vector.z *= 1000;

            camera.position.copy(vector);
            camera.fov = pcamera.fov;
            camera.updateProjectionMatrix();
            camera.lookAt(this.sphere.position);
        }

        webgl.render(this.scene, camera);
    }

    onThrough(e) {
        const pano = this.pano;
        const camera = this.camera;
        const raycaster = this.raycaster;
        const size = pano.getSize();
        const pos = {
            x: (e.clientX / size.width) * 2 - 1,
            y: -(e.clientY / size.height) * 2 + 1
        };

       const ret = Util.intersect(pos, [this.sphere], this.camera);

        if (ret) {
            this.throughing = true;
            console.log(camera.position)
            new Tween(camera.position).to(this.sphere.position).effect('quintEaseIn', 1000)
                .start(['x', 'y', 'z'], this.pano).process((val) => {
                    // pano.getCamera().position.z = -val;
                    // camera.lookAt(this.sphere.position);
                });
        }
    }

    dispose() {
        const pano = this.pano;
        pano.webgl.autoClear = true;

        pano.subscribe('render-process', this.update, this);
        pano.getCanvas().removeEventListener('click', this.onThrough);
    }
}