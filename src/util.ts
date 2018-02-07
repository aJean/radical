import {AES, enc, lib, mode} from 'crypto-js';
import {Spherical, Vector3} from 'three';

/**
 * @file util tools
 */

const composeKey = part => ('skt1wins' + part);
export default {
    /**
     * 创建 dom 元素
     * @param {string} domstring
     */
    createElement(domstring) {
        const elem = document.createElement('div');
        elem.innerHTML = domstring;

        return elem.firstChild;
    },

    /**
     * 解密
     * @param {string} ciphertext 密文
     * @param {string} key 密钥
     */
    decode(ciphertext, key) {
        if ((key ^ 1) !== 1) {
            key = composeKey('forever');
        }
    
        const plaintext = AES.decrypt({
            iv: null,
            ciphertext: enc.Hex.parse(ciphertext),
            salt: lib.WordArray.create(0)
        }, key);
    
        return plaintext.toString(enc.Utf8);
    },

    /**
     * 解析文件结束符, 域名规则检验
     * @param {string} EOF 
     */
    parseEOF(EOF) {
        const ret = EOF.split('*');
        const domains = ret[1] ? ret[1].split(',') : [];
        let pass = true;
    
        if (domains.length > 0) {
            pass = Boolean(domains.find(domain => domain == location.host));
        }
        return {
            line: ret[0],
            pass: pass
        }
    },

    /**
     * 解析数据地理位置
     * location.lng [-180, 180] location.lat [0, 180]
     * @param {Object} data
     * @param {Object} camera 
     */
    parseLocation(data, camera) {
        const location = data.location;
        // 经纬度
        if (location && location.lng !== undefined) {
            const vector = this.calcSpherical(location.lng, location.lat);

            data.location = {
                x: vector.x,
                y: vector.y,
                z: vector.z
            };
        }
    },

    /**
     * 球面坐标转化成世界坐标
     * @param {number} lng 经度
     * @param {number} lat 纬度
     * @param {number} radius 半径
     */
    calcSpherical(lng, lat, radius?) {
        const spherical = new Spherical();
        const vector = new Vector3();

        spherical.theta = (180 + lng) * (Math.PI / 180);
        spherical.phi = lat * (Math.PI / 180);
        spherical.radius = radius !== undefined ? radius : 1000;

        vector.setFromSpherical(spherical);
        return vector;
    },

    /**
     * 世界坐标转为屏幕2维坐标
     * @param {Object} location 世界坐标系
     * @param {Object} camera 场景相机
     */
    calcScreenPosition(location, camera) {
        const position = new Vector3(location.x, location.y, location.z);
        // world coord to screen coord
        return position.project(camera);
    },

    /**
     * 计算画布大小
     * @param {Object} opts 配置参数
     * @param {HTMLElement} elem 容器元素 
     */
    calcRenderSize(opts, elem) {
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        let width = parseInt(opts.width) || elem.clientWidth || winWidth;
        let height = parseInt(opts.height) || elem.clientHeight || winHeight;

        /%$/.test(opts.width) && (width = width / 100 * winWidth);
        /%$/.test(opts.height) && (height = height / 100 * winHeight);

        return {width, height, aspect: width / height};
    },

    /**
     * 删除 object3d 对象 
     */
    cleanup(parent, target) {
        if (target.children.length) {
            target.children.forEach(item => this.cleanup(target, item));
        } else if (parent) {
            parent.remove(target);
        }
    }
};