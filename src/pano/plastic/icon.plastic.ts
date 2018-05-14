import {PlaneGeometry, MeshBasicMaterial, Mesh, CanvasTexture, DoubleSide, Texture, TextureLoader} from 'three';
import Plastic from './plastic';
import Assets from '../../vr/assets.vr';

/**
 * @file webgl icon button
 */

const defaultOpts = {
    name: '',
    order: 6,
    width: 90,
    height: 90,
    bwidth: 90,
    bheight: 90,
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
        this.data = Object.assign({}, defaultOpts, opts);
        
        this.create();
        this.createBg();
        opts.text && this.createText();
    }

    create() {
        const data = this.data;
        const icon: any = this.plastic = new Mesh(new PlaneGeometry(data.width, data.height),
            new MeshBasicMaterial({
                map: this.loader.load(data.icon),
                transparent: true,
                depthTest: false,
                side: DoubleSide
            }));

        icon.wrapper = this;
        icon.renderOrder = data.order;
        icon.position.set(data.x, data.y, data.z);
        icon.name = data.name;

        if (data.parent) {
            data.parent.add(icon);
        }
    }

    createBg() {
        const data = this.data;
        const bg = this.bg = new Mesh(new PlaneGeometry(data.bwidth, data.bheight),
            new MeshBasicMaterial({
                map: this.loader.load(Assets.hover),
                depthTest: false,
                transparent: true,
                side: DoubleSide
            }));
        
        bg.position.set(0, 0, 1);
        bg.renderOrder = data.order + 1;
        bg.name = data.name;
        bg.visible = false;

        this.plastic.add(bg);
    }

    createText() {
        this.buildCanvasText();

        const data = this.data;
        const text = this.text = new Mesh(new PlaneGeometry(data.twidth, data.theight), new MeshBasicMaterial({
            map: new CanvasTexture(this.canvas),
            transparent: true,
            depthTest: false,
            side: DoubleSide
        }));
        text.name = data.name;
        text.renderOrder = data.order + 1;
        text.rotation.y = Math.PI;
        text.position.set(0, -80, 1);
        text.visible = false;

        this.plastic.add(text);
    }


    buildCanvasText() {
        const data = this.data;
        const canvas = this.canvas;
        let width = canvas.width = data.twidth;
        let height = canvas.height = data.theight;

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
        ctx.fillText(data.text, width / 2, height / 2 + 15);
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