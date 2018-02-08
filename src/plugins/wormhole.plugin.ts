import {Texture, CubeTextureLoader, Raycaster, BackSide, MeshBasicMaterial, SphereGeometry, Mesh, CubeRefractionMapping, Vector3} from 'three';
import ResourceLoader from '../loaders/resource.loader';
import Panoram from '../panoram';
import Log from '../log';
import Util from '../util';
import Tween from '../animations/tween.animation';

/**
 * @file wormhole space through effection
 * 在全景天空盒中, 相机指向 (0, 0, 1), 即右手坐标系 z 轴正方向
 * 在盒内实际上看的是反向贴图
 * 穿梭后要将相机恢复
 */

const myLoader = new ResourceLoader();
export default class Wormhole {
    panoram: Panoram;
    onDetect: Function;
    data: any;
    vector: any;
    texture: any;
    box: any;
    backTexture: any;
    direction = true;
    raycaster = new Raycaster();

    constructor(panoram: Panoram, data) {
        this.data = data;
        this.panoram = panoram;
        this.onDetect = evt => this.detect(evt);

        panoram.subscribe('scene-init', this.create, this);
    }

    create() {
        const data = this.data;
        const panoram = this.panoram;
        const cubeLoader = new CubeTextureLoader();
        const geometry = new SphereGeometry(100, 32, 16);
        const material = new MeshBasicMaterial({
            side: BackSide,
            refractionRatio: 0,
            reflectivity: 1
        });
        const box = this.box = new Mesh(geometry, material);
        const vector = this.vector = Util.calcSphereToWorld(data.lng, data.lat);

        myLoader.loadTexture(data.bxlPath || data.texPath).then((texture: Texture) => {
            texture.mapping = CubeRefractionMapping;
            material.envMap = this.texture = texture;
            box.position.set(vector.x, vector.y, vector.z);

            panoram.addSceneObject(box);
            this.bindEvents();
        }).catch(e => Log.errorLog(e));
    }

    bindEvents() {
        const panoram = this.panoram;

        panoram.getCanvas().addEventListener('click', this.onDetect);
        panoram.subscribe('render-process', this.rotate, this);
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
            const vector = panoram.getLookAtTarget();
            const target = this.vector.clone();
            // camera lookAt.z > camera position.z
            target.z += this.direction ? 100 : -100;
 
            // camera lookAt
            new Tween(vector).to(target).effect('quintEaseIn', 1000)
                .start(['x', 'y', 'z'], panoram)
                .complete(() => {
                    // camera position
                    new Tween(camera.position).to(this.vector).effect('quadEaseOut', 1000)
                        .start(['x', 'y', 'z'], panoram)
                        .complete(() => {
                            this.finish();
                            this.addBackDoor();
                        });
                });
        }
    }

    rotate() {
        this.box.rotation.x += 0.01;
        this.box.rotation.y += 0.01;
        this.box.rotation.z += 0.01;
    }

    finish() {
        const panoram = this.panoram;

        panoram.unsubscribe('scene-init', this.create, this);
        panoram.unsubscribe('render-process', this.rotate, this);

        this.backTexture = panoram.skyBox.material.envMap;
        panoram.skyBox.material.envMap = this.texture;
        panoram.removeSceneObject(this.box);

        panoram.getCamera().position.set(0, 0, 0);
        panoram.getLookAtTarget().set(0, 0, this.direction ? 1 : -1);

        panoram.removeSceneObject(this.box);
        panoram.getCanvas().removeEventListener('click', this.onDetect);
    }

    addBackDoor() {
        const geometry = new SphereGeometry(100, 32, 16);
        const material = new MeshBasicMaterial({
            side: BackSide,
            refractionRatio: 0,
            reflectivity: 1
        });
        material.envMap = this.texture = this.backTexture;
        const box = this.box = new Mesh(geometry, material);
        const vector = this.vector = Util.calcSphereToWorld(this.direction ? 180 : this.data.lng, 0);
        box.position.set(vector.x, vector.y, vector.z);

        this.direction = !this.direction;
        this.panoram.addSceneObject(box);
        this.bindEvents();
    }
}