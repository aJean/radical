import PubSubAble from '../../interface/common.interface';
import Text from '../plastic/text.plastic';
import Tween from '../animations/tween.animation';
import Util from '../../core/util';
import Loader from '../loaders/resource.loader';
import Inradius from '../plastic/inradius.plastic';
import Light from '../plastic/light.plastic';

/**
 * @file 星际穿越 plugin
 * 管理穿越点个数, 数据拉取, 展示策略
 */

const defaultOpts = {
    radius: 100,
    lazy: 3000,
    surl: null
};
const loader = new Loader();
export default class Thru extends PubSubAble {
    opts: any;
    jdid: any;
    list: any;
    camera: any;
    pano: any;
    active = false; // prevent excessive click
    timeid = 0;
    group = [];
    objs = [];
    texts = [];
    lights = [];

    constructor(pano, opts) {
        super();

        this.pano = pano;
        this.camera = pano.getCamera();
        this.opts = Util.assign({}, defaultOpts, opts);
        this.onCanvasClick = this.onCanvasClick.bind(this);
        
        const webgl = pano.webgl;
        const Topic = this.Topic;

        // common lights
        this.createLights();

        this.subscribe(pano.frozen ? Topic.SCENE.READY : Topic.SCENE.INIT, this.load.bind(this));
        this.subscribe(Topic.SCENE.ATTACHSTART, this.onSceneChange.bind(this));
        this.subscribe(Topic.SCENE.ATTACH, this.load.bind(this));
        this.subscribe(Topic.UI.IMMERSION, this.onToggle.bind(this));
        this.jdid = pano.overlays.addJudgeFunc(this.onCanvasClick.bind(this));
    }

    load(topic, payload) {
        const scene = payload.scene;
        const list = this.list = scene.recomList;

        if (!list || !list.length || this.objs.length) {
            return;
        }
        // clean current thru list
        this.create(list);
        this.needToShow();
    }

    /**
     * 使用唯一点光源避免互相干扰
     */
    createLights() {
        const light = new Light({intensity: 0.3, type: 2});

        light.addBy(this.pano);
        this.lights.push(light);
    }

    /**
     * 创建穿越点
     */
    create(list) {
        const pano = this.pano;
        const opts = this.opts;
        const group = this.group;
        const objs = this.objs;
        const texts = this.texts;
        const radius = opts.radius;

        list.forEach((item, i) => {
            item.setName && loader.loadTexture(item.image).then(texture => {
                const pos = this.getVector(i);              
                const hole = new Inradius({
                    name: i, shadow: true, position: pos, radius: radius, type: 'cloud', data: item,
                    rotate: true, emissive: '#787878', envMap: texture, hide: true, cloudimg: opts.img
                }, pano);
                const text = new Text({text: item.setName, fontsize: 32, hide: true,
                    x: pos.x, y: pos.y - 140, z: pos.z, shadow: true});
                hole.addBy(pano);
                text.addBy(pano);

                group.push(hole.getPlastic());
                objs.push(hole);
                texts.push(text);
            });
        });
    }

    /**
     * 获取屏幕中心点的世界坐标
     */
    getVector(i) {
        let lng = Math.random() * 60 - 30;
        let lat = Math.random() * 30;

        lng += i * 90;
        return Util.calcSphereToWorld(lng, lat);
    }

    /**
     * lazy 显示穿越点
     */
    needToShow() {
        clearTimeout(this.timeid);
        this.timeid = setTimeout(() => {
            this.publish(this.Topic.THRU.SHOW, {list: this.list, pano: this.pano});
            this.show();
        }, this.opts.lazy);
    }

    /**
     * 显示穿越点
     */
    show() {
        const pano = this.pano;
        const camera = this.camera;

        this.active = true;        
        this.objs.forEach((obj, i) => {
            obj.lookAt(camera.position);
            obj.show();
        });
        this.texts.forEach((text, i) => {
            text.lookAt(camera.position);
            text.show();
        });
    }

    /**
     * 隐藏穿越点
     */
    hide() {
        clearTimeout(this.timeid);
        this.active = false;

        if (this.objs.length) {
            this.objs.forEach(obj => obj.hide());
            this.texts.forEach(text => text.hide());
        }
    }

    /**
     * 场景变换删除穿越点
     */
    onSceneChange() {
        this.cleanup();
        this.hide();
    }

    /**
     * 沉浸模式
     */
    onToggle(topic, payload) {
        clearTimeout(this.timeid);
        payload.should ? this.show() : this.hide();
    }

    /**
     * 判断是否点击穿越点
     */
    onCanvasClick(pos) {
        if (!this.active) {
            return;
        }

        const pano = this.pano;
        const camera = this.camera;
        const group = this.group;
        const surl = this.opts.surl;
        const oldscene = pano.currentData;

        if (group.length) {
            const intersects = Util.intersect(pos, group, pano.getCamera());

            if (intersects) {
                this.active = false;

                const obj: any = intersects[0].object;
                const instance = obj.instance;
                const data = instance.getData();

                if (data) {
                    const id = data.sceneId;
                    const sid = data.setId;
                    loader.fetchUrl(`${surl}&setid=${sid}&sceneid=${id}`)
                        .then(res => {
                            const data = res.data;
                            const sceneGroup = data.sceneGroup;
                            data.defaultSceneId = id;

                            if (sceneGroup) {
                                const scene = sceneGroup.find(item => item.id == id);
                                const lookTarget = pano.getLookAtTarget();
                                const pos = instance.getPosition().clone();
                                pos.z += pos.z > 0 ? 50 : -50;
                                // lock gyro control
                                pano.gyro && pano.gyro.makeEnable(false);
                                new Tween(lookTarget).to(pos).effect('quintEaseIn', 1000)
                                    .start(['x', 'y', 'z'])
                                    .complete(() => {
                                        new Tween(camera.position).to(instance.getPosition())
                                            .effect('quadEaseOut', 1000)
                                            .start(['x', 'y', 'z'])
                                            .complete(() => {
                                                this.publish(this.Topic.THRU.CHANGE, {data, scene: oldscene, pano});
                                                this.active = true;
                                                pano.enterThru(scene, instance.getMap());
                                                this.cleanup(); 
                                                pano.getControl().reset(pos.z > 0);
                                                pano.supplyOverlayScenes(sceneGroup);
                                                pano.gyro && pano.gyro.makeEnable(true);
                                            });
                                    });
                            }
                        }).catch(e => {
                            this.active = true;
                            // release gyro control
                            pano.gyro && pano.gyro.makeEnable(true);
                        });
                }
                return true;
            }
        }
    }
    
    /**
     * 删除穿越点
     */
    cleanup() {
        const objs = this.objs;
        const texts = this.texts;

        objs.forEach(obj => obj.removeBy(this.pano));
        texts.forEach(text => text.removeBy(this.pano));
        objs.length = 0;
        texts.length = 0;
        this.group.length = 0;
    }

    dispose() {
        const pano = this.pano;

        this.cleanup();
        this.lights.forEach(light => light.removeBy(pano));
        super.dispose();
        pano.overlays.reMoveJudgeFunc(this.jdid);
    }
}