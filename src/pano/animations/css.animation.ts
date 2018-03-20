/**
 * @file css animation
 * TODO: multiple set props support
 */

const defaultOpts = {
    prop: 'transform',
    duration: '1s',
    timing: 'ease'
};
export default class CssAnimation {
    data: any;
    element: HTMLElement;
    onComplete: Function;
    lastValue: any;
    prop: string;

    constructor(element, opts?) {
        const data = this.data = Object.assign({}, defaultOpts, opts);
        this.element = element;
        this.prop = this.normalizeProp(data.prop);

        element.style.webkitTransition = `${data.prop} ${data.duration} ${data.timing}`;
        element.addEventListener('transitionEnd', () => this.onComplete && this.onComplete());

        if (data.value) {
            element.style[this.prop] = data.value;
        }
    }

    start(value) {
        const element = this.element;
        const prop = this.prop;
        
        delete this.onComplete;
        this.lastValue = element.style[prop];
        element.style[prop] = value;

        return this;
    }

    end(attr, value) {
        this.element.style.webkitAnimationPlayState = 'paused';
        return this;
    }

    reset(value) {
        this.element.style[this.prop] = value;
    }

    complete(fn) {
        this.onComplete = fn;
        return this;
    }

    normalizeProp(prop) {
        if (prop == 'transform') {
            return 'webkitTransform';
        }

        return prop;
    }
}