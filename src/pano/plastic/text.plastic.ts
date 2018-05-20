import { PlaneGeometry, MeshBasicMaterial, Mesh, CanvasTexture, DoubleSide } from 'three';
import Plastic from './plastic';
import Tween from '../animations/tween.animation';

/**
 * @file 文字形状
 */

const defaultOpts = {
    name: '',
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

    create() {
        this.buildCanvasText();

        const data = this.data;
        const mesh: any = this.plastic = new Mesh(new PlaneGeometry(data.width, data.height),
            new MeshBasicMaterial({
                map: new CanvasTexture(this.canvas),
                depthTest: false,
                transparent: true,
                side: DoubleSide
            }));
        // delete before dispose
        mesh.wrapper = this;
        mesh.position.set(data.x, data.y, data.z);
        mesh.rotation.y = Math.PI;
        mesh.renderOrder = data.order;
        mesh.name = data.name;

        if (data.hide) {
            mesh.visible = false;
        }

        if (data.parent) {
            data.parent.add(mesh);
        }

        return mesh;
    }

    buildCanvasText() {
        const data = this.data;
        const canvas = this.canvas;
        let width = canvas.width = data.width;
        let height = canvas.height = data.height;

        const ctx = canvas.getContext('2d');
        ctx.font = `normal ${data.fontsize}px ${data.fontface}`;
        const metrics = ctx.measureText(data.text);

        if (metrics.width > width) {
            width = data.twidth = canvas.width = width * 2;
            ctx.font = `normal ${data.fontsize}px ${data.fontface}`;
        }

        ctx.lineWidth = data.lineWidth;
        ctx.textAlign = 'center';
        ctx.fillStyle = data.color;
        ctx.fillText(data.text, width / 2, height / 2 + 10);
    }

    change(text) {
        const data = this.data;
        const context = this.canvas.getContext('2d');
        data.text = text;

        this.plastic.material.map.needsUpdate = true;
        context.clearRect(0, 0, data.width, data.height);
        context.fillText(text, data.width / 2, data.height / 2 + 10);
    }

    dispose() {
        delete this.plastic['wrapper'];
        super.dispose();
    }
}