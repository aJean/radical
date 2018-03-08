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
    target: any;
    tween: Tween;

    constructor(pano: Pano, data) {
        this.data = Object.assign({}, defaultOpts, data);
        this.pano = pano;
        this.onDisturb = this.onDisturb.bind(this);
        this.onRecover = this.onRecover.bind(this);

        const canvas = pano.getCanvas();
        pano.subscribe(pano.frozen ? 'scene-ready' : 'scene-init', this.create, this);
        pano.subscribe('scene-attachstart', () => pano.setRotate(false));
        pano.subscribe('scene-attach', () => pano.setRotate(true));
   
        canvas.addEventListener('touchstart', this.onDisturb);
        canvas.addEventListener('mousedown', this.onDisturb);
        canvas.addEventListener('touchend', this.onRecover);
        canvas.addEventListener('mouseup', this.onRecover);
    }

    create() {
        const data = this.data;
        const pano = this.pano;
        // target y set only once
        this.target = {y: pano.getCamera().position.y};        
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
        const camera = pano.getCamera();

        this.timeid = setTimeout(() => {
            this.tween = new Tween(camera.position).to(this.target)
                .effect('linear', data.recover)
                .start(['y'], pano);
            pano.setRotate(true);
        }, data.lazy);
    }

    dispose() {
        const canvas = this.pano.getCanvas();

        try {
            canvas.removeEventListener('touchstart', this.onDisturb);
            canvas.removeEventListener('mousedown', this.onDisturb);
            canvas.removeEventListener('touchend', this.onRecover);
            canvas.removeEventListener('mouseup', this.onRecover);
            this.tween.stop();
        } catch (e) {}
    }
}