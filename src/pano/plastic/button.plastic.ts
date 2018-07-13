import { PlaneGeometry, MeshBasicMaterial, Mesh, CanvasTexture, DoubleSide, TextureLoader } from 'three';
import Plastic from '../../interface/plastic.interface';
import Assets from '../../vr/assets.vr';

/**
 * @file webgl button
 */

const defaultOpts = {
    name: '',
    order: 6,
    width: 256,
    height: 100,
    text: 'simple button',
    twidth: 256,
    theight: 128,
    color: '#fff',
    lineWidth: 4,
    fontsize: 42,
    fontface: 'Arial',
    bg: Assets.hover,
    active: true,
    x: 0,
    y: 0,
    z: 0
};
export default class Button extends Plastic {
    text: any;
    loader = new TextureLoader();
    canvas = document.createElement('canvas');

    constructor(opts) {
        super();
        this.opts = Object.assign({}, defaultOpts, opts);

        this.create();
    }

    create() {
        const opts = this.opts;
        const btn: any = this.plastic = new Mesh(new PlaneGeometry(opts.width, opts.height),
            new MeshBasicMaterial({
                map: this.loader.load(opts.bg),
                transparent: true,
                depthTest: false,
                side: DoubleSide
            }));

        btn.wrapper = this;
        btn.renderOrder = opts.order;
        btn.position.set(opts.x, opts.y, opts.z);
        btn.name = opts.name;

        if (opts.parent) {
            this.addTo(opts.parent);
        }

        if (!opts.active) {
            btn.material.visible = false;
        }

        this.buildCanvasText();
        const text = this.text = new Mesh(new PlaneGeometry(opts.twidth, opts.theight),
            new MeshBasicMaterial({
                map: new CanvasTexture(this.canvas),
                transparent: true,
                depthTest: false,
                side: DoubleSide
            }));
        text.name = opts.name;
        text.renderOrder = opts.order + 1;
        text.rotation.y = Math.PI;
        text.position.set(0, 0, 1);

        btn.add(text);
    }

    buildCanvasText() {
        const opts = this.opts;
        const canvas = this.canvas;
        let width = canvas.width = opts.twidth;
        let height = canvas.height = opts.theight;

        const ctx = canvas.getContext('2d');
        ctx.font = `normal ${opts.fontsize}px ${opts.fontface}`;
        const metrics = ctx.measureText(opts.text);

        if (metrics.width > width) {
            width = opts.twidth = canvas.width = width * 2;
            ctx.font = `normal ${opts.fontsize}px ${opts.fontface}`;
        }

        ctx.lineWidth = opts.lineWidth;
        ctx.textAlign = 'center';
        ctx.fillStyle = opts.color;
        ctx.fillText(opts.text, width / 2, height / 2 + 15);
    }

    getActive() {
        return this.opts.active;
    }

    setActive(flag) {
        const opts = this.opts;
        const btn = this.plastic;

        btn.material.visible = opts.active = flag;
    }

    dispose() {
        const text = this.text;
        text.material.map.dispose();
        text.geometry.dispose();

        delete this.plastic['wrapper'];
        super.dispose();
    }
}