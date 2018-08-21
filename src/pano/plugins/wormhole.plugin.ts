import {Texture} from 'three';
import ResourceLoader from '../../loaders/resource.loader';
import Tween from '../animations/tween.animation';
import Inradius from '../plastic/inradius.plastic';
import Log from '../../core/log';
import Util from '../../core/util';
import PubSubAble from '../../interface/pubsub.interface';
import Suspend from '../plastic/suspend.plastic';

/**
 * @file wormhole space through effection
 * 在全景天空盒中, 相机指向 (0, 0, 1), 即右手坐标系 z 轴正方向
 * 在盒内实际上看的是反向贴图, 穿梭后要将相机恢复
 */

const loader = new ResourceLoader();
export default class Wormhole extends PubSubAble {
    pano: any;
    judgeid: any;
    data: any;
    pos: any;
    texture: any;
    backTexture: any;
    hole: Inradius;
    direction = true;

    constructor(pano, data) {
        super();

        this.data = data;
        this.pano = pano;

        this.subscribe(this.Topic.SCENE.LOAD, () => this.create());
    }

    create() {
        const data = this.data;
        const pano = this.pano;
        const pos = this.pos = Util.calcSphereToWorld(data.lng, data.lat);

        // pano.enableShadow();
        loader.loadTexture(data.simg).then((texture: Texture) => {
            const hole = this.hole = new Inradius({
                type: 'fresnel', position: pos, radius: 150,
                envMap: this.texture = texture, text: '测试效果'
            }, pano);
            hole.addBy(pano);

            this.judgeid = this.pano.overlays.addJudgeFunc(this.detect.bind(this));
        }).catch(e => Log.errorLog(e));

        const suspend = new Suspend({map: pano.skyBox.getMap()}, pano);
    }

    detect(pos) {
        if (!this.hole.isMount()) {
            return;
        }

        const pano = this.pano;
        const camera = pano.getCamera();
        const intersects = Util.intersect(pos, [this.hole.plastic], camera);

        if (intersects) {
            const lookTarget = pano.getLookAtTarget();
            const pos = this.pos.clone();
            // camera lookAt.z > camera position.z
            pos.z += this.direction ? 1 : -1;

            // camera lookAt
            new Tween(lookTarget, pano.ref).to(pos).effect('cubeInOut', 1500)
                .start(['x', 'y', 'z']);

            new Tween(camera.position, pano.ref).to(this.pos).effect('cubeInOut', 2000)
                .start(['x', 'y', 'z']).complete(() => {
                    this.finish();
                    this.addBackDoor();
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
        const plastic = hole.getPlastic();
        const pos = this.pos = Util.calcSphereToWorld(this.direction ? 180 : this.data.lng, 0);

        hole.setMap(this.texture = this.backTexture);
        hole.setPosition(pos.x, pos.y, pos.z);
        plastic.rotateY(Math.PI);
        
        this.direction = !this.direction;
    }

    dispose() {
        super.dispose();
        this.pano.overlays.reMoveJudgeFunc(this.judgeid);
    }
}