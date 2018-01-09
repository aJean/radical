import AnimationFly from './fly.animation';

/**
 * @file animation timeline
 * @example 入场动画, camera 动画, 全局动画
 */

export default abstract class Timeline {
    static panoram: any;
    static lines = [];

    static install(opts, panoram) {
        const camera = panoram.getCamera();
        this.panoram = panoram;
        // minor planet
        if (opts.fly) {
            const fly = new AnimationFly(camera);
            this.lines.push(fly);
        }

        panoram.subscribe('render-process', this.onTimeChange, this);
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
        this.panoram.dispatch('animation-end', data);
    }
}