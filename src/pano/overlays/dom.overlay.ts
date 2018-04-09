import {IPluggableOverlay} from '../interface/overlay.interface';
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

        if (x !== data.x || y !== data.y) {
            Util.styleElement(elem, {
                display: 'block',
                top: y,
                left: x
            });
        }

        data.x = x;
        data.y = y;
    }

    hide() {
        this.elem.style.display = 'none';
    }

    show() {
        this.elem.style.display = 'block';
    }

    dispose() {}
}