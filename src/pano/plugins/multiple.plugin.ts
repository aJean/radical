import PluggableUI from '../../interface/ui.interface';
import Util from '../../core/util';

/**
 * @file 多场景切换插件
 */

export default class Multiple extends PluggableUI {
    pano: any;
    data: any;
    element: any;
    container: any;
    outer: any;
    inner: any;
    activeItem: any;
    isActive = true;

    constructor(pano, data) {
        super();

        this.pano = pano;
        this.data = data;
        this.create();
        this.bindEvent();
    }

    create() {
        const root = this.element = Util.createElement('<div class="pano-multiplescene"></div>');
        const outer = this.outer = Util.createElement('<div class="pano-multiplescene-outer"></div>');
        const inner = this.inner = Util.createElement('<div class="pano-multiplescene-inner"></div>');
        
        inner.innerHTML = this.data.map((item, i) => {
            return `<div class="pano-multiplescene-item" data-id="${i}">
                <img src="${item.thumbPath}" class="pano-multiplescene-img">
                <span class="pano-multiplescene-name">${item.name}</span>
            </div>`;
        }).join('');

        outer.appendChild(inner);
        root.appendChild(outer);
        this.setActive(inner.childNodes[0]);
        // add to pano root
        this.setContainer(this.pano.getRoot());
    }

    bindEvent() {
        const pano = this.pano;
        const inner = this.inner;
        const Topic = this.Topic;

        this.onClickHandle = this.onClickHandle.bind(this);
        this.onWheelHandle = this.onWheelHandle.bind(this);

        inner.addEventListener('click', this.onClickHandle);
        inner.addEventListener('mousewheel', this.onWheelHandle);
        // 管理 actionType 为 multiple 的 overlay 
        this.subscribe(Topic.UI.MULTIPLEACTIVE, this.onMultipleActive.bind(this));
        // 管理激活状态
        this.subscribe(Topic.SCENE.ATTACHSTART, this.onDisable.bind(this));
        this.subscribe(Topic.SCENE.ATTACH, this.onEnable.bind(this));
        // 重新渲染场景列表
        this.subscribe(Topic.SCENE.RESET, this.onReset.bind(this));
    }

    getElement() {
        return this.element;
    }

    setContainer(container) {
        this.container = container;
        container.appendChild(this.element);
    }

    onClickHandle(e) {
        e.preventDefault();
        const node = this.findParent(e.target, 'pano-multiplescene-item');

        if (node && this.isActive) {
            const id = node.getAttribute('data-id');
            const scene = this.data[id];

            if (scene) {
                this.pano.enterNext(scene);
                this.setActive(node);
            }
        }
    }

    onWheelHandle(e) {
        const dis = e.deltaY;
        this.inner.scrollLeft += dis;
    }

    /**
     * 热点触发的组件管理切换
     * @param topic 订阅主题
     * @param {Object} payload 负载
     * @param {Object} payload.scene 要切换到的场景
     * @param {Object} payload.pano 全景对象
     */
    onMultipleActive(topic, payload) {
        const scenes = this.data;
        const scene = scenes.find(item => item.id == payload.scene.sceneId);
        const index = scenes.indexOf(scene);
        const node = this.inner.querySelector(`div[data-id="${index}"]`);

        if (scene && node) {
            this.pano.enterNext(scene);
            this.setActive(node);
        }
    }

    onDisable() {
        this.isActive = false;
    }

    onEnable() {
        this.isActive = true;
    }

    onReset(topic, payload) {
        const inner = this.inner;
        const outer = this.outer;
        const scenes = this.data = payload.scenes;

        inner.innerHTML = scenes.map((item, i) => {
            return `<div class="pano-multiplescene-item" data-id="${i}">
                <img src="${item.thumbPath}" class="pano-multiplescene-img">
                <span class="pano-multiplescene-name">${item.name}</span>
            </div>`;
        }).join('');

        outer.scrollLeft = 0;
        this.setActive(inner.childNodes[0]);
    }

    findParent(node, cls) {
        while (node != null) {
            if (node.className == cls) {
                return node;
            }

            node = node.parentNode;
        }
    }

    /**
     * 设置选中场景
     */
    setActive(node) {
        if (this.activeItem) {
            const cls = this.activeItem.className;
            this.activeItem.className = cls.replace(' active', '');
        }

        node.className += ' active';
        this.activeItem = node;
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }

    dispose() {
        const pano = this.pano;
        const inner = this.inner;

        inner.removeEventListener('click', this.onClickHandle);
        inner.removeEventListener('mousewheel', this.onWheelHandle);
        this.element.innerHTML = '';
        this.container.removeChild(this.element);

        super.dispose();
    }
}