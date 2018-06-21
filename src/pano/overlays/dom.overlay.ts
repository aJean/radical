import {IPluggableOverlay} from '../../interface/overlay.interface';
import Util from '../../core/util';

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
        const node = Util.createElement(`<div id="${data.id}" class="pano-domoverlay">${data.content}</div>`);

        if (data.cls) {
            node.className += ` ${data.cls}`;
        }

        return node;
    }

    update(x: number, y: number): any {
        const elem = this.elem;
        const data = this.data;

        if (!data.width) {
            data.width = elem.offsetWidth;
            data.height = elem.offsetHeight;
        }

        Util.styleElement(elem, {
            display: 'block',
            top: y - data.height / 2,
            left: x - data.width / 2
        });

        data.x = x;
        data.y = y;
    }

    /**
     * 用于进入沉浸态
     */
    hide() {
        this.elem.style.visibility = 'hidden';
    }

    /**
     * 用于退出沉浸态
     */
    show() {
        this.elem.style.visibility = 'visible';
    }

    /**
     * 用于在 z > 1 时移出文档流
     */
    out() {
        this.elem.style.display = 'none';
    }

    in(state) {
        this.elem.style.display = state || 'block';
    }

    dispose() {}
}