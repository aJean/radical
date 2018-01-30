import {IPluggableOverlay} from './interface.overlay';

/**
 * @file dom element overlay
 */

export default class DomOverlay implements IPluggableOverlay {
    data: any;
    elem: any;
    type = "dom";

    constructor(data) {
        this.data = data;
        this.elem = this.create();
    }

    create() {
        const data = this.data;
        const node = document.createElement('div'); 
        node.id = data.id;
        node.innerHTML = data.content;
        node.className = 'panrom-domoverlay';

        if (data.cls) {
            node.className += ` ${data.cls}`;
        }

        return node;
    }

    update(x: number, y: number): any {
        const elem = this.elem;
        const data = this.data;

        data.x = x;
        data.y = y;
        elem.style.display = 'block';
        elem.style.left = x + 'px';
        elem.style.top = y + 'px';
    }

    hide() {
        this.elem.style.display = 'none';
    }

    show() {
        this.elem.style.display = 'block';
    }

    dispose() {}
}