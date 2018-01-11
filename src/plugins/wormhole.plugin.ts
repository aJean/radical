import {CubeTextureLoader, Raycaster, BackSide, MeshBasicMaterial, SphereGeometry, Mesh, CubeRefractionMapping} from 'three';
import Loader from '../loader';
import Panoram from '../panoram';
import Log from '../log';
import Util from '../util';
import Tween from '../animation/tween.animation';

/**
 * @file wormhole space through effection
 */

export default class Wormhole {
    panoram: Panoram;
    onDetect: Function;
    data: any;
    vector: any;
    texture: any;
    box: any;
    isActive = false;
    raycaster = new Raycaster();

    constructor(panoram: Panoram, data) {
        this.data = data;
        this.panoram = panoram;
        this.onDetect = evt => this.detect(evt);

        panoram.subscribe('scene-init', this.create, this);
        panoram.getCanvas().addEventListener('click', this.onDetect);
    }

    create() {
        const data = this.data;
        const panoram = this.panoram;
        const loader = new CubeTextureLoader();
        const geometry = new SphereGeometry(100, 32, 16);
        const material = new MeshBasicMaterial({
            side: BackSide,
            refractionRatio: 0,
            reflectivity: 1
        });
        const box = this.box = new Mesh(geometry, material);
        const vector = this.vector = Util.calcSpherical(data.lng, data.lat);

        Loader.loadSceneTex(data.bxlPath).then(textures => {
            if (textures) {
                loader.load(textures, tex => {
                    tex.mapping = CubeRefractionMapping;
                    material.envMap = this.texture = tex;
                    box.position.set(vector.x, vector.y, vector.z);
                    panoram.addSceneObject(box);
                    panoram.subscribe('render-process', this.motion, this);
                });
            } else {
                Log.errorLog('load textures error');
            }
        }).catch(e => Log.errorLog(e));
    }

    detect(evt) {
        const panoram = this.panoram;
        const camera = panoram.getCamera();
        const raycaster = this.raycaster;
        const element = panoram.getCanvas();
        const pos = {
            x: (evt.clientX / element.clientWidth) * 2 - 1,
            y: -(evt.clientY / element.clientHeight) * 2 + 1
        };

        raycaster.setFromCamera(pos, camera);
        const intersects = raycaster.intersectObjects([this.box]);

        if (intersects.length) {
            // this.isActive = true;
            const vector = panoram.getLookAtTarget();
            const target = this.vector.clone();
            target.z += 100;


            // camera lookAt
            new Tween(vector).to(target).effect('quintEaseIn', 1000)
                .start(['x', 'y', 'z'], panoram)
                .complete(() => {
                    // camera position
                    new Tween(camera.position).to(this.vector).effect('quadEaseOut', 1000)
                        .start(['x', 'y', 'z'], panoram)
                        .complete(() => {
                            this.upgrade();
                        });
                });
        }
    }

    motion() {
        this.rotate();
        this.isActive && this.through();
    }

    rotate() {
        this.box.rotation.x += 0.01;
        this.box.rotation.y += 0.01;
        this.box.rotation.z += 0.01;
    }

    through() {
        const camera = this.panoram.getCamera();
        const vector = this.vector;

        if (camera.position.z < vector.z - 100) {
            camera.position.z += 10;
            camera.lookAt(vector);
        } else {
            camera.position.z = 0;
            this.upgrade();
        }
    }

    upgrade() {
        const panoram = this.panoram;

        panoram.unsubscribe('scene-init', this.create, this);
        panoram.unsubscribe('render-process', this.motion, this);

        panoram.replaceTexture(this.texture);
        panoram.removeSceneObject(this.box);

        panoram.getCamera().position.set(0, 0, 0);
        panoram.getLookAtTarget().set(0, 0, 1);

        panoram.removeSceneObject(this.box);
        panoram.getCanvas().removeEventListener('click', this.onDetect);
    }
}