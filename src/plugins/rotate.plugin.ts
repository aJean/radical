import Pano from '../pano';
import Tween from '../animations/tween.animation';

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
    pano: Pano;
    timeid: any;
    tween: Tween;

    constructor(pano: Pano, data) {
        this.data = Object.assign({}, defaultOpts, data);
        this.pano = pano;
        this.onDisturb = this.onDisturb.bind(this);

        const canvas = pano.getCanvas();
        pano.subscribe('scene-init', this.create, this);

        canvas.addEventListener('touchstart', this.onDisturb);
        canvas.addEventListener('mousedown', this.onDisturb);
    }

    create() {
        const data = this.data;
        const orbit = this.pano.getControl();
        
        orbit.autoRotateSpeed = data.speed;
        setTimeout(() => orbit.autoRotate = true, data.start);
    }

    /**
     * 中断漫游并恢复
     */
    onDisturb() {
        const data = this.data;
        const pano = this.pano;
        const tween = this.tween;
        const orbit = pano.getControl();
        const camera = pano.getCamera();
        const target = {y: camera.position.y}

        orbit.autoRotate = false;
        tween && tween.stop();
        clearTimeout(this.timeid);

        this.timeid = setTimeout(() => {
            this.tween = new Tween(camera.position).to(target)
                .effect('linear', data.recover)
                .start(['y'], pano);
            orbit.autoRotate = true;
        }, data.lazy);
    }

    dispose() {
        const canvas = this.pano.getCanvas();

        try {
            canvas.removeEventListener('touchstart', this.onDisturb);
            canvas.removeEventListener('mousedown', this.onDisturb);
            this.tween.stop();
        } catch (e) {}
    }
}