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
    anim: any;
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
        const mesh = this.plastic = new Mesh(new CircleGeometry(data.raidus, data.seagment),
            new MeshBasicMaterial({
                color: data.color, 
                depthTest: false, 
                side: DoubleSide,
                transparent: true
            }));
        mesh.renderOrder = data.order;

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

    fade() {
        const frame = this.frame;
        const ctx = this.ctx;

        ctx.lineWidth = 4;
        ctx.strokeStyle = '#fff';

        new Tween({rad: -Math.PI / 2}).to({rad: Math.PI * 2}).effect('linear', 1500)
            .start(['rad'], this.pano).process((old, val) => {
                ctx.clearRect(0, 0, 64, 64);
                ctx.beginPath();
                ctx.arc(32, 32, 10, -Math.PI / 2, val);
                ctx.stroke();
                ctx.closePath();
                frame.material.map.needsUpdate = true;
            });
    }

    fadeStop() {
        this.anim.stop();
    }

}