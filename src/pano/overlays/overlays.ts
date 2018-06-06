import {Vector3, Group} from 'three';
import DomOverlay from './dom.overlay';
import MeshOverlay from './mesh.overlay';
import SpriteOverlay from './sprite.overlay';
import FrameOverlay from './frame.overlay';
import Util from '../../core/util';
import Log from '../../core/log';
import PubSubAble from '../../interface/common.interface';

/**
 * @file 管理所有场景下的覆盖物
 * @TODO: 归拢所有 canvas click event listen
 * @TODO: cid 缓存当前场景 overlays, 但是切换场景时还是 remove - create 机制
 */

const AnimationOpts = {
    rain: {
        type: 2,
        size: 15,
        spriteCount: 1000,
        speed: 9,
        colorR: 0.25,
        colorG: 0.25,
        colorB: 0.25
    },
    snow: {
        type: 1,
        spriteCount: 500,
        colorR: 1,
        colorG: 1,
        colorB: 1
    }
};
export default class Overlays extends PubSubAble {
    cid: number;
    pano: any;
    list: any;
    maps = {};
    pluginFuncs = [];

    constructor(pano: any, list) {
        super();

        this.pano = pano;
        this.list = list;

        const Topic = this.Topic;
        this.subscribe(Topic.SCENE.INIT, this.init.bind(this));
        this.subscribe(Topic.SCENE.ATTACHSTART, this.removeOverlays.bind(this));
        // per scene change
        this.subscribe(Topic.SCENE.ATTACH, this.init.bind(this));
        this.subscribe(Topic.RENDER.PROCESS, this.updateOverlays.bind(this));

        pano.getCanvas().addEventListener('click', this.onCanvasHandle.bind(this));
    }

    init(topic, payload) {
        const scene = payload.scene;
        if (!scene.overlays) {
            return;
        }

        if (!scene.id) {
            scene.id = 'pano' + Date.now();
        }

        this.cid = scene.id;
        this.create(scene.overlays);
    }

    create(list) {
        const cache = this.getCurrent(this.cid);

        list.forEach(data => {
            switch (data.type) {
                case 'dom':
                    this.createDomOverlay(data, cache);
                    break;
                case 'mesh':
                    this.createMeshOverlay(data, cache);
                    break;
                case 'animation':
                    this.createAnimationOverlay(data, cache);
                    break;
            }
        });

        return cache;
    }

    findScene(id) {
        return this.list.find(item => item.id == id);
    }

    /**
     * 增加场景数据, 用于图集切换
     * @param {Array} scenes 场景数据
     */
    addScenes(scenes) {
        this.list = scenes.concat(this.list);
    }

    /** 
     * 获取场景列表
     */
    getScenes() {
        return this.list;
    }

    /**
     * 创建 dom 覆盖物并添加进 maps
     */
    createDomOverlay(prop, cache) {
        Util.parseLocation(prop, this.pano.getCamera());

        const item = new DomOverlay(prop);
        cache.domGroup.push(item);
        item.elem.onclick = e => {
            e.stopPropagation();
            e.preventDefault();
            this.onOverlayHandle(item)
        };

        this.pano.addDomObject(item.elem);
        this.updateDomOverlay(item);
    }

    /**
     * 不断更新 dom overlay 的屏幕坐标
     */
    updateDomOverlay(item) {
        const pano = this.pano;
        const size = pano.getSize();
        const width = size.width / 2;
        const height = size.height / 2;
        const position = Util.calcWorldToScreen(item.data.location, pano.getCamera());

        // z > 1 is backside
        if (position.z > 1) {
            item.hide();
        } else {
            const x = Math.floor(position.x * width + width);
            const y = Math.floor(-position.y * height + height);
            item.update(x, y);
        }
    }

    /**
     * 创建 mesh 覆盖物
     */
    createMeshOverlay(prop, cache) {
        const camera = this.pano.getCamera();

        Util.parseLocation(prop, camera);
        const item = new MeshOverlay(prop, camera.position);
        const particle = item.particle;

        // 加入可检测分组
        cache.detects.add(particle);
        cache.meshGroup.push(item);
    }

    /**
     * 创建动画覆盖物
     */
    createAnimationOverlay(prop, cache) {
        const pano = this.pano;
        const camera = pano.getCamera();
        let item;
    
        Util.parseLocation(prop, camera);
        if (prop.category == 'frame') {
            prop.lookat = camera.position;
            item = new FrameOverlay(prop);
        } else {
            item = new SpriteOverlay(AnimationOpts[prop.category]);
        }

        pano.addSceneObject(item.particle);
        cache.meshGroup.push(item);
    }

