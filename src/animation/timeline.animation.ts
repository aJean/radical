import AnimationFly from './fly.animation';
import AnimationSprite from './sprite.animation';

/**
 * @file animation timeline
 */

const spriteOpts = {
    rain: {
        type: 2,
        size: 15,
        spriteCount: 1000,
        speed: 9,
        colorR: 0.25,
        colorG: 0.25,
        colorB: 0.25
    },
    snow: {
        type: 1,
        spriteCount: 500,
        colorR: 1,
        colorG: 1,
        colorB: 1
    }
};

export default abstract class Timeline {
    static panoram: any;
    static lines = [];

    static install(opts, panoram) {
        const scene = panoram.getScene();
        this.panoram = panoram;

        if (opts.sprite) {
            const sprite = new AnimationSprite(spriteOpts[opts.sprite]);
            scene.add(sprite.particle);
            this.lines.push(sprite);
        }

        if (opts.fly) {
            const fly = new AnimationFly(panoram.getCamera());
            this.lines.push(fly);
        }

        panoram.subscribe('renderProcess', this.onTimeChange, this);
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
        this.panoram.dispatch('animationEnd', data);
    }
}