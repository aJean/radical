/**
 * @file css animation
 */

const defaultOpts = {
    prop: 'transform',
    duration: 1000,
    timing: 'ease'
};
export default class CssAnimation {
    data: any;
    element: HTMLElement;
    onComplete: Function;
    lastValue: any;

    constructor(element, opts?) {
        const data = this.data = Object.assign({}, defaultOpts, opts);
        this.element = element;
   
        element.style.webkitTransition = `${data.prop} ${data.duration} ${data.timing}`;
        element.addEventListener('webkitTransitionEnd', () => this.onComplete());
    }

    start(value) {
        const element = this.element;
        const prop = 'webkit' + this.data.prop.toUpperCase();
        
        this.lastValue = element.style[prop];
        element.style[prop] = value;
        return this;
    }

    end(attr, value) {
        this.element.style['-webkit-animation-play-state'] = 'paused';
        return this;
    }

    complete(fn) {
        this.onComplete = fn;
        return this;
    }
}