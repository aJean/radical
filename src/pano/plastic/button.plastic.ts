import {PlaneGeometry, MeshBasicMaterial, Mesh, CanvasTexture, DoubleSide, Texture, TextureLoader} from 'three';
import Plastic from './plastic';
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
        this.data = Object.assign({}, defaultOpts, opts);
        
        this.create();
    }

    create() {
        const data = this.data;
        const btn: any = this.plastic = new Mesh(new PlaneGeometry(data.width, data.height), new MeshBasicMaterial({
            map: this.loader.load(data.bg),
            transparent: true,
            depthTest: false,
            side: DoubleSide
        }));

        btn.wrapper = this;
        btn.renderOrder = data.order;
        btn.position.set(data.x, data.y, data.z);
        btn.name = data.name;

        if (data.parent) {
            data.parent.add(btn);
        }

        if (!data.active) {
            btn.material.visible = false;
        }

        this.buildCanvasText();
        const text = this.text = new Mesh(new PlaneGeometry(data.twidth, data.theight), new MeshBasicMaterial({
            map: new CanvasTexture(this.canvas),
            transparent: true,
            depthTest: false,
            side: DoubleSide
        }));
        text.name = data.name;
        text.renderOrder = data.order + 1;
        text.rotation.y = Math.PI;
        text.position.set(0, 0, 1);

        btn.add(text);
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

    setActive(flag) {
        const data = this.data;
        const btn = this.plastic;

        btn.material.visible = data.active = flag;
    }

    dispose() {
        const text = this.text;
        text.material.map.dispose();
        text.geometry.dispose();

        delete this.plastic['wrapper'];
        super.dispose();
    }
}