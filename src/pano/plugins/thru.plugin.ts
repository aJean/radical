import { TextureLoader, MeshBasicMaterial, CircleGeometry, CanvasTexture, Mesh, Vector3 } from 'three';
import Tween from '../animations/tween.animation';
import Util from '../../core/util';
import Loader from '../loaders/resource.loader';

/**
 * @file 星际穿越 plugin
 * 管理穿越点个数, 数据拉取, 展示策略
 */

const defaultOpts = {
    radius: 80,
    factor: 300,
    effect: 'scale',
    bg: '',
    setid: '',
    lazy: 3000,
    rurl: null,
    surl: null
};
const loader = new Loader();
export default class Thru {
    data: any;
    camera: any;
    pano: any;
    active = false; // prevent excessive click
    animating = false; // lock when animating
    timeid = 0;
    group = [];

    constructor(pano, data) {
        this.pano = pano;
        this.camera = pano.getCamera();
        this.data = Util.assign({}, defaultOpts, data);
        this.onCanvasHandle = this.onCanvasHandle.bind(this);
        
        const webgl = pano.webgl;
        pano.subscribe(pano.frozen ? 'scene-ready' : 'scene-init', this.load, this);
        // pano.subscribe('scene-drag', this.everyToShow, this);
        pano.subscribe('scene-attachstart', this.needToHide, this);
        pano.subscribe('scene-attach', this.load, this);

        webgl.domElement.addEventListener('click', this.onCanvasHandle);
    }

    load(scene) {
        let bid: any = /BAIDUID=[^;]*/.exec(document.cookie) || '';
        const data = this.data;
        const rurl = data.rurl;

        if (bid) {
            bid = bid[0].replace('BAIDUID=', '');
        }

        if (!rurl) {
            return console.log('thru rurl missed!');
        }

        const url = `${rurl}?baiduid=${bid}&panoid=${data.setid}&sceneid=${scene.id}&timestamp=${Date.now()}`;
        this.cleanup();      
        loader.fetchUrl(url)
            .then(res => {
                if (res.status == 0 && res.data.length) {
                    this.create(this.transfer(res.data));
                    this.needToShow();
                }
            });
    }

    /**
     * 转换数据
     */
    transfer(list) {
        return list.map(data => {
            const tokens = data.split('&');

            return {
                img: `https://mms-xr.cdn.bcebos.com/panorama/${tokens[2]}/mobile_f.jpg`,
                id: tokens[1],
                sid: tokens[0]
            };
        });
    }

