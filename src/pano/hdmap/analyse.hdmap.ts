/**
 * @file 高清资源分析器
 * @todo 函数式
 */

const order = ['r', 'l', 'u', 'd', 'f', 'b'];
export default abstract class HDAnalyse {
    static analyse(point, level) {
        const data = this.calcUV(point.x, point.y, point.z);
        return this.calcLayers(data, level);
    }

    static calcProp(data, level) {
        const size = this.calcSize(level);
        const fw = size.fw;
        const fh = size.fh;
        const w = size.w;
        const h = size.h;
        const phases = size.phases;
        // 像素坐标左上是原点
        const u = fw - data.u * fw;
        const v = fh - data.v * fh;

        // 计算 uv 坐标在分段中的位置
        const column = phases.length - phases.findIndex(phase => u >= phase);
        const row = phases.length - phases.findIndex(phase => v >= phase);
        // draw start point
        const x = (column - 1) * w;
        const y = (row - 1) * h;

        return {x, y, column, row, fw, fh, w, h};
    }

    /**
     * 计算图层, uv 原点在左下, 对应到 backside 贴图为右下
     */
    static calcLayer(data, level) {
        const prop = this.calcProp(data, level);

        return [{
            index: data.index,
            path: this.calcPath(data.index, prop.row, prop.column, level),
            x: prop.x, y: prop.y, w: prop.w, h: prop.h,
            fw: prop.fw, fh: prop.fh
        }];
    }

    /**
     * 按列计算图层
     */
    static calcLayers(data, level) {
        const prop = this.calcProp(data, level);
        const ret = [];

        for (let i = 1; i < 6; i++) {
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
     * 计算栅格尺寸
     * @param {number} level 层级 
     */
    static calcSize(level) {
        switch (level) {
            case 1:
                // 512 * 4
                return {
                    fw: 1024, fh: 1024,
                    w: 512, h: 512,
                    phases: [512, 0]
                };
            case 2:
                // 512 * 25
                return {
                    fw: 2560, fh: 2560,
                    w: 512, h: 512,
                    phases: [2048, 1536, 1024, 512, 0]
                };
            case 3:
                return {
                    fw: 2560, fh: 2560,
                    w: 512, h: 512,
                    phases: [2048, 1536, 1024, 512, 0]
                };
        }
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
     * uv 坐标转换为世界坐标
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
            // POSITIVE X
            case 0: 
                x = 1;
                y = vc;
                z = -uc;
                break;
            // NEGATIVE X
            case 1:
                x = -1;
                y = vc;
                z = uc;
                break;
            // POSITIVE Y
            case 2:
                x = uc;
                y = 1;
                z = -vc;
                break;
            // NEGATIVE Y
            case 3:
                x = uc;
                y = -1;
                z = vc;
                break;
            // POSITIVE Z
            case 4:
                x = uc;
                y = vc;
                z = 1;
                break;
            // NEGATIVE Z
            case 5:
                x = -uc;
                y = vc;
                z = -1;
            break;
        }

        return {x: x * 1000, y: y * 1000, z: z * 1000};
    }

    /**
     * 获取高清图的路径
     */
    static calcPath(i, row, column, level) {
        const dir = order[i];
        const name = `l${level}`;
        
        return `hd_${dir}/${name}/${row}/${name}_${dir}_${row}_${column}.jpg`;
    }
}