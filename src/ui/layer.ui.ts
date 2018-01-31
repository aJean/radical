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
export default class Layer {
    data: any;
    root: HTMLElement;
    content: HTMLElement;

    constructor(opts?) {
        this.data = Object.assign({}, defaultOpts, opts);
        this.create();
        this.resetEffect();
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

    attchEffect() {
        const data = this.data;

        if (data.effect == 'scale') {
            this.root.style.webkitTransform = 'scale(1)';
        }
    }

    resetEffect() {
        const data = this.data;

        if (data.effect == 'scale') {
            this.root.style.webkitTransform = 'scale(0)';
        }
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
        container.appendChild(this.root);
    }

    show() {
        this.root.style.display = 'block';
        setTimeout(() => this.attchEffect(), 20);
    }

    hide() {
        const data = this.data;
        data.onLayerClose && data.onLayerClose();
        this.resetEffect();

        setTimeout(() => this.root.style.display = 'none', 1000);
    }
}