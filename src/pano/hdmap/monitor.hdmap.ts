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
    level = 2;

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

        if (intersects && camera.fov < 70) {
            const point = intersects[0].point;
            const data = HDAnalyse.analyse(point, this.level, pano.skyBox.getMap());
            const img = HDStore.getHDPicture('../assets/hdmap/' + data.path);
            console.log(img)
        }
    }

    /**
     * 根据 uv 坐标在原图上绘制
     * @param data 
     */
    draw(data) {
        const plastic = this.pano.skyBox.getPlastic();
        const texture = plastic.material.envMap;
        const img = texture.image[data.index];
        const width = img.width;
        const height = img.height;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#1c86d1';
        ctx.arc(data.u * width, height - data.v * height, 100, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();

        texture.needsUpdate = true;
        texture.image[data.index] = canvas;
    }

    
}