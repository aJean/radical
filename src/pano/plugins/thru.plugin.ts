import { TextureLoader, MeshBasicMaterial, CircleGeometry, CanvasTexture, Mesh, Vector3, Raycaster } from 'three';
import Tween from '../animations/tween.animation';
import Util from '../../core/util';
import Loader from '../loaders/resource.loader';

/**
 * @file 星际穿越 plugin
 * 管理穿越点个数, 数据拉取, 展示策略
 */

const defaultOpts = {
    radius: 72,
    factor: 500,
    effect: 'scale',
    bg: '',
    setid: '',
    lazy: 3000,
    rurl: null,
    surl: null
};
export default class Thru {
    data: any;
    camera: any;
    pano: any;
    // prevent excessive click
    active = true;
    // lock when animating
    animating = false;
    timeid = 0;
    loader = new Loader();
    raycaster = new Raycaster();
    group = [];

    constructor(pano, data) {
        this.pano = pano;
        this.camera = pano.getCamera();
        this.data = Util.assign({}, defaultOpts, data);
        this.onCanvasHandle = this.onCanvasHandle.bind(this);
        
        const webgl = pano.webgl;
        pano.subscribe(pano.frozen ? 'scene-ready' : 'scene-init', this.load, this);
        // pano.subscribe('scene-drag', this.needToShow, this);
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

        const url = rurl + '?baiduid=' + bid + '&panoid=' + data.setid + '&sceneid=' + scene.id +
            '&timestamp=' + Date.now();

        this.loader.fetchUrl(url)
            .then(res => {
                if (res.status == 0 && res.data.length) {
                    this.create(this.transfer(res.data));
                    this.needToShow();
                }
            });
    }

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

    create(list) {
        const pano = this.pano;
        const data = this.data;
        const radius = data.radius;
        const group = this.group;

        data.list = list;
        this.cleanup();

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
                    map: new TextureLoader().load(item.img),
                    depthTest: false
                }));
            const circle: any = new Mesh(new CircleGeometry(radius + 28, 40, 40),
                new MeshBasicMaterial({
                    map: new TextureLoader().load(data.bg),
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

    getIncrement() {
        return (1 - Math.random() * 2) * this.data.factor;
    }

    getVector() {
        return Util.calcScreenToWorld({ x: 0, y: 0 }, this.camera);
    }

    needToHide() {
        if (this.animating) {
            return;
        }

        clearTimeout(this.timeid);
        this.hide();
    }

    needToShow() {
        clearTimeout(this.timeid);
        this.timeid = setTimeout(() => {
            this.show();
            this.active = true;
        }, this.data.lazy);
    }

    show() {
        const pano = this.pano;
        const vector = this.getVector();
        const camera = this.camera;
        const effect = this.data.effect;

        this.group.forEach(item => {
            if (effect === 'scale') {
                item.scale.set(0.1, 0.1, 0.1);
            }

            item.position.set(vector.x + this.getIncrement(), vector.y + this.getIncrement(), vector.z);
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

    /**
     * 判断是否点击穿越点
     */
    onCanvasHandle(evt) {
        if (!this.active) {
            return;
        }

        const pano = this.pano;
        const raycaster = this.raycaster;
        const size = pano.getSize();
        const pos = {
            x: (evt.clientX / size.width) * 2 - 1,
            y: -(evt.clientY / size.height) * 2 + 1
        };
        const group = this.group;
        const surl = this.data.surl;
        const list = this.data.list;

        if (group.length) {
            raycaster.setFromCamera(pos, pano.getCamera());
            const intersects = raycaster.intersectObjects(group, false);

            if (intersects.length) {
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
                    this.loader.fetchUrl(`${surl}&setid=${sid}&sceneid=${id}`)
                        .then(res => {
                            const data = res.data;
                            const sceneGroup = res.data.sceneGroup;
                            data.defaultSceneId = id;

                            if (sceneGroup) {
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
        pano.unsubscribe('scene-drag', this.needToShow, this);
        pano.unsubscribe('scene-attachstart', this.needToHide, this);
        pano.unsubscribe('scene-attach', this.needToShow, this);

        webgl.domElement.removeEventListener('click', this.onCanvasHandle);
    }
}