import {IPluggableUI} from '../interface/ui.interface';
import Util from '../../core/util';
import Topic from '../../core/topic';
import * as PubSub from 'pubsub-js';

/**
 * @file 版权遮罩层
 */

export default class Info implements IPluggableUI {
    element: any;
    container: any;
    pano: any;
    subtoken: any;
    
    constructor(pano) {
        this.pano = pano;
        
        this.createDom(pano.currentData);
        this.subtoken = PubSub.subscribe(Topic.SCENE.ATTACH, this.renderDom.bind(this));
    }

    createDom(data) {
        const info = data.info;        
        const element = this.element = Util.createElement('<div class="pano-info"></div>');

        if (info) {
            element.innerHTML = info.logo ? `<img src="${info.logo}" width="70">` : '';
            element.innerHTML += `<div class="pano-info-name">${info.author}</div>`;
        }

        this.setContainer();
    }

    renderDom(data) {
        const info = data.info;
        const element = this.element;

        if (info) {
            element.innerHTML = info.logo ? `<img src="${info.logo}" width="70">` : '';
            element.innerHTML += `<div class="pano-info-name">${info.author}</div>`;
            this.show();
        } else {
            this.hide();
        }
    }

    setContainer() {
        this.pano.getRoot().appendChild(this.element);
    }

    detachContainer() {
        this.pano.getRoot().removeChild(this.element);
    }

    getElement() {
        return this.element;
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }

    dispose() {
        this.detachContainer();
        PubSub.unsubscribe(this.subtoken);
    }
}