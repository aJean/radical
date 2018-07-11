import { Mesh, CircleGeometry, MeshBasicMaterial, DoubleSide, CanvasTexture } from 'three';
import Plastic from '../../interface/plastic.interface';
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
        this.opts = Object.assign({}, defaultOpts, opts);

        this.create();
    }

    create() {
        const opts = this.opts;
        const mesh: any = this.plastic = new Mesh(new CircleGeometry(opts.raidus, opts.seagment),
            new MeshBasicMaterial({
                color: opts.color,
                depthTest: false,
                side: DoubleSide,
                transparent: true
            }));
            
        mesh.renderOrder = opts.order;
        mesh.wrapper = this;
        mesh.name = name;

        if (opts.parent) {
            this.addTo(opts.parent);
        }

        if (opts.anim) {
            const canvas = document.createElement('canvas');
            const ctx = this.ctx = canvas.getContext('2d');
            canvas.width = 64;
            canvas.height = 64;

            const frame = this.frame = new Mesh(new CircleGeometry(32, opts.seagment),
                new MeshBasicMaterial({
                    map: new CanvasTexture(canvas),
                    depthTest: false,
                    side: DoubleSide,
                    transparent: true
                }));
            frame.renderOrder = opts.order + 1;
            mesh.add(frame);
        }
    }

    fade(cb) {
        const circle = this.plastic.material;
        const frame = this.frame;

        circle.visible = false;
        frame.visible = true;

        this.tween = new Tween({rad: -Math.PI / 2}, this.pano.ref)
            .to({rad: Math.PI * 2})
            .effect('linear', 1500)
            .start(['rad'])
            .process((old, val) => this.draw(val))
            .complete(() => {
                this.clean();
                circle.visible = true;
                frame.visible = false;
                cb && cb();
            });
    }

    /**
     * draw arc as loading
     */
    draw(rad) {
        const ctx = this.ctx;

        this.frame.material.map.needsUpdate = true;

        ctx.lineWidth = 4;
        ctx.strokeStyle = '#fff';

        ctx.clearRect(0, 0, 64, 64);
        ctx.beginPath();
        ctx.arc(32, 32, 10, -Math.PI / 2, rad);
        ctx.stroke();
    }

    /**
     * 清除画完的圆环
     */
    clean() {
        const ctx = this.ctx;

        this.frame.material.map.needsUpdate = true;
        ctx.clearRect(0, 0, 64, 64);
    }

    scale(n) {
        const ctx = this.ctx;

        this.frame.material.map.needsUpdate = true;

        ctx.lineWidth = 4;
        ctx.strokeStyle = '#fff';

        ctx.clearRect(0, 0, 64, 64);
        ctx.beginPath();
        ctx.arc(32, 32, 10 * n, -Math.PI / 2, Math.PI * 2);
        ctx.stroke();
    }

    fadeStop() {
        const frame = this.frame;

        if (this.tween) {
            this.tween.stop();
            frame.visible = false;
            delete this.tween;
            this.plastic.material.visible = true;
        }
    }

    dispose() {
        super.dispose();
        delete this.plastic['wrapper'];
    }
}