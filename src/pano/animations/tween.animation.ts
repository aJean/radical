import PubSubAble from '../../interface/pubsub.interface';
import Log from '../../core/log';

/**
 * @file js frame animation
 */

export const EFFECT = {
    linear(t, b, c, d): number { 
        return c * t / d + b; 
    },

    quadEaseIn(t, b, c, d): number {
        return c * (t /= d) * t + b;
    },

    quadEaseOut(t, b, c, d): number {
        return -c * (t /= d) * (t - 2) + b;
    },
    
    quadInOut: function(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t-2) - 1) + b;
    },

    cubicEaseIn(t, b, c, d): number {
        return c * (t /= d) * t * t + b;
    },

    cubicEaseOut(t, b, c, d ): number {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },

    cubeInOut: function(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t*t + b;
        return c / 2*((t -= 2) * t * t + 2) + b;
    },

    quintEaseIn(t, b, c, d): number {
        return c * (t /= d) * t * t * t * t + b; 
    },

    quintEaseOut(t, b, c, d): number {
        return c * ((t = t/d - 1) * t * t * t * t + 1) + b;
    },

    quintInOut: function(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2*((t -= 2) * t * t * t * t + 2) + b;
    },

    backIn(t, b, c, d) {
        const s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },

    backOut(t, b, c, d) {
        const s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },

    backInOut: function(t, b, c, d, s) {
        if (typeof s == "undefined") s = 1.70158; 
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2*((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },

    sineIn(t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },

    sineOut(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },

    sineInOut(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },

    expoIn(t, b, c, d) {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },

    expoOut(t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },

    expoInOut: function(t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },

    circEaseIn: function(t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },

    circEaseOut: function(t, b, c, d) {
        return c * Math.sqrt(1 - (t = t/d - 1) * t) + b;
    },

    circInOut: function(t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },

    elasticEaseIn: function(t, b, c, d, a, p) {
        let s;
        if (t==0) return b;
        if ((t /= d) == 1) return b + c;
        if (typeof p == "undefined") p = d * .3;
        if (!a || a < Math.abs(c)) {
            s = p / 4;
            a = c;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },

    elasticEaseOut: function(t, b, c, d, a, p) {
        let s;
        if (t==0) return b;
        if ((t /= d) == 1) return b + c;
        if (typeof p == "undefined") p = d * .3;
        if (!a || a < Math.abs(c)) {
            a = c; 
            s = p / 4;
        } else {
            s = p/(2*Math.PI) * Math.asin(c/a);
        }
        return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
    },

    elasticInOut: function(t, b, c, d, a, p) {
        let s;
        if (t==0) return b;
        if ((t /= d / 2) == 2) return b+c;
        if (typeof p == "undefined") p = d * (.3 * 1.5);
        if (!a || a < Math.abs(c)) {
            a = c; 
            s = p / 4;
        } else {
            s = p / (2  *Math.PI) * Math.asin(c / a);
        }
        if (t < 1) return -.5 * (a * Math.pow(2, 10* (t -=1 )) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p ) * .5 + c + b;
    }
};

export default class Tween extends PubSubAble {
    obj: any;
    target: any;
    fn: Function;
    onProcess: Function;
    onComplete: Function;
    onError: Function;
    record = {};
    startTime = 0;
    duration = 500;

    constructor(obj, ref?) {
        super(ref);
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

    error(fn) {
        this.onError = fn;
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
            this.onError ? this.onComplete(e) : Log.errorLog(e);
            this.stop();
        }
    }

    forEach(obj, iterator) {
        for (let key in obj) {
            iterator.call(this, key, obj[key]);
        }
    }
}