    /**
     * 创建穿越点
     */
    create(list) {
        const pano = this.pano;
        const data = this.data;
        const radius = data.radius;
        const group = this.group;

        data.list = list;

        list.forEach(item => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 128;
            canvas.height = 128;

            ctx.beginPath();
            ctx.font = 'normal 16px Arial';
            ctx.lineWidth = 2;
            ctx.textAlign = 'center';
            ctx.fillStyle = '#fff';
            ctx.fillText('中国云南', 64, 64 - 5);
            ctx.fillText('香格里拉公园', 64, 64 + 15);

            const text  = new Mesh(new CircleGeometry(radius, 40, 40),
                new MeshBasicMaterial({
                    map: new CanvasTexture(canvas),
                    depthTest: false,
                    transparent: true
                }));
            text.position.set(0, 0, 0);
            const img = new Mesh(new CircleGeometry(radius, 40, 40),
                new MeshBasicMaterial({
                    map: new TextureLoader().load(loader.crosUrl(item.img)),
                    depthTest: false
                }));
            const circle: any = new Mesh(new CircleGeometry(radius + 28, 40, 40),
                new MeshBasicMaterial({
                    map: new TextureLoader().load(loader.crosUrl(data.bg)),
                    opacity: data.effect == 'scale' ? 1 : 0,
                    transparent: true
                }));
            
            text.renderOrder = 2;
            img.renderOrder = 1;
            circle.visible = false;
            circle.data = item;

            circle.add(text);
            circle.add(img);
            group.push(circle);
            pano.addSceneObject(circle);
        });
    }

    /**
     * 获取屏幕中心点的世界坐标
     */
    getVector(i) {
        let x = 0;
        let y = 0;

        if (i == 0) {
            x = Math.random() - 0.5;
            y = Math.random() / 2 + 0.2;
        } else if (i == 1) {
            x = Math.random() / -2 - 0.2;
            y = Math.random() / -2;
        } else {
            x = Math.random() / 2 + 0.2;
            y = Math.random() / -2;
        }

        return Util.calcScreenToWorld({x, y}, this.camera);
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
        clearTimeout(this.timeid);
        this.timeid = setTimeout(() => this.show(), this.data.lazy);
    }

    /**
     * 每次拖动重新展示 ?
     */
    everyToShow() {
        clearTimeout(this.timeid);

        if (!this.active) {
            this.timeid = setTimeout(() => this.show(), this.data.lazy);
        }
    }

    /**
     * 显示穿越点
     */
    show() {
        const pano = this.pano;
        const camera = this.camera;
        const effect = this.data.effect;

        this.active = true;        
        this.group.forEach((item, i) => {
            if (effect === 'scale') {
                item.scale.set(0.1, 0.1, 0.1);
            }

            item.position.copy(this.getVector(i));
            item.lookAt(camera.position);
            item.visible = true;

            effect === 'scale' ?
                new Tween({ scale: 0 }).to({ scale: 1 }).effect('backOut', 1000)
                .start(['scale'], pano).process(val => item.scale.set(val, val, 1)) :
                new Tween(item.material).to({ opacity: 1 }).effect('quintEaseIn', 1000)
                .start(['opacity'], pano);
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
                this.data.effect == 'scale' ?
                    new Tween({ scale: 1 }).to({ scale: 0 }).effect('backOut', 500)
                    .start(['scale'], this.pano).process(val => item.scale.set(val, val, 1))
                    .complete(() => {
                        this.animating = false;
                        item.visible = false;
                    }) :
                    new Tween(item.material).to({ opacity: 0 }).effect('quintEaseIn', 500)
                    .start(['opacity'], this.pano).complete(() => {
                        this.animating = false;
                        item.visible = false;
                    });
            });
        }
    }

    /**
     * 判断是否点击穿越点
     */
    onCanvasHandle(evt) {
        if (!this.active) {
            return;
        }

        const pano = this.pano;
        const size = pano.getSize();
        const pos = {
            x: (evt.clientX / size.width) * 2 - 1,
            y: -(evt.clientY / size.height) * 2 + 1
        };
        const group = this.group;
        const surl = this.data.surl;
        const list = this.data.list;

        if (group.length) {
            const intersects = Util.intersect(pos, group, pano.getCamera());

            if (intersects) {
                this.active = false;
                // disbale dom event
                evt.stopPropagation();
                evt.preventDefault();
                // find data by id
                const id = intersects[0].object['data'].id;
                const sid = intersects[0].object['data'].sid;

                if (surl && id && sid) {
                    // set sid for bxl surl
                    this.data.setid = sid;
                    loader.fetchUrl(`${surl}&setid=${sid}&sceneid=${id}`)
                        .then(res => {
                            const data = res.data;
                            const sceneGroup = data.sceneGroup;
                            data.defaultSceneId = id;

                            if (sceneGroup) {
                                pano.supplyOverlayScenes(sceneGroup);
                                pano.enterNext(sceneGroup.find(item => item.id == id));
                                pano.dispatch('thru-change', data, pano);
                            }
                        }).catch(e => {
                            this.active = true;
                            console.log(e);
                        });
                }
            }
        }
    }
    
    /**
     * 删除穿越点
     */
    cleanup() {
        const group = this.group;
        const scene = this.pano.getScene();

        group.forEach(child => {
            delete child['data'];
            this.deleteobj(child, true);
            scene.remove(child);
        });
        group.length = 0;
    }

    deleteobj(item, deep?) {
        item.visible = false;
        item.material.map.dispose();
        item.material.dispose();
        item.geometry.dispose();

        if (deep && item.children.length) {
            item.children.forEach(child => this.deleteobj(child));
        }
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

        webgl.domElement.removeEventListener('click', this.onCanvasHandle);
    }
}