import {Mesh, CircleGeometry, MeshBasicMaterial, DoubleSide, CanvasTexture} from 'three';
import Plastic from '../plastic/plastic';
import Tween from '../animations/tween.animation';

/**
 * @file 视点模型
 */

const defaultOpts = {
    order: 10,
    color: '#fff',
    raidus: 5,
    seagment: 32,
    anim: false,
    animImg: null
};
export default class Point extends Plastic {
    frame: any;
    tween: any;
    pano: any;
    ctx: any;

    constructor(opts, pano) {
        super();
        this.pano = pano;
        this.data = Object.assign({}, defaultOpts, opts);
        
        this.create();
    }

    create() {
        const data = this.data;
        const mesh: any = this.plastic = new Mesh(new CircleGeometry(data.raidus, data.seagment),
            new MeshBasicMaterial({
                color: data.color, 
                depthTest: false, 
                side: DoubleSide,
                transparent: true
            }));
        mesh.renderOrder = data.order;
        mesh.wrapper = this;

        if (data.name) {
            mesh.name = name;
        }

        if (data.parent) {
            data.parent.add(mesh);
        }

        if (data.anim) {
            const canvas = document.createElement('canvas');
            const ctx = this.ctx = canvas.getContext('2d');
            canvas.width = 64;
            canvas.height = 64;

            const frame = this.frame = new Mesh(new CircleGeometry(32, data.seagment),
                new MeshBasicMaterial({
                    map: new CanvasTexture(canvas), 
                    depthTest: false, 
                    side: DoubleSide,
                    transparent: true
                }));
            frame.renderOrder = data.order + 1;
            mesh.add(frame);
        }
    }

    fade(cb) {
        const circle = this.plastic.material;
        
        circle.visible = false;
        this.tween = new Tween({rad: -Math.PI / 2}).to({rad: Math.PI * 2}).effect('linear', 1500)
            .start(['rad'], this.pano).process((old, val) => {
                this.draw(val);
            }).complete(() => {
                this.tween = new Tween({scale: 1}).to({scale: 0.2}).effect('linear', 500)
                .start(['scale'], this.pano).process((old, val) => {
                    this.scale(val);
                }).complete(() => {
                    circle.visible = true;
                    cb && cb();
                });
            });
    }

    draw(rad) {
        const frame = this.frame;
        const ctx = this.ctx;

        ctx.lineWidth = 4;
        ctx.strokeStyle = '#fff';

        ctx.clearRect(0, 0, 64, 64);
        ctx.beginPath();
        ctx.arc(32, 32, 10, -Math.PI / 2, rad);
        ctx.stroke();
        frame.material.map.needsUpdate = true;
    }

    scale(n) {
        const frame = this.frame;
        const ctx = this.ctx;

        ctx.lineWidth = 4;
        ctx.strokeStyle = '#fff';

        ctx.clearRect(0, 0, 64, 64);
        ctx.beginPath();
        ctx.arc(32, 32, 10 * n, -Math.PI / 2, Math.PI * 2);
        ctx.stroke();
        frame.material.map.needsUpdate = true;
    }

    fadeStop() {
        const frame = this.frame;

        if (this.tween) {
            this.tween.stop();
            this.ctx.clearRect(0, 0, 1000, 1000);
        }

        this.plastic.material.visible = true;
        frame.material.map.needsUpdate = true;
    }

    show() {
        this.plastic.visible = true;
    }

    hide() {
        this.plastic.visible = false;
    }

    dispose() {
        delete this.plastic['wrapper'];
        super.dispose();
    }
}