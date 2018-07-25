/**
 * @file 高清资源分析器
 */

const order = ['r', 'l', 'u', 'd', 'f', 'b'];
export default abstract class HDAnalyse {
    static analyse(point, level) {
        const data = this.calcUV(point.x, point.y, point.z);

        switch (Number(level)) {
            case 1:
                return this.calcLayersByPlane(data, level);
            case 2:
                return this.calcLayersByColumn(data, level);
            case 3:
                return this.calcLayerByPoint(data, level);
        }
    }

    /**
     * 按点计算图层
     */
    static calcLayerByPoint(data, level) {
        const prop = this.calcProp(data, level);
        const path = this.calcPath(data.index, prop.row, prop.column, level);
        const ret = [{
            index: data.index, path,
            x: prop.x, y: prop.y, w: prop.w, h: prop.h,
            fw: prop.fw, fh: prop.fh
        }];

        return {ret, key: path};
    }

    /**
     * 按列计算图层
     */
    static calcLayersByColumn(data, level) {
        const prop = this.calcProp(data, level);
        const limit = prop.phases.length;
        const ret = [];

        for (let i = 1; i <= limit; i++) {
            prop.row = i;
            prop.y = (i - 1) * prop.h;

            ret.push({
                index: data.index,
                path: this.calcPath(data.index, prop.row, prop.column, level),
                x: prop.x, y: prop.y, w: prop.w, h: prop.h,
                fw: prop.fw, fh: prop.fh
            });
        }

        return {ret, key: this.calcPath(data.index, prop.row, prop.column, level)};
    }

    /**
     * 按面计算图层
     */
    static calcLayersByPlane(data, level) {
        const prop = this.calcProp(data, level);
        const ret = [];

        for (let i = 1; i <= 2; i++) {
            const row = i;
            const y =  prop.h * (i - 1);

            ret.push({
                index: data.index,
                path: this.calcPath(data.index, row, 1, level),
                x: 0, y, w: prop.w, h: prop.h,
                fw: prop.fw, fh: prop.fh
            });

            ret.push({
                index: data.index,
                path: this.calcPath(data.index, row, 2, level),
                x: prop.w, y, w: prop.w, h: prop.h,
                fw: prop.fw, fh: prop.fh
            });
        }

        return {ret, key: this.calcPath(data.index, 0, 0, level)};
    }

    /**
     * 贴图参数
     * @param {number} level 层级 
     */
    static calcSize(level) {
        switch (level) {
            case 1:
                // 800 * 4
                return {
                    fw: 1600, fh: 1600,
                    w: 800, h: 800,
                    phases: [800, 0]
                };
            case 2:
                // 400 * 16
                return {
                    fw: 1600, fh: 1600,
                    w: 400, h: 400,
                    phases: [1200, 800, 400, 0]
                };
        }
    }

    /**
     * 中心点瓦片参数
     * uv 原点在左下, 对应到 backside 贴图为右下, 转为像素坐标原点在左上
     * @param {Object} data
     * @param {number} level 视觉层级
     */
    static calcProp(data, level) {
        const size = this.calcSize(level);
        const fw = size.fw;
        const fh = size.fh;
        const w = size.w;
        const h = size.h;
        const phases = size.phases;
        // pixel 坐标左上是原点
        const pu = fw - data.u * fw;
        const pv = fh - data.v * fh;

        // 计算 pixel 坐标在分段中的位置
        const column = phases.length - phases.findIndex(phase => pu >= phase);
        const row = phases.length - phases.findIndex(phase => pv >= phase);
        // draw start point
        const x = (column - 1) * w;
        const y = (row - 1) * h;

        return {x, y, column, row, fw, fh, w, h, phases};
    }

    /**
     * 计算世界坐标到 uv 坐标
     */
    static calcUV(x, y, z) {
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
        const u = 0.5 * (uc / maxAxis + 1);
        const v = 0.5 * (vc / maxAxis + 1);

        return {u, v, index};
    }

    /**
     * uv 坐标转换为世界坐标, uv 原点 backside 贴图为右下
     * !!! 注意左右交换
     * @param {number} index 图片编号
     * @param {number} u 
     * @param {number} v 
     */
    static calcWorld(index, u, v) {
        // convert range 0 to 1 to -1 to 1
        const uc = 2 * u - 1;
        const vc = 2 * v - 1;
        let x;
        let y;
        let z;

        switch (index) {
            // right
            case 0: 
                x = -1;
                y = vc;
                z = uc;
                break;
            // left
            case 1:
                x = 1;
                y = vc;
                z = -uc;
                break;
            // up
            case 2:
                x = uc;
                y = 1;
                z = -vc;
                break;
            // down
            case 3:
                x = uc;
                y = -1;
                z = vc;
                break;
            // front
            case 4:
                x = uc;
                y = vc;
                z = 1;
                break;
            // back
            case 5:
                x = -uc;
                y = vc;
                z = -1;
            break;
        }

        return {x, y, z};
    }

    /**
     * 获取高清图的路径
     * 0_0 表示 plane
     */
    static calcPath(i, row, column, level) {
        const dir = order[i];
        const name = `l${level}`;
        
        return `hd_${dir}/${name}/${row}/${name}_${dir}_${row}_${column}.jpg`;
    }
}