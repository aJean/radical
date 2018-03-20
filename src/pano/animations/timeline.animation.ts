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

        pano.subscribe('scene-init', this.onTimeInit, this);
        pano.subscribe('render-process', this.onTimeChange, this);
    }

    static onTimeInit() {
        const lines = this.lines;
        lines.forEach(anim => anim.init && anim.init());
    }

    static onTimeChange() {
        const pano = this.pano;
        const lines = this.lines;

        if (!lines.length) {
            return this.onTimeEnd();
        }

        lines.forEach((anim, i) => {
            if (anim.isEnd()) {
                pano.dispatch('animation-end', anim);
                lines.splice(i, 1);
            } else {
                anim.update();
            }
        });
    }

    static onTimeEnd() {
        const pano = this.pano;

        pano.unsubscribe('scene-init', this.onTimeInit, this);
        pano.unsubscribe('render-process', this.onTimeChange, this);
        pano.noTimeline();
    }
}