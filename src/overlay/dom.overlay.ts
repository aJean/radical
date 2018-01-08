/**
 * @file dom element overlay
 */

export default class DomOverlay {
    data: any;
    elem: any;

    constructor(data) {
        this.data = data;
        this.elem = this.create(data);
    }

    create(data) {
        const node = document.createElement('div'); 
        node.id = data.id;
        node.innerHTML = data.content;
        node.className = 'panrom-domoverlay';

        if (data.cls) {
            node.className += ` ${data.cls}`;
        }

        return node;
    }

    update(x, y) {
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
}