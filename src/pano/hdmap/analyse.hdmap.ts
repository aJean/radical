/**
 * @file 高清资源分析器
 * @todo 函数式
 */

const order = ['r', 'l', 'u', 'd', 'f', 'b'];
export default abstract class HDAnalyse {
    static analyse(point, level, texture) {
        const data = this.calcuv(point.x, point.y, point.z);
        const img = texture.image[data.index];

        return this.calclayer(data, img, level);
    }

    /**
     * 计算图层
     */
    static calclayer(data, img, level) {
        const width = img.width;
        const height = img.height;
        const u = data.u * width;
        const v = height - data.v * height;
        const w = width / 2;
        const h = height / 2;
        let row = 1;
        let column = 1;
        let x = 0;
        let y = 0;

        if (u > w) {
            column = 2;
            x = w;
        } 
         
        if (v > h) {
            row = 2;
            y = h;
        }

        return {
            path: this.getName(data.index, row, column),
            x, y, w, h
        };
    }

    /**
     * 计算世界坐标到 uv 坐标
     */
    static calcuv(x, y, z) {
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

    static getName(i, row, column) {
        const dir = order[i];
        return `hd_${dir}/l1/${row}/l1_${dir}_${row}_${column}.jpg`;
    }
}