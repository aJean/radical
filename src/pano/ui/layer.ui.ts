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
    element: HTMLElement;
    content: HTMLElement;
    container: HTMLElement;

    constructor(opts?) {
        this.data = Object.assign({}, defaultOpts, opts);
        this.create();
    }

    create() {
        const data = this.data;
        const element = this.element = document.createElement('div');
        const content = this.content = document.createElement('div');
        element.className = 'pano-layer';
        content.className = 'pano-layer-content';

        if (data.hide) {
            element.style.display = 'none';
        }

        element.appendChild(content);
        this.setSize(data);
        this.setPostion(data);
    }

    getElement() {
        return this.element;
    }

    setSize(data) {
        this.content.style.width = data.width + 'px';
        this.content.style.height = data.height + 'px';
    }

    setPostion(pos) {
        this.element.style.left = pos.x + 'px';
        this.element.style.top = pos.y + 'px';
    }

    setContent(child) {
        this.content.appendChild(child);
    }

    setContainer(container) {
        this.container = container;
        container.appendChild(this.element);
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }

    dispose() {
        const element = this.element;

        element.style.display = 'none'
        element.innerHTML = '';
        this.container.removeChild(this.element);
    }
}