import AnimationFly from './fly.animation';

/**
 * @file animation timeline
 * @example 入场动画, camera 动画, 全局动画
 */

export default abstract class Timeline {
    static pano: any;
    static lines = [];

    static install(opts, pano) {
        const camera = pano.getCamera();
        this.pano = pano;
        // minor planet
        if (opts.fly) {
            const fly = new AnimationFly(camera);
            this.lines.push(fly);
        }

        pano.subscribe('render-process', this.onTimeChange, this);
    }

    static onTimeChange() {
        const lines = this.lines;

        lines.forEach((anim, i) => {
            if (anim.isEnd()) {
                this.onAnimationEnd(anim);
                lines.splice(i, 1);
            } else {
                anim.update();
            }
        });
    }

    static onAnimationEnd(data) {
        const pano = this.pano;

        pano.noTimeline();
        pano.dispatch('animation-end', data);
    }
}