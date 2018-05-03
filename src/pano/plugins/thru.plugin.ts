import {TextureLoader, MeshBasicMaterial, CircleGeometry, Mesh, Vector3, Scene, AdditiveBlending} from 'three';
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
    limit: 3
};
export default class Thru {
    data: any;
    scene: any;
    camera: any;
    pano: any;
    timeid = 0;
    loader = new Loader();
    group = [];

    constructor (pano, data) {
        this.pano = pano;
        this.data = Util.assign({}, defaultOpts, data);

        const scene = this.scene = new Scene();
        const camera = this.camera = pano.getCamera().clone();

        pano.webgl.autoClear = false;
        pano.subscribe('render-process', this.render, this);
        pano.subscribe('scene-ready', this.load, this);
        pano.subscribe('scene-drag', this.needToShow, this);
        pano.subscribe('scene-attachstart', this.needToHide, this);
        pano.subscribe('scene-attach', this.needToShow, this);
    }

    render() {
        const pano = this.pano;
        const camera = this.camera;

        camera.rotation.copy(pano.getCamera().rotation);
        pano.webgl.render(this.scene, camera);       
    }

    load() {
        const list = [{id: '49776493052', img: 'https://img7.bdstatic.com/img/image/quanjing/tinyearth/49776493052_tinyearth.jpg'}, {id: '49776347175', img: 'https://img7.bdstatic.com/img/image/quanjing/tinyearth/49776347175_tinyearth.jpg'}, {id: '50141043497', img:'https://img7.bdstatic.com/img/image/quanjing/tinyearth/50141043497_tinyearth.jpg'}];
        
        this.cleanup();
        this.loader.fetchUrl('https://image.baidu.com/img/image/quanjing/panorecommend?category=decoration&setid=')
            .then(res => {
                this.create(list);
                this.needToShow();
            });
    }

    create(list) {
        const scene = this.scene;
        const data = this.data;
        const radius = data.radius;
        const group = this.group;

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
        const projectCamera = this.camera.clone();
        projectCamera.far = 1000;
        projectCamera.updateProjectionMatrix();

        return new Vector3(0, 0, 1).unproject(projectCamera);
    }

    needToHide() {
        clearTimeout(this.timeid);
        this.hide();        
    }

    needToShow() {
        clearTimeout(this.timeid);
        this.timeid = setTimeout(() => {
            this.show();
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

            effect === 'scale'
                ? new Tween({scale: 0}).to({scale: 1}).effect('backOut', 1000)
                    .start(['scale'], pano).process(val => item.scale.set(val, val, 1)) 
                : new Tween(item.material).to({opacity: 1}).effect('quintEaseIn', 1000)
                    .start(['opacity'], pano);
        });
    }

    hide() {
        this.group.forEach(item => {
            this.data.effect == 'scale'
                ? new Tween({scale: 1}).to({scale: 0}).effect('backOut', 1000)
                    .start(['scale'], this.pano).process(val => item.scale.set(val, val, 1))
                    .complete(() => item.visible = false)
                : new Tween(item.material).to({opacity: 0}).effect('quintEaseIn', 1000)
                .start(['opacity'], this.pano).complete(() => item.visible = false);
        });
    }

    cleanup() {
        const group = this.group;

        group.forEach(child => {
            child.visible = false;
            child.material.map.dispose();
            child.material.dispose();
            child.geometry.remove();
            scene.remove(child);
        });
        group.length = 0;
    }

    dispose() {
        const pano = this.pano;
        pano.webgl.autoClear = true;

        this.cleanup();
        pano.unsubscribe('render-process', this.render, this);
        pano.unsubscribe('scene-drag', this.needToShow, this);
        pano.unsubscribe('scene-ready', this.needToShow, this);
        pano.unsubscribe('scene-attachstart', this.needToHide, this);
        pano.unsubscribe('scene-attach', this.needToShow, this);
    }
}