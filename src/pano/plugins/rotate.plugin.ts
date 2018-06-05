import Tween from '../animations/tween.animation';
import Topic from '../../core/topic';
import * as PubSub from 'pubsub-js';

/**
 * @file 漫游插件
 */

const defaultOpts = {
    speed: 1,
    start: 0,
    lazy: 2000,
    recover: 5000
};
export default class Rotate {
    data: any;
    pano: any;
    timeid: any;
    target: any;
    tween: Tween;
    subtokens = [];

    constructor(pano, data) {
        this.data = Object.assign({}, defaultOpts, data);
        this.pano = pano;
        this.onDisturb = this.onDisturb.bind(this);
        this.onRecover = this.onRecover.bind(this);

        pano.subscribe(pano.frozen ? 'scene-ready' : 'scene-init', () => {
            this.create();

            const canvas = pano.getCanvas();
            canvas.addEventListener('touchstart', this.onDisturb);
            canvas.addEventListener('mousedown', this.onDisturb);
            canvas.addEventListener('touchend', this.onRecover);
            canvas.addEventListener('mouseup', this.onRecover);
        });

        const subtokens = this.subtokens;
        subtokens.push(PubSub.subscribe(Topic.SCENE.ATTACHSTART, () => pano.setRotate(false)));
        subtokens.push(PubSub.subscribe(Topic.SCENE.ATTACH, () => pano.setRotate(true)));
    }

    create() {
        const data = this.data;
        const pano = this.pano;
        // 使用极角来旋转, camera.position.y 会有问题
        this.target = {polar: pano.getControl().getPolarAngle()};        
        pano.setRotateSpeed(data.speed);
        setTimeout(() => pano.setRotate(true), data.start);        
    }

    /**
     * 中断漫游
     */
    onDisturb() {
        clearTimeout(this.timeid);
        const pano = this.pano;

        this.tween && this.tween.stop();
        pano.setRotate(false);
    }

    /** 
     * 恢复漫游
     */
    onRecover() {
        clearTimeout(this.timeid);
        const data = this.data;
        const pano = this.pano;
        const orbit = pano.getControl();

        this.timeid = setTimeout(() => {
            this.tween = new Tween({polar: orbit.getPolarAngle()}).to(this.target)
                .effect('quadEaseOut', data.recover)
                .start(['polar'])
                .process((newVal, oldVal) => orbit.rotateUp(oldVal - newVal));
            pano.setRotate(true);
        }, data.lazy);
    }

    dispose() {
        const canvas = this.pano.getCanvas();

        try {
            this.subtokens.forEach(token => PubSub.unsubscribe(token));
            this.tween.stop();

            canvas.removeEventListener('touchstart', this.onDisturb);
            canvas.removeEventListener('mousedown', this.onDisturb);
            canvas.removeEventListener('touchend', this.onRecover);
            canvas.removeEventListener('mouseup', this.onRecover);
        } catch (e) {}
    }
}