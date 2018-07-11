import PluggableUI from '../../interface/ui.interface';
import Util from '../../core/util';

/**
 * @file 版权遮罩层
 */

export default class Info extends PluggableUI {
    pano: any;
    
    constructor(pano) {
        super();

        const Topic = this.Topic;
        this.pano = pano;
        this.createDom(pano.currentData);
        this.setContainer(pano.getRoot());
        this.subscribe(Topic.SCENE.ATTACH, this.renderDom.bind(this));
        this.subscribe(Topic.VR.ENTER, this.hide.bind(this));
        this.subscribe(Topic.VR.EXIT, this.show.bind(this));
    }

    createDom(data) {
        const info = data.info;        
        const element = this.element = Util.createElement('<div class="pano-info"></div>');

        if (info) {
            element.innerHTML = info.logo ? `<img src="${info.logo}" width="70">` : '';
            element.innerHTML += `<a href="${info.url}" class="pano-info-name">${info.author}</a>`;
        }
    }

    renderDom(topic, payload) {
        const info = payload.scene.info;
        const element = this.element;

        if (info) {
            element.innerHTML = info.logo ? `<img src="${info.logo}" width="70">` : '';
            element.innerHTML += `<div class="pano-info-name">${info.author}</div>`;
            this.show();
        } else {
            this.hide();
        }
    }

    dispose() {
        super.dispose();
    }
}