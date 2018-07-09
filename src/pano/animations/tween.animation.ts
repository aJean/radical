import PubSubAble from '../../interface/pubsub.interface';
import Log from '../../core/log';

/**
 * @file js frame animation
 */

const EFFECT = {
    linear(t, b, c, d): number { 
        return c * t / d + b; 
    },

    quadEaseIn(t, b, c, d): number {
        return c * (t /= d) * t + b;
    },

    quadEaseOut(t, b, c, d): number {
        return -c * (t /= d) * (t - 2) + b;
    },

    cubicEaseIn(t, b, c, d): number {
        return c * (t /= d) * t * t + b;
    },

    cubicEaseOut(t, b, c, d ): number {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },

    quintEaseIn(t, b, c, d): number {
        return c * (t /= d) * t * t * t * t + b; 
    },

    quintEaseOut(t, b, c, d): number {
        return c * ((t = t/d - 1) * t * t * t * t + 1) + b;
    },

    backIn(t, b, c, d) {
        const s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },

    backOut(t, b, c, d) {
        const s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },

    sineIn(t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    sineOut(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    sineInOut(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    }
};

export default class Tween extends PubSubAble {
    obj: any;
    target: any;
    fn: Function;
    onProcess: Function;
    onComplete: Function;
    record = {};
    startTime = 0;
    duration = 500;

    constructor(obj) {
        super();
        this.obj = obj;
    }

    to(obj) {
        this.target = obj;
        return this;
    }

    start(keys) {
        if (!this.obj || !this.target || !this.fn) {
            Log.errorLog('leak of necessary parameters');
        } else {
            this.startTime = Date.now();
            keys.forEach(key => this.record[key] = this.obj[key]);
            this.subscribe(this.Topic.RENDER.PROCESS, () => this.animate());
        }

        return this;
    }

    stop() {
        super.dispose();
        return this;
    }

    effect(type, duration?) {
        if (duration !== undefined) {
            this.duration = duration;
        }

        this.fn = EFFECT[type];
        return this;
    }

    process(fn) {
        this.onProcess = fn;
        return this;
    }

    complete(fn) {
        this.onComplete = fn;
        return this;
    }

    animate() {
        try {
            const t = Date.now() - this.startTime;
            const obj = this.obj;
            const target = this.target;
            const record = this.record;
            const duration = this.duration;
            const fn = this.fn;
            
            if (t < duration) {
                this.forEach(record, key => {
                    const val = fn(t, record[key], target[key] - record[key], duration);
                    this.onProcess && this.onProcess(val, obj[key], key);
                    obj[key] = val;
                });
            } else {
                this.forEach(record, key => obj[key] = target[key]);
                this.stop();
                this.onComplete && this.onComplete();
            }
        } catch (e) {
            Log.errorLog(e);
            this.stop();
        }
    }

    forEach(obj, iterator) {
        for (let key in obj) {
            iterator.call(this, key, obj[key]);
        }
    }
}