import { PlaneGeometry, MeshBasicMaterial, Mesh, CanvasTexture, DoubleSide, Texture, TextureLoader } from 'three';
import Plastic from '../../interface/plastic.interface';
import Assets from '../../vr/assets.vr';

/**
 * @file webgl icon button
 */

const defaultOpts = {
    name: '',
    order: 6,
    width: 90,
    height: 90,
    bwidth: 100,
    bheight: 100,
    text: null,
    twidth: 256,
    theight: 128,
    color: '#fff',
    lineWidth: 4,
    fontsize: 42,
    fontface: 'Arial',
    icon: Assets.hover,
    bg: Assets.hover,
    x: 0,
    y: 0,
    z: 0
};
export default class Icon extends Plastic {
    bg: any;
    text: any;
    loader = new TextureLoader();
    canvas = document.createElement('canvas');

    constructor(opts) {
        super();
        this.opts = Object.assign({}, defaultOpts, opts);

        this.create();
        this.createBg();
        opts.text && this.createText();
    }

    create() {
        const opts = this.opts;
        const icon: any = this.plastic = new Mesh(new PlaneGeometry(opts.width, opts.height),
            new MeshBasicMaterial({
                map: this.loader.load(opts.icon),
                transparent: true,
                depthTest: false,
                side: DoubleSide
            }));

        icon.wrapper = this;
        icon.renderOrder = opts.order;
        icon.position.set(opts.x, opts.y, opts.z);
        icon.name = opts.name;
        
        if (opts.parent) {
            this.addTo(opts.parent);
        }
    }

    createBg() {
        const opts = this.opts;
        const bg = this.bg = new Mesh(new PlaneGeometry(opts.bwidth, opts.bheight),
            new MeshBasicMaterial({
                map: this.loader.load(Assets.hover),
                depthTest: false,
                transparent: true,
                side: DoubleSide
            }));

        bg.position.set(0, 0, 1);
        bg.renderOrder = opts.order + 1;
        bg.name = opts.name;
        bg.visible = false;

        this.plastic.add(bg);
    }

    createText() {
        this.buildCanvasText();

        const opts = this.opts;
        const text = this.text = new Mesh(new PlaneGeometry(opts.twidth, opts.theight), new MeshBasicMaterial({
            map: new CanvasTexture(this.canvas),
            transparent: true,
            depthTest: false,
            side: DoubleSide
        }));
        text.name = opts.name;
        text.renderOrder = opts.order + 1;
        text.rotation.y = Math.PI;
        text.position.set(0, -80, 1);
        text.visible = false;

        this.plastic.add(text);
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

    showHover() {
        this.bg.visible = true;

        if (this.text) {
            this.text.visible = true;
        }
    }

    hideHover() {
        this.bg.visible = false;

        if (this.text) {
            this.text.visible = false;
        }
    }

    dispose() {
        const bg = this.bg;
        bg.material.map.dispose();
        bg.geometry.dispose();

        const text = this.text;
        text.material.map.dispose();
        text.geometry.dispose();

        delete this.plastic['wrapper'];
        super.dispose();
    }
}