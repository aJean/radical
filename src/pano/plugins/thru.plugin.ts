import PubSubAble from '../../interface/pubsub.interface';
import Text from '../plastic/text.plastic';
import Tween from '../animations/tween.animation';
import Util from '../../core/util';
import Loader from '../loaders/resource.loader';
import Inradius from '../plastic/inradius.plastic';
import Light from '../plastic/light.plastic';
import Converter from '../loaders/converter';
import Analyse from '../hdmap/analyse.hdmap';

/**
 * @file 星际穿越 plugin
 * 管理穿越点个数, 数据拉取, 展示策略
 */

const defaultOpts = {
    radius: 100,
    lazy: 3000,
    surl: null,
    limit: 3
};
const loader = new Loader();
export default class Thru extends PubSubAble {
    opts: any;
    judgeid: any;
    list: any;
    camera: any;
    pano: any;
    textgap = 160;
    invr = false;
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

        const Topic = this.Topic;
        this.subscribe(Topic.SCENE.CREATE, this.init.bind(this));
        this.subscribe(pano.frozen ? Topic.SCENE.READY : Topic.SCENE.LOAD, this.needToShow.bind(this));
        this.subscribe(Topic.SCENE.ATTACHSTART, this.hide.bind(this));
        this.subscribe(Topic.SCENE.ATTACH, this.change.bind(this));
        this.subscribe(Topic.UI.IMMERSION, this.immersHandle.bind(this));
        this.subscribe(Topic.VR.ENTER, this.vrHandle.bind(this, true));
        this.subscribe(Topic.VR.EXIT, this.vrHandle.bind(this, false));
        this.judgeid = pano.overlays.addJudgeFunc(this.clickHandle.bind(this));
    }

    /**
     * 创建固定穿越点
     */
    init(topic, payload) {
        const opts = this.opts;
        const list = this.list = payload.scene.recomList.slice(0, opts.limit);

        if (!list || !list.length) {
            return;
        }
        // clean current thru list
        const pano = this.pano;
        const radius = opts.radius;
        const poss = this.calcPos(payload.scene.recomPos.slice(0, opts.limit));
        
        list.forEach((item, i) => {
            const pos = poss[i];
            const hole = new Inradius({
                name: i, shadow: true, position: pos, radius: radius, type: 'cloud', data: item,
                rotate: true, emissive: '#787878', cloudimg: opts.img
            }, pano);
            const text = new Text({text: item.setName, fontsize: 40, width: 512,
                x: pos.x, y: pos.y - this.textgap, z: pos.z, limit: 6, shadow: true});
            
            hole.setOpacity(0);
            text.setOpacity(0);
            hole.addBy(pano);
            text.addBy(pano);
            
            this.group.push(hole.getPlastic());
            this.objs.push(hole);
            this.texts.push(text);
            // load texture
            setTimeout(() => loader.loadTexture(item.image).then(texture => this.objs[i].setMap(texture)), 0);
        });

        // common lights
        this.initLights();
    }

    /**
     * 计算推荐球世界坐标
     * @param {Array} list 位置信息数组
     */
    calcPos(list) {
        return list && list.slice(0, this.opts.limit).map(data => {
            const {x, y, z} = Analyse.calcWorld(Number(data.pos), Number(data.x), Number(data.y));

            return {
                x: x * 1000,
                y: y * 1000,
                z: z > 0 ? 1000 : -1000
            };
        });
    }

    /**
     * 使用唯一点光源避免互相干扰
     */
    initLights() {
        const light = new Light({intensity: 0.3, type: 2});

        light.addBy(this.pano);
        this.lights.push(light);
    }

    /**
     * 场景切换或穿越更新穿越点的内容
     */
    change(topic, payload) {
        const objs = this.objs;
        const texts = this.texts;
        const list = this.list = payload.scene.recomList.slice(0, this.opts.limit);

        if (!list || !list.length || !objs.length) {
            return;
        }

        const poss = this.calcPos(payload.scene.recomPos.slice(0, this.opts.limit));
        // change thru content
        list.forEach((item, i) => {
            const name = item.setName;
            const hole = objs[i];
            const text = texts[i];
            const pos = poss[i];

            hole.setData(item);
            hole.setPosition(pos.x, pos.y, pos.z);
            text.draw(name);
            text.setPosition(pos.x, pos.y - this.textgap, pos.z);
            
            loader.loadImage(item.image).then(texture => hole.setMap(texture));
        });

        this.needToShow();
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
        if (this.invr) {
            return;
        }

        clearTimeout(this.timeid);
        this.timeid = setTimeout(() => {
            this.publish(this.Topic.THRU.SHOW, {list: this.list, pano: this.pano});
            this.show();
        }, this.opts.lazy);
    }

    /**
     * 显示穿越点, use opacity for high performance
     */
    show() {
        if (this.invr) {
            return;
        }

        clearTimeout(this.timeid);
        this.active = true;

        this.objs.forEach(obj => {
            obj.lookAt(this.camera.position);
            obj.setOpacity(1);
        });
        this.texts.forEach(text => {
            text.lookAt(this.camera.position);
            text.setOpacity(1);
        });
    }

    /**
     * 隐藏穿越点, use opacity for high performance
     */
    hide() {
        clearTimeout(this.timeid);
        this.active = false;

        if (this.objs.length) {
            this.objs.forEach(obj => obj.setOpacity(0));
            this.texts.forEach(text => text.setOpacity(0));
        }
    }

    /**
     * 处理进入 vr 模式
     * @param {boolean} invr
     */
    vrHandle(invr) {
        invr && this.hide();
        this.invr = invr;
    }

    /**
     * 沉浸模式
     */
    immersHandle(topic, payload) {
        payload.should ? this.show() : this.hide();
    }

    /**
     * 判断是否点击穿越点
     */
    clickHandle(pos) {
        if (!this.active) {
            return;
        }

        const pano = this.pano;
        const camera = this.camera;
        const group = this.group;
        const surl = this.opts.surl;
        const oldscene = pano.sceneData;

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

                    pano.makeInteract(false);
                    loader.fetchJsonp(`${surl}&xrkey=${sid}&sceneid=${id}`)
                        .then(res => {
                            const data = Converter.ResultTransform(res);
                            const sceneGroup = data.sceneGroup;
                            data.sceneid = id;

                            if (sceneGroup) {
                                const scene = sceneGroup.find(item => item.id == id);
                                const ctarget = pano.getLookAtTarget();
                                const pos = instance.getPosition().clone();
                                const flag = pos.z > 0;
                                // lock control
                                pano.makeControl(false);
                                pos.z += flag ? 1 : -1;
                                // start thru animation
                                new Tween(ctarget, pano.ref).to(pos).effect('expoInOut', 1500).start(['x', 'y', 'z']);
                                // start camera animation
                                new Tween(camera.position, pano.ref).to(instance.getPosition())
                                    .effect('expoInOut', 1800).start(['x', 'y', 'z'])
                                    .complete(() => {
                                        pano.enterThru(scene, instance.getMap());
                                        this.publish(this.Topic.THRU.CHANGE, {data, scene: oldscene, pano});
                                        this.hide();
                                        pano.getControl().reset(flag);
                                        pano.supplyOverlayScenes(sceneGroup);
                                        pano.makeInteract(true);
                                        pano.makeControl(this.active = true);
                                    });
                            }
                        }).catch(e => {
                            pano.makeInteract(true);
                            pano.makeControl(this.active = true);
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
        this.objs.forEach(obj => obj.removeBy(this.pano));
        this.texts.forEach(text => text.removeBy(this.pano));
        this.objs.length = 0;
        this.texts.length = 0;
        this.group.length = 0;
    }

    dispose() {
        const pano = this.pano;

        this.cleanup();
        this.lights.forEach(light => light.removeBy(pano));
        super.dispose();
        pano.overlays.reMoveJudgeFunc(this.judgeid);
    }
}