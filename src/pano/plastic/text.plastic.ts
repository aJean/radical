import { PlaneGeometry, MeshBasicMaterial, Mesh, CanvasTexture, DoubleSide } from 'three';
import Plastic from './plastic';
import Tween from '../animations/tween.animation';

/**
 * @file 文字形状
 */

const defaultOpts = {
    name: '',
    fontface: 'helvetica',
    width: 256,
    height: 256,
    fontsize: 42,
    linewidth: window.devicePixelRatio > 2 ? 6 : 4,
    weight: 300,
    color: '#fff',
    shadow: false,
    hide: false,
    order: 5,
    inverse: true,
    x: 0,
    y: 0,
    z: 0
};
export default class Text extends Plastic {
    canvas = document.createElement('canvas');

    constructor(opts) {
        super();

        this.opts = Object.assign({}, defaultOpts, opts);
        this.create();
    }

    create() {
        this.buildCanvasText();

        const opts = this.opts;
        const mesh: any = this.plastic = new Mesh(new PlaneGeometry(opts.width, opts.height),
            new MeshBasicMaterial({
                map: new CanvasTexture(this.canvas),
                depthTest: false,
                transparent: true,
                side: DoubleSide
            }));
        // delete before dispose
        mesh.wrapper = this;
        mesh.position.set(opts.x, opts.y, opts.z);
        mesh.rotation.y = opts.inverse ? Math.PI : 0;
        mesh.renderOrder = opts.order;
        mesh.name = opts.name;

        if (opts.hide) {
            mesh.visible = false;
        }

        if (opts.parent) {
            this.addTo(opts.parent);
        }

        return mesh;
    }

    buildCanvasText() {
        const opts = this.opts;
        const canvas = this.canvas;
        let width = canvas.width = opts.width;
        let height = canvas.height = opts.height;

        const ctx = canvas.getContext('2d');
        ctx.font = `normal ${opts.fontsize}px ${opts.fontface}`;
        const metrics = ctx.measureText(opts.text);

        if (metrics.width > width) {
            width = opts.twidth = canvas.width = width * 2;
            ctx.font = `normal ${opts.weight} ${opts.fontsize}px ${opts.fontface}`;
        }

        ctx.lineWidth = opts.linewidth;
        ctx.textAlign = 'center';
        ctx.fillStyle = opts.color;
        // 阴影
        if (opts.shadow) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 6;
        }
        
        let text = opts.text;
        const limit = opts.limit;

        if (limit !== void 0 && limit < text.length) {
            text = text.substring(0, limit - 1) + '...';
        }

        ctx.beginPath();
        ctx.fillText(text, width / 2, height / 2 + 10);
        ctx.closePath();

        // 描边
        if (opts.strokecolor) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = opts.strokecolor;
            ctx.strokeText(opts.text, width / 2, height / 2 + 10, 200);
            ctx.closePath();
        }
    }
    
    rotate(rad) {
        this.plastic.rotateY(rad);
    }

    change(text) {
        const opts = this.opts;
        const context = this.canvas.getContext('2d');
        opts.text = text;

        this.plastic.material.map.needsUpdate = true;
        context.clearRect(0, 0, opts.width, opts.height);
        context.fillText(text, opts.width / 2, opts.height / 2 + 10);
    }

    dispose() {
        delete this.plastic['wrapper'];
        super.dispose();
    }
}