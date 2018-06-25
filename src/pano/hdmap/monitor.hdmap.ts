import {LinearFilter, ClampToEdgeWrapping, Math} from 'three';
import PubSubAble from '../../interface/pubsub.interface';
import Util from '../../core/util';
import HDAnalyse from './analyse.hdmap';
import HDStore from './store.hdmap';

/**
 * @file 高清全景监控器
 *       中心点坐标 -> uv 贴图 -> 资源图 -> canvas 区域块 -> needsUpdate = true
 */

export default class HDMonitor extends PubSubAble {
    pano: any;
    level = 3;

    constructor(pano, opts?) {
        super();

        this.pano = pano;
        this.subscribe(pano.frozen ? this.Topic.SCENE.READY : this.Topic.SCENE.LOAD, this.init.bind(this));
    }

    init() {
        this.subscribe(this.Topic.RENDER.PROCESS, this.update.bind(this));
    }

    update() {
        const pano = this.pano;
        const camera = pano.getCamera();
        const target = pano.skyBox.getPlastic();
        const intersects = Util.intersect({x: 0, y: 0}, [target], camera);

        if (intersects) {
            const point = intersects[0].point;
            const ret = HDAnalyse.analyse(point, this.level);

            ret.forEach(data => {
                const p = HDStore.getHDPicture('../assets/hdmap/' + data.path);
                if (p) {
                    p.then(hdimg => this.draw(hdimg, data));
                }
            });
        }
    }

    /**
     * 根据 uv 坐标在原图上绘制
     * @param {Object} data 绘制信息
     */
    draw(hdimg, data) {
        const texture = this.pano.skyBox.getMap();
        const fw = data.fw;
        const fh = data.fh;

        texture.needsUpdate = true;

        if (!texture.replaceCanvas) {
            texture.replaceCanvas = true;
            texture.generateMipmaps = false;
            texture.wrapS = texture.wrapT = ClampToEdgeWrapping;
            texture.minFilter = LinearFilter;
            texture.image.forEach((img, i) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext("2d");
                canvas.width = fw;
                canvas.height = fh;
                canvas.style.width = fw;
                canvas.style.height = fh;
                ctx.drawImage(img, 0, 0, fw, fh);
                texture.image[i] = canvas;
            });
        }

        const obj = texture.image[data.index];
        const ctx = obj.getContext("2d");

        ctx.beginPath();
        ctx.drawImage(hdimg, data.x, data.y, data.w, data.h);
        this.text(ctx, 'ready', data.x, data.y);
        ctx.closePath();
    }

    text(ctx, str, x, y) {
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = 'normal 300 40px Arial';
        ctx.fillText(str, x + 256, y + 256);
    }

    dispose() {
        super.dispose();
    }
}