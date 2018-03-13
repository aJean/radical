"use strict";
exports.__esModule = true;
var crypto_js_1 = require("crypto-js");
var three_1 = require("three");
/**
 * @file util tools
 */
var composeKey = function (part) { return ('skt1wins' + part); };
exports["default"] = {
    /**
     * 创建 dom 元素
     * @param {string} domstring
     */
    createElement: function (domstring) {
        var elem = document.createElement('div');
        elem.innerHTML = domstring;
        return elem.firstElementChild;
    },
    styleElement: function (elem, data) {
        for (var prop in data) {
            var val = data[prop];
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
    decode: function (ciphertext, key) {
        if ((key ^ 1) !== 1) {
            key = composeKey('forever');
        }
        var plaintext = crypto_js_1.AES.decrypt({
            iv: null,
            ciphertext: crypto_js_1.enc.Hex.parse(ciphertext),
            salt: crypto_js_1.lib.WordArray.create(0)
        }, key);
        return plaintext.toString(crypto_js_1.enc.Utf8);
    },
    /**
     * 解析文件结束符, 域名规则检验
     * @param {string} EOF
     */
    parseEOF: function (EOF) {
        var ret = EOF.split('*');
        var domains = ret[1] ? ret[1].split(',') : [];
        var pass = true;
        if (domains.length > 0) {
            pass = Boolean(domains.find(function (domain) { return domain == location.host; }));
        }
        return {
            line: ret[0],
            pass: pass
        };
    },
    /**
     * 解析数据地理位置
     * location.lng [-180, 180] location.lat [0, 180]
     * @param {Object} data
     * @param {Object} camera
     */
    parseLocation: function (data, camera) {
        var location = data.location;
        // 经纬度
        if (location && location.lng !== undefined) {
            var vector = this.calcSphereToWorld(location.lng, location.lat);
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
    calcSphereToWorld: function (lng, lat, radius) {
        var spherical = new three_1.Spherical();
        var vector = new three_1.Vector3();
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
    calcWorldToScreen: function (location, camera) {
        var vector = new three_1.Vector3(location.x, location.y, location.z);
        return vector.project(camera);
    },
    /**
     * 屏幕坐标转为球面坐标
     */
    calcScreenToSphere: function (location, camera) {
        var vector = new three_1.Vector3(location.x, location.y, 0.99).unproject(camera);
        var spherical = new three_1.Spherical();
        spherical.setFromVector3(vector);
        return {
            lng: spherical.theta * 180 / Math.PI,
            lat: 90 - spherical.phi * 180 / Math.PI
        };
    },
    /**
     * 计算画布大小
     * @param {Object} opts 配置参数
     * @param {HTMLElement} elem 容器元素
     */
    calcRenderSize: function (opts, elem) {
        var winWidth = window.innerWidth;
        var winHeight = window.innerHeight;
        var width = parseInt(opts.width) || elem.parentNode.clientWidth || winWidth;
        var height = parseInt(opts.height) || elem.parentNode.clientHeight || winHeight;
        /%$/.test(opts.width) && (width = width / 100 * winWidth);
        /%$/.test(opts.height) && (height = height / 100 * winHeight);
        return { width: width, height: height, aspect: width / height };
    },
    /**
     * 删除 object3d 对象
     */
    cleanup: function (parent, target) {
        var _this = this;
        if (target.children.length) {
            target.children.forEach(function (item) { return _this.cleanup(target, item); });
        }
        else if (parent) {
            parent.remove(target);
        }
    },
    /**
     * 查找渲染 scene 对象
     * @param source
     */
    findScene: function (source, tid) {
        var group = source.sceneGroup;
        var id = tid !== void 0 ? tid : source.defaultSceneId;
        var scene = group.find(function (item) { return item.id == id; });
        return (scene || group[0]);
    }
};
