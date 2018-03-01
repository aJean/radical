import Pano from '../pano';
import Log from '../log';

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
    }
};

export default class Tween {
    pano: Pano;
    obj: any;
    target: any;
    fn: Function;
    onProcess: Function;
    onComplete: Function;
    record = {};
    startTime = 0;
    duration = 500;

    constructor(obj) {
        this.obj = obj;
    }

    to(obj) {
        this.target = obj;
        return this;
    }

    start(keys, pano: Pano) {
        if (!this.obj || !this.target || !this.fn) {
            Log.errorLog('leak of necessary parameters');
        } else {
            this.startTime = Date.now();
            this.pano = pano;
            keys.forEach(key => this.record[key] = this.obj[key]);
            pano.subscribe('render-process', this.animate, this);
        }

        return this;
    }

    stop() {
        this.pano.unsubscribe('render-process', this.animate, this);
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
                    this.onProcess && this.onProcess(obj[key], val);
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