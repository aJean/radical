import Util from '../util';
import Layer from './layer.ui';
import CssAnimation from '../animations/css.animation';

/**
 * popup component
 */

const defaultOpts = {
    hide: true,
    closeBtn: true,
    width: 300,
    height: 300,
    x: 0,
    y: 0
};
export default class Popup extends Layer {
    data: any;
    root: HTMLElement;
    content: HTMLElement;
    container: HTMLElement;
    anim: CssAnimation;

    constructor(opts?) {
        super(Object.assign({}, defaultOpts, opts));

        this.createCloseBtn();
        this.anim = new CssAnimation(this.root, {
            prop: 'transform',
            timing: 'ease-out',
            value: 'scale(0)'
        });
    }

    createCloseBtn() {
        const data = this.data;
        console.log(data)
        if (data.closeBtn) {
            const btn = Util.createElement('<span class="panoram-icon panoram-layer-close"></span>');
            btn.addEventListener('click', () => this.hide());
            this.root.appendChild(btn);
        }
    }

    show() {
        const data = this.data;
        this.root.style.display = 'block';

        if (data.effect === 'scale') {
            setTimeout(() => this.anim.start('scale(1)'), 20);
        }
    }

    hide() {
        const data = this.data;
        data.onLayerClose && data.onLayerClose();

        if (data.effect === 'scale') {
            this.anim.start('scale(0)').complete(() => this.root.style.display = 'none');
        } else {
            this.root.style.display = 'none';
        }
    }
}