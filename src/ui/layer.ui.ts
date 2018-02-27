import {IPluggableUI} from '../interface/ui.interface';
import CssAnimation from '../animations/css.animation';

/**
 * @file dom layer
 */

const defaultOpts = {
    hide: false,
    closeBtn: false,
    width: 300,
    height: 300,
    x: 0,
    y: 0
};
export default class Layer implements IPluggableUI {
    data: any;
    root: HTMLElement;
    content: HTMLElement;
    container: HTMLElement;
    anim: CssAnimation;

    constructor(opts?) {
        this.data = Object.assign({}, defaultOpts, opts);
        this.create();

        this.anim = new CssAnimation(this.root, {
            prop: 'transform',
            timing: 'ease-out',
            value: 'scale(0)'
        });
    }

    create() {
        const data = this.data;
        const root = this.root = document.createElement('div');
        const content = this.content = document.createElement('div');
        root.className = 'panoram-layer';
        content.className = 'panoram-layer-conten';

        if (data.closeBtn) {
            const btn = document.createElement('span');
            btn.className = 'panoram-icon panoram-layer-close';
            btn.onclick = () => this.hide();
            root.appendChild(btn);
        }

        if (data.hide) {
            root.style.display = 'none';
        }

        root.appendChild(content);
        this.setSize(data);
        this.setPostion(data);
    }

    getElement() {
        return this.root;
    }

    setSize(data) {
        this.content.style.width = data.width + 'px';
        this.content.style.height = data.height + 'px';
    }

    setPostion(pos) {
        this.root.style.left = pos.x + 'px';
        this.root.style.top = pos.y + 'px';
    }

    setContent(child) {
        this.content.appendChild(child);
    }

    appendTo(container) {
        this.container = container;
        container.appendChild(this.root);
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

    dispose() {
        const root = this.root;

        root.style.display = 'none'
        root.innerHTML = '';
        this.container.removeChild(this.root);
    }
}