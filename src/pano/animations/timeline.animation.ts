import PubSub from '../../core/pubsub';
import Topic from '../../core/topic';
import AnimationFly from './fly.animation';

/**
 * @file animation timeline
 * @example 入场动画, camera 动画, 全局动画
 */

export default abstract class Timeline {
    static pano: any;
    static lines = [];
    static subtokens = [];

    static install(opts, pano) {
        const camera = pano.getCamera();
        const subtokens = this.subtokens;

        this.pano = pano;
        // minor planet
        if (opts.fly) {
            const fly = new AnimationFly(camera, opts.fly);
            this.lines.push(fly);
        }

        subtokens.push(PubSub.subscribe(Topic.SCENE.INIT, () => this.onTimeInit()));
        subtokens.push(PubSub.subscribe(Topic.RENDER.PROCESS, () => this.onTimeChange()));
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
                PubSub.publish(Topic.ANIMATION.END, anim);
                lines.splice(i, 1);
            } else {
                anim.update();
            }
        });
    }

    static onTimeEnd() {
        this.subtokens.forEach(token => PubSub.unsubscribe(token));
        this.pano.noTimeline();
    }
}