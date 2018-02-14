import Panoram from '../panoram';
import Tween from '../animations/tween.animation';
import { setTimeout, clearTimeout } from 'timers';

/**
 * @file 漫游插件
 */

const defaultOpts = {
    speed: 1,
    lazy: 3000,
    recover: 5000
};
export default class Rotate {
    data: any;
    panoram: Panoram;
    timeid: any;
    tween: Tween;

    constructor(panoram: Panoram, data) {
        this.data = Object.assign({}, defaultOpts, data);
        this.panoram = panoram;
        this.onDisturb = this.onDisturb.bind(this);

        const canvas = panoram.getCanvas();
        panoram.subscribe('scene-init', this.create, this);

        canvas.addEventListener('touchstart', this.onDisturb);
        canvas.addEventListener('mousedown', this.onDisturb);
    }

    create() {
        const data = this.data;
        const orbit = this.panoram.getControl();
        
        orbit.autoRotateSpeed = data.speed;
        setTimeout(() => orbit.autoRotate = true, data.lazy);
    }

    /**
     * 中断漫游并恢复
     */
    onDisturb() {
        const data = this.data;
        const panoram = this.panoram;
        const tween = this.tween;
        const orbit = panoram.getControl();
        const camera = panoram.getCamera();
        const target = {y: camera.position.y}

        orbit.autoRotate = false;
        tween && tween.stop();
        clearTimeout(this.timeid);

        this.timeid = setTimeout(() => {
            this.tween = new Tween(camera.position).to(target)
                .effect('linear', data.recover)
                .start(['y'], panoram);
            orbit.autoRotate = true;
        }, data.lazy);
    }

    dispose() {
        const canvas = this.panoram.getCanvas();

        try {
            canvas.removeEventListener('touchstart', this.onDisturb);
            canvas.removeEventListener('mousedown', this.onDisturb);
            this.tween.stop();
        } catch (e) {}
    }
}