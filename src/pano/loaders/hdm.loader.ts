import PubSubAble from '../../interface/pubsub.interface';
import Util from '../../core/util';

/**
 * @file 高清全景加载器
 *       中心点坐标 -> uv 贴图 -> 资源图 -> canvas 区域块 -> needsUpdate = true
 */

export default class HDMLoader extends PubSubAble {
    pano: any;
    records = {};

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
        const target = pano.skyBox.getPlastic();
        const intersects = Util.intersect({x: 0, y: 0}, [target], pano.getCamera());

        if (intersects) {
            const point = intersects[0].point;
            this.addToRecords(point);
        }
        
    }

    addToRecords(point) {
        const records = this.records;
        const data = this.calcuv(point.x, point.y, point.z);
        const index = data.index;
        
        // console.log(data)
        if (!records[index]) {
            records[index] = data;
            this.draw(data);
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

    /**
     * 计算世界坐标到 uv 坐标
     */
    calcuv(x, y, z) {
        const absX = Math.abs(x);
        const absY = Math.abs(y);
        const absZ = Math.abs(z);
  
        const isXPositive = x > 0 ? 1 : 0;
        const isYPositive = y > 0 ? 1 : 0;
        const isZPositive = z > 0 ? 1 : 0;
  
        let maxAxis;
        let uc;
        let vc;
        let index;

        // -x right
        if (!isXPositive && absX >= absY && absX >= absZ) {
            // u (0 to 1) goes from -z to +z
            // v (0 to 1) goes from -y to +y
            maxAxis = absX;
            uc = z;
            vc = y;
            index = 0;
        }
  
        // +x left
        if (isXPositive && absX >= absY && absX >= absZ) {
            // u (0 to 1) goes from +z to -z
            // v (0 to 1) goes from -y to +y
            maxAxis = absX;
            uc = -z;
            vc = y;
            index = 1;
        }

        // +y up
        if (isYPositive && absY >= absX && absY >= absZ) {
            // u (0 to 1) goes from -x to +x
            // v (0 to 1) goes from +z to -z
            maxAxis = absY;
            uc = x;
            vc = -z;
            index = 2;
        }

        // -y down
        if (!isYPositive && absY >= absX && absY >= absZ) {
            // u (0 to 1) goes from -x to +x
            // v (0 to 1) goes from -z to +z
            maxAxis = absY;
            uc = x;
            vc = z;
            index = 3;
        }

        // +z front
        if (isZPositive && absZ >= absX && absZ >= absY) {
            // u (0 to 1) goes from -x to +x
            // v (0 to 1) goes from -y to +y
            maxAxis = absZ;
            uc = x;
            vc = y;
            index = 4;
        }

        // -z back
        if (!isZPositive && absZ >= absX && absZ >= absY) {
            // u (0 to 1) goes from +x to -x
            // v (0 to 1) goes from -y to +y
            maxAxis = absZ;
            uc = -x;
            vc = y;
            index = 5;
        }

        // Convert range from -1 to 1 to 0 to 1
        const u = (0.5 * (uc / maxAxis + 1)).toFixed(3);
        const v = (0.5 * (vc / maxAxis + 1)).toFixed(3);

        return {u, v, index};
    }
}