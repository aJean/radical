import {PlaneGeometry, MeshBasicMaterial, Mesh, CanvasTexture, DoubleSide} from 'three';
import Plastic from './plastic';
import Tween from '../animations/tween.animation';

/**
 * @file 文字形状
 */

const defaultOpts = {
    fontface: 'Arial',
    fontsize: 42,
    lineWidth: 4,
    color: '#fff',
    text: 'hello bxl',
    width: 256,
    height: 128,
    hide: false,
    order: 5,
    x: 0,
    y: 0,
    z: 0
};
export default class Text extends Plastic {
    canvas = document.createElement('canvas');

    constructor(opts) {
        super();
        this.data = Object.assign({}, defaultOpts, opts);
        
        this.create();
    }

    buildCanvasText() {
        const data = this.data;
        const canvas = this.canvas;
        const width = canvas.width = data.width;
        const height = canvas.height = data.height;

        const context = canvas.getContext('2d');
        context.font = `Bold ${data.fontsize}px ${data.fontface}`;
        context.lineWidth = data.lineWidth;
        context.textAlign = 'center';
        context.fillStyle = data.color;
        context.fillText(data.text, width / 2, height / 2 + 10);

        const metrics = context.measureText(data.text);
    }

    create() {
        this.buildCanvasText();
        
        const data = this.data;
        const mesh = this.plastic = new Mesh(new PlaneGeometry(data.width, data.height), 
            new MeshBasicMaterial({
                map: new CanvasTexture(this.canvas), 
                depthTest: false,
                transparent: true,
                side: DoubleSide
            }));

        mesh.position.set(data.x, data.y, data.z);
        mesh.rotation.y = Math.PI;
        mesh.renderOrder = data.order;

        if (data.hide) {
            mesh.visible = false;
        }

        if (data.parent) {
            data.parent.add(mesh);
        }

        return mesh;
    }

    change(text) {
        const data = this.data;
        const context = this.canvas.getContext('2d');
        
        data.text = text;
        context.clearRect(0, 0, data.width, data.height);
        context.fillText(data.text, data.width / 2, data.height / 2 + 10);
    }
}