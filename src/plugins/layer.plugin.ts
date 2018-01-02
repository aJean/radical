/**
 * @file 遮罩层
 */

export default class Layer {
    data: any;
    panoram: any;
    
    constructor(panoram, data) {
        this.panoram = panoram;
        this.data = data;
    
        this.createDom();
    }

    createDom() {
        const root = document.createElement('div');
        root.className = "panrom-info";

        root.innerHTML = `<img src="${this.data.logo}" width="70">
            <div class="panrom-info-name">${this.data.author}</div>`;

        this.panoram.getRoot().appendChild(root);
    }
}