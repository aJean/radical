import { Scene, Mesh, SphereGeometry, MeshBasicMaterial, CubeReflectionMapping, PerspectiveCamera, Quaternion } from 'three';
import ResourceLoader from '../loaders/resource.loader';
import Log from '../../core/log';

/**
 * @file 悬浮
 */

const myLoader = new ResourceLoader();
export default class Suspend {
    pano: any;
    scene: any;
    sphere: any;
    oldLook: any;

    constructor(opts, pano) {
        const webgl = pano.webgl;
        const scene = new Scene();
        const camera = new PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 100000);
        camera.position.set(0, 0, 1000);

        webgl.autoClear = false;
        myLoader.loadTexture(opts.bxlPath || opts.texPath).then((texture: any) => {
            texture.mapping = CubeReflectionMapping;
            const sphere = this.sphere = new Mesh(new SphereGeometry(200, 48, 24),
                new MeshBasicMaterial({ envMap: texture }));

            scene.add(sphere);

        }).catch(e => Log.errorLog(e));

        this.oldLook = pano.getLook();
        pano.subscribe('render-process', () => {
            if (this.sphere) {
                const vector = pano.getCamera().getWorldDirection();
                vector.x *= 1000;
                vector.y *= 1000;
                vector.z *= 1000;
                
                camera.position.copy(vector);
                camera.lookAt(this.sphere.position);                
            }
            webgl.render(scene, camera);
        });
    }
}