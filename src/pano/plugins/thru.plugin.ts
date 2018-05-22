import { TextureLoader, MeshBasicMaterial, CircleGeometry, Mesh, Vector3, Scene, AdditiveBlending, Raycaster } from 'three';
import Tween from '../animations/tween.animation';
import Util from '../../core/util';
import Loader from '../loaders/resource.loader';

/**
 * @file 星际穿越 plugin
 * 管理穿越点个数, 数据拉取, 展示策略
 */

const defaultOpts = {
    radius: 50,
    factor: 500,
    effect: 'scale',
    lazy: 3000,
    limit: 3,
    server: null,
    request: null,
    setid: ''
};
export default class Thru {
    data: any;
    scene: any;
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
        this.data = Util.assign({}, defaultOpts, data);
        this.onCanvasHandle = this.onCanvasHandle.bind(this);

        const scene = this.scene = new Scene();
        const camera = this.camera = pano.getCamera().clone();
        const webgl = pano.webgl;

        webgl.autoClear = false;
        pano.subscribe('render-process', this.render, this);
        pano.subscribe(pano.frozen ? 'scene-ready' : 'scene-init', this.load, this);
        pano.subscribe('scene-drag', this.needToShow, this);
        pano.subscribe('scene-attachstart', this.needToHide, this);
        pano.subscribe('scene-attach', this.load, this);

        webgl.domElement.addEventListener('click', this.onCanvasHandle);
    }

    render() {
        const pano = this.pano;
        const camera = this.camera;

        camera.rotation.copy(pano.getCamera().rotation);
        pano.webgl.render(this.scene, camera);
    }

    load(scene) {
        let bid: any = /BAIDUID=[^;]*/.exec(document.cookie) || '';
        const data = this.data;
        const server = data.server;

        if (bid) {
            bid = bid[0].replace('BAIDUID=', '');
        }

        if (!server) {
            return console.log('thru server missed!');
        }

        const url = server + '?baiduid=' + bid + '&panoid=' + data.setid + '&sceneid=' + scene.id +
            '&timestamp=' + Date.now()
        this.cleanup();
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
                img: `https://img7.bdstatic.com/img/image/quanjing/tinyearth/${tokens[1]}_tinyearth.jpg`,
                id: tokens[1],
                sid: tokens[0]
            };
        });
    }

    create(list) {
        const scene = this.scene;
        const data = this.data;
        const radius = data.radius;
        const group = this.group;

        data.list = list;
        this.cleanup();

        list.forEach(item => {
            const material = new MeshBasicMaterial({
                map: new TextureLoader().load(item.img),
                blending: AdditiveBlending,
                opacity: data.effect == 'scale' ? 1 : 0,
                transparent: true
            });

            const circle = new CircleGeometry(radius, 30, 30);
            const mesh = new Mesh(circle, material);

            mesh['data'] = item;
            group.push(mesh);
            scene.add(mesh);
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

    hide() {
        this.animating = true;
        this.group.forEach(item => {
            this.data.effect == 'scale' ?
                new Tween({ scale: 1 }).to({ scale: 0 }).effect('backOut', 1000)
                .start(['scale'], this.pano).process(val => item.scale.set(val, val, 1))
                .complete(() => {
                    this.animating = false;
                    item.visible = false;
                }) :
                new Tween(item.material).to({ opacity: 0 }).effect('quintEaseIn', 1000)
                .start(['opacity'], this.pano).complete(() => {
                    this.animating = false;
                    item.visible = false;
                });
        });
    }

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
        const request = this.data.request;
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

                if (request && id && sid) {
                    // set sid for recom request
                    this.data.setid = sid;
                    this.loader.fetchUrl(request + '&setid=' + sid + '&sceneid=' + id)
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

    cleanup() {
        const group = this.group;
        const scene = this.scene;

        group.forEach(child => {
            delete child['data'];
            child.visible = false;
            child.material.map.dispose();
            child.material.dispose();
            child.geometry.dispose();
            scene.remove(child);
        });
        group.length = 0;
    }

    dispose() {
        const pano = this.pano;
        const webgl = pano.webgl;
        webgl.autoClear = true;

        this.cleanup();
        pano.unsubscribe('render-process', this.render, this);
        pano.unsubscribe('scene-drag', this.needToShow, this);
        pano.unsubscribe('scene-ready', this.needToShow, this);
        pano.unsubscribe('scene-attachstart', this.needToHide, this);
        pano.unsubscribe('scene-attach', this.needToShow, this);

        webgl.domElement.removeEventListener('click', this.onCanvasHandle);
    }
}