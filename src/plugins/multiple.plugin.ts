import Util from '../util';
import util from '../util';

/**
 * 多场景切换插件
 * @require multiple.less
 */

export default class Multiple {
    panoram: any;
    data: any;
    root: any;
    outer: any;
    inner: any;
    activeItem: any;

    constructor(panoram, data) {
        this.panoram = panoram;
        this.data = data;
        this.createDom();
        this.bindEvent();
    }

    createDom() {
        const root = this.root = document.createElement('div');
        const outer = this.outer = document.createElement('div');
        const inner = this.inner = document.createElement('div');

        root.className = 'panoram-multiplescene';
        outer.className = 'panoram-multiplescene-outer';
        inner.className = 'panoram-multiplescene-inner';
        
        inner.innerHTML = this.data.map((item, i) => {
            return `<div class="panoram-multiplescene-item" data-id="${i}">
                <img src="${item.thumbPath}" class="panoram-multiplescene-img">
            </div>`;
        }).join('');

        outer.appendChild(inner);
        root.appendChild(outer);
        this.panoram.getRoot().appendChild(root);
        this.setActive(inner.childNodes[0]);
    }

    bindEvent() {
        const inner = this.inner;

        inner.addEventListener('click', e => {
            const node = this.findParent(e.target, 'panoram-multiplescene-item');
            const id = node.getAttribute('data-id');
            const scene = this.data[id];

            if (scene) {
                this.panoram.enterNext(scene);
                this.setActive(node);
            }
        });

        if (!Util.isMobile) {
            inner.addEventListener('mousewheel', e => {
                const dis = e.deltaY;
                inner.scrollLeft += dis;
            });
        }
    }

    findParent(node, cls) {
        while (node != null) {
            if (node.className == cls) {
                return node;
            }

            node = node.parentNode;
        }
    }

    setActive(node) {
        if (this.activeItem) {
            const cls = this.activeItem.className;
            this.activeItem.className = cls.replace(' active', '');
        }

        node.className += ' active';
        this.activeItem = node;
    }
}