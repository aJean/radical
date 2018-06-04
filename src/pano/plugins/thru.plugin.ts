import { TextureLoader, MeshBasicMaterial, CircleGeometry, CanvasTexture, Mesh, Vector3 } from 'three';
import Tween from '../animations/tween.animation';
import Util from '../../core/util';
import Loader from '../loaders/resource.loader';
import Inradius from '../plastic/inradius.plastic';
import Text from '../plastic/text.plastic';
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
export default class Thru {
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
        this.pano = pano;
        this.camera = pano.getCamera();
        this.opts = Util.assign({}, defaultOpts, opts);
        this.onCanvasHandle = this.onCanvasHandle.bind(this);
        
        const webgl = pano.webgl;
        pano.subscribe(pano.frozen ? 'scene-ready' : 'scene-init', this.load, this);
        // pano.subscribe('scene-drag', this.everyToShow, this);
        pano.subscribe('scene-attachstart', this.needToHide, this);
        pano.subscribe('scene-attach', this.load, this);
        pano.subscribe('pano-click', this.toggle, this);
        pano.overlays.addJudgeFunc(this.onCanvasHandle.bind(this));
        // common lights
        this.createLights();
    }

    load(scene) {
        const list = this.list = scene.recomList;

        if (!list || !list.length) {
            return;
        }
        // clean current thru list
        this.cleanup(); 
        this.create(list);
        this.needToShow();
    }

    /**
     * 使用唯一点光源避免互相干扰
     */
    createLights() {
        for (let i = 0;i < 1; i++) {
            const light = new Light({type: 2});
            light.addBy(this.pano);
            this.lights.push(light);
        }
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
                const text = new Text({fontsize: 30, inverse: false, text: item.setName});
                const hole = new Inradius({
                    name: i, shadow: true, position: pos, radius: radius,
                    envMap: texture, visible: false, data: item
                }, pano);
                hole.addBy(pano);
                text.addTo(hole);

                group.push(hole.plastic);
                objs.push(hole);
            });
        });
    }

    /**
     * 获取屏幕中心点的世界坐标
     */
    getVector(i) {
        let lng = Math.random() * 60 - 30;
        let lat = Math.random() * 60 - 30;

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
            const pano = this.pano;
            pano.dispatch('thru-show', this.list, pano);
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
                const data = obj.data;
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
                                const pos = obj.position.clone();
                                pos.z += pos.z > 0 ? 100 : -100;

                                pano.gyro && pano.gyro.makeEnable(false);
                                new Tween(lookTarget).to(pos).effect('quintEaseIn', 1000)
                                    .start(['x', 'y', 'z'], pano)
                                    .complete(() => {
                                        new Tween(camera.position).to(obj.position).effect('quadEaseOut', 1000)
                                            .start(['x', 'y', 'z'], pano)
                                            .complete(() => {
                                                this.active = true;
                                                pano.supplyOverlayScenes(sceneGroup);
                                                pano.enterThru(scene, obj.material.envMap);
                                                pano.dispatch('thru-change', data, scene, pano);
                                                pano.getControl().reset(pos.z > 0);
                                                pano.gyro && pano.gyro.makeEnable(true);
                                            });
                                    });
                            }
                        }).catch(e => {
                            this.active = true;
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
        pano.unsubscribe('scene-ready', this.load, this);
        pano.unsubscribe('scene-init', this.load, this);
        pano.unsubscribe('scene-drag', this.everyToShow, this);
        pano.unsubscribe('scene-attachstart', this.needToHide, this);
        pano.unsubscribe('scene-attach', this.needToShow, this);

        this.lights.forEach(light => {
            light.dispose();
            pano.removeSceneObject(light.plastic);
        });
    }
}