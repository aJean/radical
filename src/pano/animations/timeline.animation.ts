import PSPool from '../../core/pspool';
import Topic from '../../core/topic';
import AnimationFly from './fly.animation';

/**
 * @file animation timeline
 * @example 入场动画, camera 动画, 全局动画
 */

export default class Timeline {
    pano: any;
    lines = [];
    _subtokens = [];
    _pubSub = PSPool.getPSContext();

    install(opts, pano) {
        const camera = pano.getCamera();

        this.pano = pano;
        // minor planet
        if (opts.fly) {
            const fly = new AnimationFly(camera, opts.fly);
            this.lines.push(fly);
        }

        this._subtokens.push(this._pubSub.subscribe(Topic.SCENE.INIT, () => this.onTimeInit()));
        this._subtokens.push(this._pubSub.subscribe(Topic.RENDER.PROCESS, () => this.onTimeChange()));
    }

    onTimeInit() {
        const lines = this.lines;
        lines.forEach(anim => anim.init && anim.init());
    }

    onTimeChange() {
        const lines = this.lines;

        if (!lines.length) {
            return this.onTimeEnd();
        }

        lines.forEach((anim, i) => {
            if (anim.isEnd()) {
                this._pubSub.publish(Topic.ANIMATION.END, anim);
                lines.splice(i, 1);
            } else {
                anim.update();
            }
        });
    }

    onTimeEnd() {
        this._subtokens.forEach(token => this._pubSub.unsubscribe(token));
        this.pano.noTimeline();
    }
}