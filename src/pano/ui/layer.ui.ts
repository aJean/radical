import {IPluggableUI} from '../interface/ui.interface';

/**
 * @file dom layer
 */

const defaultOpts = {
    hide: true,
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

    constructor(opts?) {
        this.data = Object.assign({}, defaultOpts, opts);
        this.create();
    }

    create() {
        const data = this.data;
        const root = this.root = document.createElement('div');
        const content = this.content = document.createElement('div');
        root.className = 'pano-layer';
        content.className = 'pano-layer-content';

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

    setContainer(container) {
        this.container = container;
        container.appendChild(this.root);
    }

    show() {
        this.root.style.display = 'block';
    }

    hide() {
        this.root.style.display = 'none';
    }

    dispose() {
        const root = this.root;

        root.style.display = 'none'
        root.innerHTML = '';
        this.container.removeChild(this.root);
    }
}