    /**
     * 获取当前的缓存对象
     * @param {string} id 场景id
     */
    getCurrent(id) {
        const data = this.maps[id];

        if (data) {
            return data;
        } else {
            const group = new Group();
            this.pano.addSceneObject(group);

            return this.maps[id] = {
                detects: group,
                domGroup: [],
                meshGroup: []
            };
        }
    }

    /**
     * 点击 canvas
     */
    onCanvasHandle(evt) {
        const pano = this.pano;
        const camera = pano.getCamera();
        const ndcpos = Util.transNdc({x: evt.clientX, y: evt.clientY}, pano.getSize());
        const location = Util.calcScreenToSphere(ndcpos, camera);

        try {
            const group = this.getCurrent(this.cid).detects;
            // self judgement
            if (group.children.length) {
                const intersects = Util.intersect(ndcpos, group.children, camera);
                // disbale dom event
                if (intersects) {
                    evt.stopPropagation();
                    evt.preventDefault();

                    return this.onOverlayHandle(intersects[0].object['instance']);
                } 
            } 
            // other plugins judgement
            if (this.pluginJudge(ndcpos)) {
                evt.stopPropagation();
                evt.preventDefault();

                return true;
            } else if (evt.target == pano.getCanvas()) {
                this.publish(this.Topic.UI.PANOCLICK, {location, pano});
            }
        } catch(e) {
            Log.output(e);
        }
    }

    /**
     * 点击覆盖物
     */
    onOverlayHandle(instance) {
        const pano = this.pano;
        const data = instance.data;
        const size = pano.getSize();
        const Topic = this.Topic;

        // for log & statistics & user behavior
        this.publish(Topic.UI.OVERLAYCLICK, {instance, pano});
        switch (data.actionType) {
            case 'scene':
                pano.enterNext(this.findScene(data.sceneId));
                break;
            case 'link':
                window.open(data.linkUrl, '_blank');
                break;
            // let Multiple plugin control
            case 'multiple':
                this.publish(Topic.UI.MULTIPLEACTIVE, {scene: data, pano});
                break;
            case 'video':
                instance.play();
                break;
        }
    }

    /**
     * 删除特定的 dom overlay
     * @param {Object} data 
     */
    delete(data) {
        const pano = this.pano;
        const cache = this.getCurrent(this.cid);

        cache.domGroup.forEach((item, i) => {
            if (item == data) {
                cache.domGroup.splice(i, 1);
                pano.removeDomObject(item.elem);
                item.dispose();
            }
        });
    }

    /**
     * 更新覆盖物的状态或位置
     * @param {string} topic 
     * @param {Object} pano 全景对象
     */
    updateOverlays(topic, pano) {
        const cache = this.getCurrent(pano.currentData.id);
        cache.domGroup.forEach(item => this.updateDomOverlay(item));
        cache.meshGroup.forEach(item => item.update());
    }

    /**
     * 删除当前场景下的所有 overlays
     */
    removeOverlays() {
        const cache = this.getCurrent(this.cid);
        delete this.maps[this.cid];
        this.cid = null;

        cache && this.hideOverlays(cache, true);
    }

    /**
     * 隐藏当前场景下的 overlays
     * @param {Object} data 缓存数据 
     * @param {boolean} isclean 是否清除
     */
    hideOverlays(data, isclean) {
        const pano = this.pano;

        if (data) {
            data.domGroup.forEach(item => {
                item.hide();
                if (isclean) {
                    item.dispose();
                    pano.removeDomObject(item.elem);
                }
            });

            data.meshGroup.forEach(item => {
                item.hide();
                if (isclean) {
                    item.dispose();
                    pano.removeSceneObject(item.particle);
                }
            });

            if (isclean && data.detects.children) {
                data.detects.remove(...data.detects.children);
                pano.removeSceneObject(data.detects);
            }

        }
    }

    /**
     * 展示 overlays
     */
    showOverlays(data) {
        if (data) {
            data.domGroup.forEach(item => item.show());
            data.meshGroup.forEach(item => item.show());
        }
    }

    /**
     * 为其他插件提供判断机会
     */
    pluginJudge(pos) {
        const res = [];

        this.pluginFuncs.forEach(fn => res.push(fn(pos)));
        return res.indexOf(true) !== -1;
    }

    /**
     * 添加判断函数
     */
    addJudgeFunc(fn) {
        this.pluginFuncs.push(fn);
    }

    dispose() {
        super.dispose();
        this.pluginFuncs = [];
    }
}