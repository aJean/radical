import Util from '../../core/util';

/**
 * @file 版权遮罩层
 */

export default class Info {
    element: any;
    pano: any;
    
    constructor(pano) {
        this.pano = pano;
        
        this.createDom(pano.currentData.info);
        pano.subscribe('scene-attach', data => {
            this.renderDom(data.info);
        });
    }

    createDom(data) {
        const element = this.element = Util.createElement('<div class="pano-info"></div>');

        if (data.logo) {
            element.innerHTML =  `<img src="${data.logo}" width="70">`;
        }
        element.innerHTML += `<div class="pano-info-name">${data.author}</div>`;

        this.pano.getRoot().appendChild(element);
    }

    renderDom(data) {
        const element = this.element;

        if (data.logo) {
            element.innerHTML = `<img src="${data.logo}" width="70">`;
        } else {
            element.innerHTML = '';
        }
        element.innerHTML += `<div class="pano-info-name">${data.author}</div>`;
    }
}