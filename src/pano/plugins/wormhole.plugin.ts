import {Texture, Raycaster, } from 'three';
import ResourceLoader from '../loaders/resource.loader';
import Tween from '../animations/tween.animation';
import Pano from '../pano';
import Inradius from '../plastic/inradius.plastic';
// 聚光灯
import Light from '../plastic/light.plastic';
import Shadow from '../plastic/shadow.plastic';
import Log from '../../core/log';
import Util from '../../core/util';

/**
 * @file wormhole space through effection
 * 在全景天空盒中, 相机指向 (0, 0, 1), 即右手坐标系 z 轴正方向
 * 在盒内实际上看的是反向贴图, 穿梭后要将相机恢复
 */

const myLoader = new ResourceLoader();
export default class Wormhole {
    pano: Pano;
    onDetect: Function;
    data: any;
    vector: any;
    texture: any;
    backTexture: any;
    hole: Inradius;
    light: Light;
    shadow: Shadow;
    direction = true;
    raycaster = new Raycaster();

    constructor(pano: Pano, data) {
        this.data = data;
        this.pano = pano;
        this.onDetect = evt => this.detect(evt);

        pano.subscribe('scene-init', this.create, this);
    }

    create() {
        const data = this.data;
        const pano = this.pano;       
        const vector = this.vector = Util.calcSphereToWorld(data.lng, data.lat);

        myLoader.loadTexture(data.bxlPath || data.texPath).then((texture: Texture) => {
            const hole = this.hole = new Inradius({
                light: true,
                cloud: true,
                position: vector,
                radius: 100, 
                envMap: this.texture = texture,
            });
            hole.addBy(pano);
            
            const light = this.light = new Light();
            light.setPosition(vector.x, vector.y, vector.z -200);
            light.setTarget(hole);
            light.addBy(pano);

            // render shadow
            // pano.enableShadow();
            this.bindEvents();
        }).catch(e => Log.errorLog(e));
    }

    bindEvents() {
        const pano = this.pano;

        pano.getCanvas().addEventListener('click', this.onDetect);
        pano.subscribe('render-process', this.rotate, this);
    }

    detect(evt) {
        const pano = this.pano;
        const camera = pano.getCamera();
        const size = pano.getSize();
        const raycaster = this.raycaster;
        const pos = {
            x: (evt.clientX / size.width) * 2 - 1,
            y: -(evt.clientY / size.height) * 2 + 1
        };

        raycaster.setFromCamera(pos, camera);
        const intersects = raycaster.intersectObjects([this.hole.plastic]);

        if (intersects.length) {
            const vector = pano.getLookAtTarget();
            const target = this.vector.clone();
            // camera lookAt.z > camera position.z
            target.z += this.direction ? 100 : -100;
 
            // camera lookAt
            new Tween(vector).to(target).effect('quintEaseIn', 1000)
                .start(['x', 'y', 'z'], pano)
                .complete(() => {
                    // camera position
                    new Tween(camera.position).to(this.vector).effect('quadEaseOut', 1000)
                        .start(['x', 'y', 'z'], pano)
                        .complete(() => {
                            this.finish();
                            this.addBackDoor();
                        });
                });
        }
    }

    rotate() {
        this.hole.addRotate(0.01);
    }

    finish() {
        const pano = this.pano;

        pano.unsubscribe('scene-init', this.create, this);
        pano.unsubscribe('render-process', this.rotate, this);

        this.backTexture = pano.skyBox.getMap();
        pano.skyBox.setMap(this.texture);
        pano.removeSceneObject(this.hole);

        pano.getCamera().position.set(0, 0, 0);
        pano.getLookAtTarget().set(0, 0, this.direction ? 1 : -1);

        pano.removeSceneObject(this.hole);
        pano.getCanvas().removeEventListener('click', this.onDetect);
    }

    addBackDoor() {
        const hole = this.hole;
        const vector = this.vector = Util.calcSphereToWorld(this.direction ? 180 : this.data.lng, 0);
        const z = this.direction ? vector.z + 200 : vector.z - 200;

        hole.setMap(this.texture = this.backTexture);
        hole.setPosition(vector.x, vector.y, vector.z);
        this.light.setPosition(vector.x, vector.y, z);

        this.direction = !this.direction;
        this.bindEvents();
    }
}