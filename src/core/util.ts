import {AES, enc, lib, mode} from 'crypto-js';
import {Spherical, Vector3, Raycaster} from 'three';

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

        return elem.firstElementChild;
    },

    styleElement(elem, data) {
        for (let prop in data) {
            let val = data[prop];

            if (typeof val === 'number') {
                val = val + 'px';
            }
            
            elem.style[prop] = val;
        }
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
            salt: <any>lib.WordArray.create(0)
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
            const vector = this.calcSphereToWorld(location.lng, location.lat, location.radius);

            data.location = {
                x: vector.x,
                y: vector.y,
                z: vector.z
            };
        }
    },

    /**
     * 球面坐标转化成世界坐标, theta ~ x, phi ~ y
     * @param {number} lng 经度
     * @param {number} lat 纬度
     * @param {number} radius 半径
     */
    calcSphereToWorld(lng, lat, radius?) {
        const spherical = new Spherical();
        const vector = new Vector3();

        spherical.theta = lng * (Math.PI / 180);
        spherical.phi = (90 - lat) * (Math.PI / 180);
        spherical.radius = radius !== undefined ? radius : 1000;

        vector.setFromSpherical(spherical);
        return vector;
    },

    /**
     * 世界坐标转为屏幕坐标
     * @param {Object} location 世界坐标系
     * @param {Object} camera 场景相机
     */
    calcWorldToScreen(location, camera) {
        const vector = new Vector3(location.x, location.y, location.z);
        return vector.project(camera);
    },

    /**
     * 归一化
     * @param {Object} location 屏幕坐标
     * @param {Object} size 渲染器 size
     */
    transNdc(location, size) {
        return {
            x: (location.x / size.width) * 2 - 1,
            y: -(location.y / size.height) * 2 + 1
        };
    },

    /**
     * 逆归一化
     * @param {Object} location 屏幕坐标
     * @param {Object} size 渲染器 size
     */
    inverseNdc(location, size) {
        return {
            x: Math.floor((location.x * size.width + size.width) / 2),
            y: Math.floor((-location.y * size.height + size.height) / 2),
            z: location.z
        };
    },

    /**
     * 球面坐标转化成屏幕坐标, 没什么卵用
     * @param {number} lng 横向
     * @param {number} lat 纵向
     * @param {number} radius 半径
     * @param {Object} camera 相机
     * @param {Object} size 屏幕尺寸
     */
    caleSphereToScreen(lng, lat, radius, camera, size) {
        return this.inverseNdc(this.calcWorldToScreen(this.calcSphereToWorld(lng, lat, radius), camera), size);
    },

    /**
     * 屏幕坐标转为球面坐标
     * ndc first
     */
    calcScreenToSphere(location, camera, far?) {
        const projectCamera = camera.clone();
        projectCamera.far = far || 1000;
        projectCamera.updateProjectionMatrix();

        const vector = new Vector3(location.x, location.y, 1).unproject(projectCamera);
        const spherical = new Spherical();
        spherical.setFromVector3(vector);

        return {
            lng: spherical.theta * 180 / Math.PI,
            lat: 90 - spherical.phi * 180 / Math.PI
        };
    },

    /**
     * 屏幕坐标转为世界坐标
     * ndc first
     */
    calcScreenToWorld(location, camera, far?) {
        const projectCamera = camera.clone();
        projectCamera.far = far || 1000;
        projectCamera.updateProjectionMatrix();

        return new Vector3(location.x, location.y, 1).unproject(projectCamera);
    },

    /**
     * 计算画布大小
     * @param {HTMLElement} elem 容器元素
     * @param {Object} opts 配置参数
     */
    calcRenderSize(elem, opts?) {
        const winWidth = window.innerWidth;
        const winHeight = document.documentElement.clientHeight;

        let width = winWidth;
        let height = winHeight;

        if (opts && opts.width) {
            width = /%$/.test(opts.width) ? (parseInt(opts.width) / 100 * winWidth) : parseInt(opts.width);
        }

        if (opts && opts.height) {
            height = /%$/.test(opts.height) ? (parseInt(opts.height) / 100 * winHeight) : parseInt(opts.height);
        }

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
    },

    /**
     * 查找渲染 scene 对象
     * @param source
     */
    findScene(source, tid?) {
        const group = source.sceneGroup;
        const id = tid !== void 0 ? tid : source.defaultSceneId;
        const scene = group.find(item => item.id == id);

        return (scene || group[0]);
    },
    
    /**
     * 扩展对象允许覆盖
     */
    assign(obj, ...args) {
        if (!args.length || obj == null) {
            return obj;
        }

        args.forEach(source => {
            for (let key in source) {
                if (source[key] !== void 0) {
                    obj[key] = source[key];
                }
            }
        });

        return obj;
    },

    /**
     * 检测点击穿透
     */
    intersect(pos, group, camera) {
        const raycaster = new Raycaster();
        raycaster.setFromCamera(pos, camera);
        const intersects = raycaster.intersectObjects(group);

        return intersects.length ? intersects : null;
    },

    testWebgl() {
		try {
			var canvas = document.createElement('canvas');
			return !!( window['WebGLRenderingContext'] && (
				canvas.getContext('webgl') ||
				canvas.getContext('experimental-webgl'))
			);
		} catch ( e ) {
			return false;
		}
	}
};