import { Texture } from 'three';
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
    pos: any;
    texture: any;
    backTexture: any;
    hole: Inradius;
    light: Light;
    shadow: Shadow;
    direction = true;

    constructor(pano: Pano, data) {
        this.data = data;
        this.pano = pano;

        this.onDetect = evt => this.detect(evt);
        this.bindEvents();
    }

    create() {
        const data = this.data;
        const pano = this.pano;
        const pos = this.pos = Util.calcSphereToWorld(data.lng, data.lat);

        // pano.enableShadow();
        myLoader.loadTexture(data.bxlPath || data.texPath).then((texture: Texture) => {
            const hole = this.hole = new Inradius({
                rotate: true,
                shadow: true,
                cloud: true,
                position: pos,
                radius: 100,
                envMap: this.texture = texture
            }, pano);
            hole.addBy(pano);

            const light = this.light = new Light({
                target: hole,
                position: {x: pos.x, y: pos.y, z: pos.z - 200}
            });
            light.addBy(pano);
        }).catch(e => Log.errorLog(e));
    }

    bindEvents() {
        const pano = this.pano;

        pano.subscribe('scene-init', this.create, this);
        pano.getCanvas().addEventListener('click', this.onDetect);
    }

    detect(evt) {
        const pano = this.pano;
        const camera = pano.getCamera();
        const size = pano.getSize();
        const pos = {
            x: (evt.clientX / size.width) * 2 - 1,
            y: -(evt.clientY / size.height) * 2 + 1
        };
        const intersects =  Util.intersect(pos, [this.hole.plastic], camera);

        if (intersects) {
            const lookTarget = pano.getLookAtTarget();
            const pos = this.pos.clone();
            // camera lookAt.z > camera position.z
            pos.z += this.direction ? 100 : -100;

            // camera lookAt
            new Tween(lookTarget).to(pos).effect('quintEaseIn', 1000)
                .start(['x', 'y', 'z'], pano)
                .complete(() => {
                    // camera position
                    new Tween(camera.position).to(this.pos).effect('quadEaseOut', 1000)
                        .start(['x', 'y', 'z'], pano)
                        .complete(() => {
                            this.finish();
                            this.addBackDoor();
                        });
                });
        }
    }

    finish() {
        const pano = this.pano;

        this.backTexture = pano.skyBox.getMap();
        pano.skyBox.setMap(this.texture);

        pano.getCamera().position.set(0, 0, 0);
        pano.getLookAtTarget().set(0, 0, this.direction ? 1 : -1);
    }

    /**
     * 添加 back hole
     */
    addBackDoor() {
        const hole = this.hole;
        const pos = this.pos = Util.calcSphereToWorld(this.direction ? 180 : this.data.lng, 0);
        const z = this.direction ? pos.z + 200 : pos.z - 200;

        hole.setMap(this.texture = this.backTexture);
        hole.setPosition(pos.x, pos.y, pos.z);
        this.light.setPosition(pos.x, pos.y, z);

        this.direction = !this.direction;
    }

    dispose() {
        const pano = this.pano;

        pano.unsubscribe('scene-init', this.create, this);
        pano.getCanvas().removeEventListener('click', this.onDetect);
    }
}