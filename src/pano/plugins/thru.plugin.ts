import { TextureLoader, MeshBasicMaterial, CircleGeometry, CanvasTexture, Mesh, Vector3 } from 'three';
import PubSubAble from '../../interface/common.interface';
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
    list: any;
    camera: any;
    pano: any;
    active = false; // prevent excessive click
    animating = false; // lock when animating
    timeid = 0;
    group = [];
    objs = [];
    lights = [];

    constructor(pano, opts) {
        super();

        this.pano = pano;
        this.camera = pano.getCamera();
        this.opts = Util.assign({}, defaultOpts, opts);
        this.onCanvasHandle = this.onCanvasHandle.bind(this);
        
        const webgl = pano.webgl;
        const Topic = this.Topic;

        // common lights
        this.createLights();

        this.subscribe(pano.frozen ? Topic.SCENE.READY : Topic.SCENE.INIT,
            this.load.bind(this));
        // this.subscribe(Topic.UI.DRAG, this.everyToShow.bind(this));
        this.subscribe(Topic.SCENE.ATTACHSTART, this.needToHide.bind(this));
        this.subscribe(Topic.SCENE.ATTACH, this.load.bind(this));
        this.subscribe(Topic.UI.PANOCLICK, this.toggle.bind(this));
        pano.overlays.addJudgeFunc(this.onCanvasHandle.bind(this));
    }

    load(topic, payload) {
        const scene = payload.scene;
        const list = this.list = scene.recomList;

        if (!list || !list.length) {
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
        const light = new Light({type: 2});

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
        const lights = this.lights;
        const radius = opts.radius;

        list.forEach((item, i) => {
            loader.loadTexture(item.image).then(texture => {
                const pos = this.getVector(i);              
                const hole = new Inradius({
                    name: i, shadow: true, position: pos, radius: radius, type: 'mask',
                    emissive: '#999', envMap: texture, visible: false, data: item, text: item.setName
                }, pano);
                hole.addBy(pano);

                group.push(hole.getPlastic());
                objs.push(hole);
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
     * lazy 隐藏穿越点
     */
    needToHide() {
        if (this.animating) {
            return;
        }

        clearTimeout(this.timeid);
        this.hide();
    }

    /**
     * lazy 显示穿越点
     */
    needToShow() {
        if (this.animating) {
            return;
        }

        clearTimeout(this.timeid);
        this.timeid = setTimeout(() => {
            this.publish(this.Topic.THRU.SHOW, {list: this.list, pano: this.pano});
            this.show();
        }, this.opts.lazy);
    }

    /**
     * 每次拖动重新展示 ?
     */
    everyToShow() {
        if (this.animating) {
            return;
        }

        clearTimeout(this.timeid);
        if (!this.active) {
            this.timeid = setTimeout(() => this.show(), this.opts.lazy);
        }
    }

    /**
     * 显示穿越点
     */
    show() {
        const pano = this.pano;
        const camera = this.camera;

        this.active = true;        
        this.group.forEach((item, i) => {
            item.lookAt(camera.position);
            item.visible = true;
        });
    }

    /**
     * 隐藏穿越点
     */
    hide() {
        this.active = false;

        if (this.group.length) {
            this.animating = true;

            this.group.forEach(item => {
                this.animating = false;
                item.visible = false;
            });
        }
    }

    toggle() {
        if (this.group.length) {
            this.group.forEach(item => {
                this.active ? item.visible = false : item.visible = true;
            });
            this.active = !this.active;            
        }
    }

    /**
     * 判断是否点击穿越点
     */
    onCanvasHandle(pos) {
        if (!this.active) {
            return;
        }

        const pano = this.pano;
        const camera = this.camera;
        const group = this.group;
        const surl = this.opts.surl;

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
                                        instance.hideText();                                        
                                        new Tween(camera.position).to(instance.getPosition())
                                            .effect('quadEaseOut', 1000)
                                            .start(['x', 'y', 'z'])
                                            .complete(() => {
                                                this.active = true;
                                                pano.enterThru(scene, instance.getMap());
                                                this.cleanup(); 
                                                pano.getControl().reset(pos.z > 0);
                                                pano.supplyOverlayScenes(sceneGroup);
                                                pano.gyro && pano.gyro.makeEnable(true);
                                                this.publish(this.Topic.THRU.CHANGE, {data, scene, pano});
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
        const scene = this.pano.getScene();

        objs.forEach(obj => {
            obj.dispose();
            scene.remove(obj.getPlastic());
        });
        objs.length = 0;
        this.group.length = 0;
    }

    dispose() {
        const pano = this.pano;
        const webgl = pano.webgl;

        this.cleanup();
        this.lights.forEach(light => {
            light.removeBy(pano);
            light.dispose();
        });

        super.dispose();
    }
}