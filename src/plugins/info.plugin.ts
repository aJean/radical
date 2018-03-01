import Util from '../util';

/**
 * @file 版权遮罩层
 */

export default class Info {
    data: any;
    pano: any;
    
    constructor(pano, data) {
        this.pano = pano;
        this.data = data;
    
        this.createDom();
    }

    createDom() {
        const root = Util.createElement('<div class="pano-info"></div>');

        if (this.data.logo) {
            root.innerHTML +=  `<img src="${this.data.logo}" width="70">`;
        }
        root.innerHTML += `<div class="pano-info-name">${this.data.author}</div>`;

        this.pano.getRoot().appendChild(root);
    }
}