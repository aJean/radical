/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
    timeline: 'forever',
    errorLog: function (msg) {
        console.error(msg);
    }
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return isMobile; });
/* harmony export (immutable) */ __webpack_exports__["a"] = decode;
/* harmony export (immutable) */ __webpack_exports__["c"] = parseEOF;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__log__ = __webpack_require__(0);

/**
 * @file util
 */
function composeKey(part) {
    return 'skt1wins' + part;
}
var isMobile = function () {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
        check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}();
function decode(ciphertext, key) {
    if (key ^ 1 !== 1) {
        key = composeKey(__WEBPACK_IMPORTED_MODULE_0__log__["a" /* default */].timeline);
    }
    var plaintext = CryptoJS.AES.decrypt({
        ciphertext: CryptoJS.enc.Hex.parse(ciphertext),
        salt: CryptoJS.lib.WordArray.create(0)
    }, key);
    return plaintext.toString(CryptoJS.enc.Utf8);
}
function parseEOF(EOF) {
    var ret = EOF.split('*');
    var domains = ret[1].split(',');
    var pass = true;
    if (domains.length > 0) {
        pass = Boolean(domains.find(function (domain) { return domain == location.host; }));
    }
    return {
        line: ret[0],
        pass: pass
    };
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_client_assets_lib_panoram_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_client_assets_lib_runtime_js__ = __webpack_require__(7);



const panoram = new __WEBPACK_IMPORTED_MODULE_0__app_client_assets_lib_panoram_js__["a" /* default */]({el: '#test'});

panoram.subscribe('animationEnd', animate => {
    console.log(animate);
});
// 覆盖物点击事件
panoram.subscribe('overlayClick', data => {
    if (data.actionType == 'custom') {
        const elem = document.createElement('div');
        elem.innerHTML = 'popup window';
        elem.style.position = 'absolute';
        elem.style.padding = '10px';
        elem.style.color = '#fff';
        elem.style.border = '2px solid #bfc';
        elem.style.background = 'rgba(0, 0, 0, .5)';
        elem.style.left = data.x + 20 + 'px';
        elem.style.top = data.y + 20 + 'px';

        panoram.getRoot().appendChild(elem);
    }
});

// start
__WEBPACK_IMPORTED_MODULE_1__app_client_assets_lib_runtime_js__["a" /* default */].run(panoram, './source.json');

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controls_orbitControl__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__controls_deviceControl__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__event__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util__ = __webpack_require__(1);




/**
 * @file 全景渲染
 */
var defaultOpts = {
    fov: 55,
    fog: null
};
var Panoram = /** @class */ (function () {
    function Panoram(opts) {
        this.source = null;
        this.opts = null;
        this.root = null;
        this.webgl = null;
        this.scene = null;
        this.camera = null;
        this.skyBox = null;
        this.orbitControl = null;
        this.deviceControl = null;
        this.event = new __WEBPACK_IMPORTED_MODULE_2__event__["a" /* default */]();
        this.loader = new THREE.CubeTextureLoader();
        this.group = [];
        this.pluginList = [];
        this.animateList = [];
        this.opts = Object.assign({}, defaultOpts, opts);
        this.initEnv();
        this.initControl();
    }
    Panoram.prototype.initEnv = function () {
        var opts = this.opts;
        var root = this.root = document.querySelector(opts.el);
        var width = opts.width || root.clientWidth || window.innerWidth;
        var height = opts.height || root.clientHeight || window.innerHeight;
        // 渲染器
        var webgl = this.webgl = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        webgl.autoClear = true;
        webgl.setPixelRatio(window.devicePixelRatio);
        webgl.setSize(width, height);
        // 容器 element
        root.style.cssText = 'position:relative;display:block;';
        root.appendChild(webgl.domElement);
        // 场景, 相机
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(opts.fov, width / height, 0.1, 10000);
        // fog ?
    };
    Panoram.prototype.initControl = function () {
        var control = this.orbitControl = new __WEBPACK_IMPORTED_MODULE_0__controls_orbitControl__["a" /* default */](this.camera, this.webgl.domElement);
        control.enableZoom = true;
        control.enablePan = false;
        control.rotateSpeed = -0.2;
        control.target = new THREE.Vector3(0, 0, 1);
        control.target0 = new THREE.Vector3(0, 0, 1);
        this.setLook();
        if (__WEBPACK_IMPORTED_MODULE_3__util__["b" /* isMobile */]) {
            this.deviceControl = new __WEBPACK_IMPORTED_MODULE_1__controls_deviceControl__["a" /* default */](this.camera, control);
        }
    };
    /**
     * 渲染预览图纹理
     * @param {Object} texture 纹理贴图
     */
    Panoram.prototype.initMesh = function (texture) {
        var material = new THREE.MeshBasicMaterial({
            envMap: texture,
            side: THREE.BackSide,
            refractionRatio: 0,
            reflectivity: 1
        });
        var geometry = new THREE.SphereGeometry(2000, 32, 16);
        var skyBox = this.skyBox = new THREE.Mesh(geometry, material);
        this.scene.add(skyBox);
        this.dispatch('previewAttach');
    };
    /**
     * 初始化资源配置
     * @param {Object} source 配置对象
     */
    Panoram.prototype.initSource = function (source) {
        var group = this.group = source.sceneGroup;
        var scene = group.find(function (item) { return item.id == source.defaultSceneId; });
        this.currentScene = scene;
        return scene;
    };
    Panoram.prototype.updateControl = function () {
        if (this.deviceControl && this.deviceControl.enabled) {
            this.deviceControl.update();
        }
        else {
            this.orbitControl.update();
        }
        // labelControl ?
    };
    Panoram.prototype.setLook = function (valueH, valueV) {
        valueH = valueH ? valueH / 180 * Math.PI : Math.PI;
        valueV = valueV ? valueV / 180 * Math.PI : Math.PI / 2;
        this.orbitControl.setSphericalAngle(valueH, valueV);
        this.orbitControl.reset();
    };
    Panoram.prototype.subscribe = function (type, fn, context) {
        this.event.on(type, fn, context);
    };
    Panoram.prototype.unsubscribe = function (type, fn, context) {
        this.event.removeListener(type, fn, context);
    };
    Panoram.prototype.dispatch = function (type, args) {
        this.event.emit(type, args);
    };
    /**
     * 安装动画
     * @param {Object} Animaiton
     */
    Panoram.prototype.addAnimation = function (Animaiton) {
        var animate = new Animaiton(this);
        this.animateList.push(animate);
    };
    /**
     * 安装插件并注入属性
     * @param {Object} Plugin 插件 class
     * @param {Object} data 插件数据
     */
    Panoram.prototype.addPlugin = function (Plugin, data) {
        var plugin = new Plugin(this, data);
        this.pluginList.push(plugin);
    };
    Panoram.prototype.render = function (first) {
        this.webgl.render(this.scene, this.camera);
    };
    /**
     * 渲染场景贴图
     * @param {Object} texture 场景原图纹理
     */
    Panoram.prototype.replaceTexture = function (texture) {
        texture.mapping = THREE.CubeRefractionMapping;
        texture.needsUpdate = true;
        var tempTex = this.skyBox.material.envMap;
        this.skyBox.material.envMap = texture;
        tempTex.dispose();
        // 触发场景添加事件
        this.dispatch('sceneAttach', this.currentScene);
    };
    Panoram.prototype.animate = function () {
        this.updateControl();
        this.dispatch('renderProcess', this.currentScene);
        this.render();
        requestAnimationFrame(this.animate.bind(this));
    };
    Panoram.prototype.resize = function () {
        var opts = this.opts;
        var root = this.root;
        var camera = this.camera;
        var width = opts.width || root.clientWidth || window.innerWidth;
        var height = opts.height || root.clientHeight || window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        this.webgl.setSize(width, height);
    };
    Panoram.prototype.getCamera = function () {
        return this.camera;
    };
    Panoram.prototype.getCanvas = function () {
        return this.webgl.domElement;
    };
    Panoram.prototype.getRoot = function () {
        return this.root;
    };
    Panoram.prototype.getScene = function () {
        return this.scene;
    };
    Panoram.prototype.addObject = function (obj) {
        this.scene.add(obj);
    };
    /**
     * 进入下一个场景
     * @param {string} id 场景的标识
     */
    Panoram.prototype.enterNext = function (id) {
        var group = this.group;
    };
    return Panoram;
}());
/* harmony default export */ __webpack_exports__["a"] = (Panoram);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @file 全景相机控制器
 */
function OrbitControl(object, domElement) {
    this.object = object;
    this.domElement = (domElement !== undefined) ? domElement : document;
    /* Set to false to disable this control*/
    this.enabled = true;
    /*"target" sets the location of focus, where the object orbits around*/
    this.target = new THREE.Vector3();
    /* How far you can dolly in and out ( PerspectiveCamera only )*/
    this.minDistance = 0;
    this.maxDistance = Infinity;
    this.minFov = 30;
    this.maxFov = 120;
    /* How far you can zoom in and out ( OrthographicCamera only )*/
    this.minZoom = 0;
    this.maxZoom = Infinity;
    /* How far you can orbit vertically, upper and lower limits.*/
    /* Range is 0 to Math.PI radians.*/
    this.minPolarAngle = 0;
    this.maxPolarAngle = Math.PI;
    /* How far you can orbit horizontally, upper and lower limits.*/
    /* If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].*/
    this.minAzimuthAngle = -Infinity;
    this.maxAzimuthAngle = Infinity;
    /* Set to true to enable damping (inertia)*/
    /* If damping is enabled, you must call controls.update() in your animation loop*/
    this.enableDamping = false;
    this.dampingFactor = 0.25;
    /* This option actually enables dollying in and out; left as "zoom" for backwards compatibility.*/
    /* Set to false to disable zooming*/
    this.enableZoom = true;
    this.zoomSpeed = 1.0;
    /* Set to false to disable rotating*/
    this.enableRotate = true;
    this.rotateSpeed = -1.0;
    /* Set to false to disable panning*/
    this.enablePan = true;
    this.keyPanSpeed = 7.0;
    /* pixels moved per arrow key push*/
    /* Set to true to automatically rotate around the target*/
    /* If auto-rotate is enabled, you must call controls.update() in your animation loop*/
    this.autoRotate = false;
    this.autoRotateSpeed = 2.0;
    /* 30 seconds per round when fps is 60*/
    /* Set to false to disable use of the keys*/
    this.enableKeys = true;
    /* The four arrow keys*/
    this.keys = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        BOTTOM: 40
    };
    /* Mouse buttons*/
    this.mouseButtons = {
        ORBIT: THREE.MOUSE.LEFT,
        ZOOM: THREE.MOUSE.MIDDLE,
        PAN: THREE.MOUSE.RIGHT
    };
    /* for reset*/
    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.zoom0 = this.object.zoom;
    /*
     * internals
     */
    /* current position in spherical coordinates*/
    var spherical = new THREE.Spherical();
    // var sphericalDelta = new THREE.Spherical(1,Math.PI/2, Math.PI );
    var sphericalDelta = new THREE.Spherical();
    var scope = this;
    var changeEvent = {
        type: 'change'
    };
    var startEvent = {
        type: 'start'
    };
    var endEvent = {
        type: 'end'
    };
    var STATE = {
        NONE: -1,
        ROTATE: 0,
        DOLLY: 1,
        PAN: 2,
        TOUCH_ROTATE: 3,
        TOUCH_DOLLY: 4,
        TOUCH_PAN: 5,
        SLIDER: 6
    };
    var state = STATE.NONE;
    var EPS = 0.000001;
    var scale = 1;
    var panOffset = new THREE.Vector3();
    var zoomChanged = false;
    var rotateStart = new THREE.Vector2();
    var rotateEnd = new THREE.Vector2();
    var rotateDelta = new THREE.Vector2();
    var panStart = new THREE.Vector2();
    var panEnd = new THREE.Vector2();
    var panDelta = new THREE.Vector2();
    var dollyStart = new THREE.Vector2();
    var dollyEnd = new THREE.Vector2();
    var dollyDelta = new THREE.Vector2();
    /*
     * public methods
     */
    this.getPolarAngle = function () {
        return spherical.phi;
    };
    this.getAzimuthalAngle = function () {
        return spherical.theta;
    };
    this.setSphericalAngle = function (valueH, valueV) {
        spherical.phi = valueV;
        spherical.theta = valueH;
    };
    this.saveState = function () {
        scope.target0.copy(scope.target);
        scope.position0.copy(scope.object.position);
        scope.zoom0 = scope.object.zoom;
    };
    this.reset = function () {
        scope.target.copy(scope.target0);
        scope.object.position.copy(scope.position0);
        scope.object.zoom = scope.zoom0;
        scope.object.updateProjectionMatrix();
        scope.dispatchEvent(changeEvent);
        scope.update();
        state = STATE.NONE;
    };
    /* this method is exposed, but perhaps it would be better if we can make it private...*/
    this.update = (function () {
        var offset = new THREE.Vector3();
        /*so camera.up is the orbit axis*/
        var quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
        var quatInverse = quat.clone().inverse();
        var lastPosition = new THREE.Vector3();
        var lastQuaternion = new THREE.Quaternion();
        return function update(sphericalNew) {
            var position = scope.object.position;
            offset.copy(position).sub(scope.target);
            /* rotate offset to "y-axis-is-up" space*/
            offset.applyQuaternion(quat);
            /* angle from z-axis around y-axis*/
            spherical.setFromVector3(offset);
            if (scope.autoRotate && state === STATE.NONE) {
                rotateLeft(getAutoRotationAngle());
            }
            else if (state === STATE.SLIDER) {
                if (rotateDelta.length() > 0.35) {
                    /* rotating across whole screen goes 360 degrees around*/
                    var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
                    rotateDelta.setLength(rotateDelta.length() * 0.90);
                    rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);
                    /* rotating up and down along whole screen attempts to go 360, but limited to 180*/
                    /*constraint.rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * selfClass.rotateSpeed);*/
                }
                else {
                    state = STATE.NONE;
                }
            }
            if (sphericalNew) {
                spherical.theta += sphericalNew.theta;
                spherical.phi += sphericalNew.phi;
            }
            spherical.theta += sphericalDelta.theta;
            spherical.phi += sphericalDelta.phi;
            /* restrict theta to be between desired limits*/
            spherical.theta = Math.max(scope.minAzimuthAngle, Math.min(scope.maxAzimuthAngle, spherical.theta));
            /* restrict phi to be between desired limits*/
            spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));
            spherical.makeSafe();
            if (scale !== 1) {
                scope.object.fov *= scale;
                if (scope.object.fov > scope.maxFov) {
                    scope.object.fov = scope.maxFov;
                }
                else if (scope.object.fov < scope.minFov) {
                    scope.object.fov = scope.minFov;
                }
                scope.object.updateProjectionMatrix();
            }
            /* move target to panned location*/
            scope.target.add(panOffset);
            offset.setFromSpherical(spherical);
            /* rotate offset back to "camera-up-vector-is-up" space*/
            offset.applyQuaternion(quatInverse);
            position.copy(scope.target).add(offset);
            scope.object.lookAt(scope.target);
            if (scope.enableDamping === true) {
                sphericalDelta.theta *= (1 - scope.dampingFactor);
                sphericalDelta.phi *= (1 - scope.dampingFactor);
            }
            else {
                sphericalDelta.set(0, 0, 0);
            }
            scale = 1;
            panOffset.set(0, 0, 0);
            /*update condition is:
             * min(camera displacement, camera rotation in radians)^2 > EPS
             * using small-angle approximation cos(x/2) = 1 - x^2 / 8
             * */
            if (zoomChanged
                || lastPosition.distanceToSquared(scope.object.position) > EPS
                || 8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
                scope.dispatchEvent(changeEvent);
                lastPosition.copy(scope.object.position);
                lastQuaternion.copy(scope.object.quaternion);
                zoomChanged = false;
                return true;
            }
            return false;
        };
    }());
    this.dispose = function () {
        scope.domElement.removeEventListener('contextmenu', onContextMenu, false);
        scope.domElement.removeEventListener('mousedown', onMouseDown, false);
        scope.domElement.removeEventListener('wheel', onMouseWheel, false);
        scope.domElement.removeEventListener('touchstart', onTouchStart, false);
        scope.domElement.removeEventListener('touchend', onTouchEnd, false);
        scope.domElement.removeEventListener('touchmove', onTouchMove, false);
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);
        window.removeEventListener('keydown', onKeyDown, false);
    };
    function getAutoRotationAngle() {
        return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
    }
    function getZoomScale() {
        return Math.pow(0.95, scope.zoomSpeed);
    }
    this.rotateLeft = function (angle) {
        rotateLeft(angle);
    };
    this.rotateUp = function (angle) {
        rotateUp(angle);
    };
    function rotateLeft(angle) {
        sphericalDelta.theta -= angle;
    }
    function rotateUp(angle) {
        sphericalDelta.phi -= angle;
    }
    var panLeft = (function () {
        var v = new THREE.Vector3();
        return function panLeft(distance, objectMatrix) {
            v.setFromMatrixColumn(objectMatrix, 0);
            /* get X column of objectMatrix*/
            v.multiplyScalar(-distance);
            panOffset.add(v);
        };
    }());
    var panUp = (function () {
        var v = new THREE.Vector3();
        return function panUp(distance, objectMatrix) {
            v.setFromMatrixColumn(objectMatrix, 1);
            /*get Y column of objectMatrix*/
            v.multiplyScalar(distance);
            panOffset.add(v);
        };
    }());
    /* deltaX and deltaY are in pixels; right and down are positive*/
    var pan = (function () {
        var offset = new THREE.Vector3();
        return function pan(deltaX, deltaY) {
            var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
            if (scope.object instanceof THREE.PerspectiveCamera) {
                /* perspective*/
                var position = scope.object.position;
                offset.copy(position).sub(scope.target);
                var targetDistance = offset.length();
                /* half of the fov is center to top of screen*/
                targetDistance *= Math.tan((scope.object.fov / 2) * Math.PI / 180.0);
                /* we actually don't use screenWidth, since perspective camera is fixed to screen height*/
                panLeft(2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix);
                panUp(2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix);
            }
            else if (scope.object instanceof THREE.OrthographicCamera) {
                /* orthographic*/
                panLeft(deltaX * (scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth, scope.object.matrix);
                panUp(deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight, scope.object.matrix);
            }
            else {
                /* camera neither orthographic nor perspective*/
                console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
                scope.enablePan = false;
            }
        };
    }());
    function dollyIn(dollyScale) {
        if (scope.object instanceof THREE.PerspectiveCamera) {
            scale /= dollyScale;
        }
        else if (scope.object instanceof THREE.OrthographicCamera) {
            scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom * dollyScale));
            scope.object.updateProjectionMatrix();
            zoomChanged = true;
        }
        else {
            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            scope.enableZoom = false;
        }
    }
    function dollyOut(dollyScale) {
        if (scope.object instanceof THREE.PerspectiveCamera) {
            scale *= dollyScale;
        }
        else if (scope.object instanceof THREE.OrthographicCamera) {
            scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / dollyScale));
            scope.object.updateProjectionMatrix();
            zoomChanged = true;
        }
        else {
            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            scope.enableZoom = false;
        }
    }
    /*
     * event callbacks - update the object state
     */
    function handleMouseDownRotate(event) {
        rotateStart.set(event.clientX, event.clientY);
    }
    function handleMouseDownDolly(event) {
        dollyStart.set(event.clientX, event.clientY);
    }
    function handleMouseDownPan(event) {
        panStart.set(event.clientX, event.clientY);
    }
    function handleMouseMoveRotate(event) {
        rotateEnd.set(event.clientX, event.clientY);
        rotateDelta.subVectors(rotateEnd, rotateStart);
        var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
        /* rotating across whole screen goes 360 degrees around*/
        rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);
        /* rotating up and down along whole screen attempts to go 360, but limited to 180*/
        rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);
        rotateStart.copy(rotateEnd);
        scope.update();
    }
    function handleMouseMoveDolly(event) {
        dollyEnd.set(event.clientX, event.clientY);
        dollyDelta.subVectors(dollyEnd, dollyStart);
        if (dollyDelta.y > 0) {
            dollyIn(getZoomScale());
        }
        else if (dollyDelta.y < 0) {
            dollyOut(getZoomScale());
        }
        dollyStart.copy(dollyEnd);
        scope.update();
    }
    function handleMouseMovePan(event) {
        panEnd.set(event.clientX, event.clientY);
        panDelta.subVectors(panEnd, panStart);
        pan(panDelta.x, panDelta.y);
        panStart.copy(panEnd);
        scope.update();
    }
    function handleMouseUp(event) { }
    function handleMouseWheel(event) {
        if (event.deltaY < 0) {
            dollyOut(getZoomScale());
        }
        else if (event.deltaY > 0) {
            dollyIn(getZoomScale());
        }
        scope.update();
    }
    function handleKeyDown(event) {
        switch (event.keyCode) {
            case scope.keys.UP:
                pan(0, scope.keyPanSpeed);
                scope.update();
                break;
            case scope.keys.BOTTOM:
                pan(0, -scope.keyPanSpeed);
                scope.update();
                break;
            case scope.keys.LEFT:
                pan(scope.keyPanSpeed, 0);
                scope.update();
                break;
            case scope.keys.RIGHT:
                pan(-scope.keyPanSpeed, 0);
                scope.update();
                break;
        }
    }
    function handleTouchStartRotate(event) {
        rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
    }
    function handleTouchStartDolly(event) {
        var dx = event.touches[0].pageX - event.touches[1].pageX;
        var dy = event.touches[0].pageY - event.touches[1].pageY;
        var distance = Math.sqrt(dx * dx + dy * dy);
        dollyStart.set(0, distance);
    }
    function handleTouchStartPan(event) {
        panStart.set(event.touches[0].pageX, event.touches[0].pageY);
    }
    function handleTouchMoveRotate(event) {
        rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
        rotateDelta.subVectors(rotateEnd, rotateStart);
        var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
        /* rotating across whole screen goes 360 degrees around*/
        rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);
        /* rotating up and down along whole screen attempts to go 360, but limited to 180*/
        rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);
        rotateStart.copy(rotateEnd);
        scope.update();
    }
    function handleTouchMoveDolly(event) {
        var dx = event.touches[0].pageX - event.touches[1].pageX;
        var dy = event.touches[0].pageY - event.touches[1].pageY;
        var distance = Math.sqrt(dx * dx + dy * dy);
        dollyEnd.set(0, distance);
        dollyDelta.subVectors(dollyEnd, dollyStart);
        if (dollyDelta.y > 0) {
            dollyOut(getZoomScale());
        }
        else if (dollyDelta.y < 0) {
            dollyIn(getZoomScale());
        }
        dollyStart.copy(dollyEnd);
        scope.update();
    }
    function handleTouchMovePan(event) {
        panEnd.set(event.touches[0].pageX, event.touches[0].pageY);
        panDelta.subVectors(panEnd, panStart);
        pan(panDelta.x, panDelta.y);
        panStart.copy(panEnd);
        scope.update();
    }
    function handleTouchEnd(event) { }
    /*
     * event handlers - FSM: listen for events and reset state
     */
    function onMouseDown(event) {
        if (scope.enabled === false) {
            return;
        }
        event.preventDefault();
        switch (event.button) {
            case scope.mouseButtons.ORBIT:
                if (scope.enableRotate === false) {
                    return;
                }
                handleMouseDownRotate(event);
                state = STATE.ROTATE;
                break;
            case scope.mouseButtons.ZOOM:
                if (scope.enableZoom === false) {
                    return;
                }
                handleMouseDownDolly(event);
                state = STATE.DOLLY;
                break;
            case scope.mouseButtons.PAN:
                if (scope.enablePan === false) {
                    return;
                }
                handleMouseDownPan(event);
                state = STATE.PAN;
                break;
        }
        if (state !== STATE.NONE) {
            document.addEventListener('mousemove', onMouseMove, false);
            document.addEventListener('mouseup', onMouseUp, false);
            scope.dispatchEvent(startEvent);
        }
    }
    function onMouseMove(event) {
        if (scope.enabled === false) {
            return;
        }
        event.preventDefault();
        switch (state) {
            case STATE.ROTATE:
                if (scope.enableRotate === false) {
                    return;
                }
                handleMouseMoveRotate(event);
                break;
            case STATE.DOLLY:
                if (scope.enableZoom === false) {
                    return;
                }
                handleMouseMoveDolly(event);
                break;
            case STATE.PAN:
                if (scope.enablePan === false) {
                    return;
                }
                handleMouseMovePan(event);
                break;
        }
    }
    function onMouseUp(event) {
        if (scope.enabled === false) {
            return;
        }
        handleMouseUp(event);
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);
        scope.dispatchEvent(endEvent);
        state = STATE.SLIDER;
    }
    function onMouseWheel(event) {
        if (scope.enabled === false
            || scope.enableZoom === false
            || (state !== STATE.NONE && state !== STATE.ROTATE)) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        handleMouseWheel(event);
        scope.dispatchEvent(startEvent);
        /* not sure why these are here...*/
        scope.dispatchEvent(endEvent);
    }
    function onKeyDown(event) {
        if (scope.enabled === false || scope.enableKeys === false || scope.enablePan === false) {
            return;
        }
        handleKeyDown(event);
    }
    function onTouchStart(event) {
        if (scope.enabled === false) {
            return;
        }
        switch (event.touches.length) {
            case 1:
                /* one-fingered touch: rotate*/ if (scope.enableRotate === false) {
                    return;
                }
                handleTouchStartRotate(event);
                state = STATE.TOUCH_ROTATE;
                break;
            case 2:
                /* two-fingered touch: dolly*/ if (scope.enableZoom === false) {
                    return;
                }
                handleTouchStartDolly(event);
                state = STATE.TOUCH_DOLLY;
                break;
            case 3:
                /* three-fingered touch: pan*/ if (scope.enablePan === false) {
                    return;
                }
                handleTouchStartPan(event);
                state = STATE.TOUCH_PAN;
                break;
            default:
                state = STATE.NONE;
        }
        if (state !== STATE.NONE) {
            scope.dispatchEvent(startEvent);
        }
    }
    function onTouchMove(event) {
        if (scope.enabled === false) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        switch (event.touches.length) {
            case 1:
                /* one-fingered touch: rotate*/ if (scope.enableRotate === false) {
                    return;
                }
                if (state !== STATE.TOUCH_ROTATE) {
                    return;
                }
                handleTouchMoveRotate(event);
                break;
            case 2:
                /* two-fingered touch: dolly*/ if (scope.enableZoom === false) {
                    return;
                }
                if (state !== STATE.TOUCH_DOLLY) {
                    return;
                }
                handleTouchMoveDolly(event);
                break;
            case 3:
                /* three-fingered touch: pan*/ if (scope.enablePan === false) {
                    return;
                }
                if (state !== STATE.TOUCH_PAN) {
                    return;
                }
                handleTouchMovePan(event);
                break;
            default:
                state = STATE.NONE;
        }
    }
    function onTouchEnd(event) {
        if (scope.enabled === false) {
            return;
        }
        handleTouchEnd(event);
        scope.dispatchEvent(endEvent);
        state = STATE.SLIDER;
    }
    function onContextMenu(event) {
        if (scope.enabled === false) {
            return;
        }
        event.preventDefault();
    }
    scope.domElement.addEventListener('contextmenu', onContextMenu, false);
    scope.domElement.addEventListener('mousedown', onMouseDown, false);
    scope.domElement.addEventListener('wheel', onMouseWheel, false);
    scope.domElement.addEventListener('touchstart', onTouchStart, false);
    scope.domElement.addEventListener('touchend', onTouchEnd, false);
    scope.domElement.addEventListener('touchmove', onTouchMove, false);
    window.addEventListener('keydown', onKeyDown, false);
    /* force an update at start*/
    this.update();
}
;
OrbitControl.prototype = Object.create(THREE.EventDispatcher.prototype);
OrbitControl.prototype.constructor = OrbitControl;
/* harmony default export */ __webpack_exports__["a"] = (OrbitControl);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @file 陀螺仪控制器
 */
function DeviceControl(object, controls) {
    var scope = this;
    var lastSpherical;
    this.object = object;
    this.object.rotation.reorder('YXZ');
    this.enabled = false;
    this.deviceOrientation = {};
    this.screenOrientation = 0;
    this.alphaOffsetAngle = 0;
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 10000);
    var onDeviceOrientationChangeEvent = function (event) {
        scope.deviceOrientation = event;
    };
    var onScreenOrientationChangeEvent = function () {
        scope.screenOrientation = window.orientation || 0;
    };
    /* The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''*/
    var setObjectQuaternion = (function () {
        var zee = new THREE.Vector3(0, 0, 1);
        var euler = new THREE.Euler();
        var q0 = new THREE.Quaternion();
        // - PI/2 around the x-axis
        var q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
        var lookAt;
        var spherical = new THREE.Spherical();
        var detaSpherical = new THREE.Spherical();
        var disMin = 0.002;
        var disMax = 0.008;
        var currentDisLevel = disMax;
        return function (quaternion, alpha, beta, gamma, orient) {
            // 'ZXY' for the device, but 'YXZ' for us
            euler.set(beta, alpha, -gamma, 'YXZ');
            // orient the device
            quaternion.setFromEuler(euler);
            // camera looks out the back of the device, not the top
            quaternion.multiply(q1);
            // adjust for screen orientation
            quaternion.multiply(q0.setFromAxisAngle(zee, -orient));
            lookAt = scope.camera.getWorldDirection();
            spherical.setFromVector3(lookAt);
            spherical.setFromVector3(lookAt);
            if (lastSpherical) {
                detaSpherical.theta = spherical.theta - lastSpherical.theta;
                detaSpherical.phi = -spherical.phi + lastSpherical.phi;
                // var dis = Math.sqrt(detaSpherical.theta * detaSpherical.theta + detaSpherical.phi * detaSpherical.phi);
                // if (dis > currentDisLevel){
                //     controls.update(detaSpherical);
                //     currentDisLevel = disMin;
                // } else if (dis < currentDisLevel){
                //     currentDisLevel = disMax;
                // }
                controls.update(detaSpherical);
            }
            else {
                lastSpherical = new THREE.Spherical();
            }
            lastSpherical.theta = spherical.theta;
            lastSpherical.phi = spherical.phi;
        };
    }());
    this.connect = function () {
        // run once on load
        onScreenOrientationChangeEvent();
        window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);
        window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
        scope.enabled = true;
    };
    this.disconnect = function () {
        window.removeEventListener('orientationchange', onScreenOrientationChangeEvent, false);
        window.removeEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
        scope.enabled = false;
        lastSpherical = null;
        scope.deviceOrientation = {};
        scope.screenOrientation = 0;
    };
    this.update = function () {
        if (scope.enabled === false) {
            return;
        }
        var alpha = scope.deviceOrientation.alpha ? THREE.Math.degToRad(scope.deviceOrientation.alpha) : 0;
        var beta = scope.deviceOrientation.beta ? THREE.Math.degToRad(scope.deviceOrientation.beta) : 0; // X'
        var gamma = scope.deviceOrientation.gamma ? THREE.Math.degToRad(scope.deviceOrientation.gamma) : 0; // Y''
        var orient = scope.screenOrientation ? THREE.Math.degToRad(scope.screenOrientation) : 0; // O
        if (alpha === 0 && beta === 0 && gamma === 0 && orient === 0) {
            return;
        }
        setObjectQuaternion(scope.camera.quaternion, alpha, beta, gamma, orient);
    };
    this.updateAlphaOffsetAngle = function (angle) {
        this.alphaOffsetAngle = angle;
        this.update();
    };
    this.dispose = function () {
        this.disconnect();
    };
}
/* harmony default export */ __webpack_exports__["a"] = (DeviceControl);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var has = Object.prototype.hasOwnProperty;
var prefix = '~';
/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() { }
//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
    Events.prototype = Object.create(null);
    //
    // This hack is needed because the `__proto__` property is still inherited in
    // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
    //
    if (!new Events().__proto__)
        prefix = false;
}
/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
}
/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
    if (typeof fn !== 'function') {
        throw new TypeError('The listener must be a function');
    }
    var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
    if (!emitter._events[evt])
        emitter._events[evt] = listener, emitter._eventsCount++;
    else if (!emitter._events[evt].fn)
        emitter._events[evt].push(listener);
    else
        emitter._events[evt] = [emitter._events[evt], listener];
    return emitter;
}
/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
    if (--emitter._eventsCount === 0)
        emitter._events = new Events();
    else
        delete emitter._events[evt];
}
/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
    this._events = new Events();
    this._eventsCount = 0;
}
/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
    var names = [], events, name;
    if (this._eventsCount === 0)
        return names;
    for (name in (events = this._events)) {
        if (has.call(events, name))
            names.push(prefix ? name.slice(1) : name);
    }
    if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
    }
    return names;
};
/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
    var evt = prefix ? prefix + event : event, handlers = this._events[evt];
    if (!handlers)
        return [];
    if (handlers.fn)
        return [handlers.fn];
    for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
    }
    return ee;
};
/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
    var evt = prefix ? prefix + event : event, listeners = this._events[evt];
    if (!listeners)
        return 0;
    if (listeners.fn)
        return 1;
    return listeners.length;
};
/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt])
        return false;
    var listeners = this._events[evt], len = arguments.length, args, i;
    if (listeners.fn) {
        if (listeners.once)
            this.removeListener(event, listeners.fn, undefined, true);
        switch (len) {
            case 1:
                return listeners.fn.call(listeners.context), true;
            case 2:
                return listeners.fn.call(listeners.context, a1), true;
            case 3:
                return listeners.fn.call(listeners.context, a1, a2), true;
            case 4:
                return listeners.fn.call(listeners.context, a1, a2, a3), true;
            case 5:
                return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
            case 6:
                return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
            args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
    }
    else {
        var length = listeners.length, j;
        for (i = 0; i < length; i++) {
            if (listeners[i].once)
                this.removeListener(event, listeners[i].fn, undefined, true);
            switch (len) {
                case 1:
                    listeners[i].fn.call(listeners[i].context);
                    break;
                case 2:
                    listeners[i].fn.call(listeners[i].context, a1);
                    break;
                case 3:
                    listeners[i].fn.call(listeners[i].context, a1, a2);
                    break;
                case 4:
                    listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                    break;
                default:
                    if (!args)
                        for (j = 1, args = new Array(len - 1); j < len; j++) {
                            args[j - 1] = arguments[j];
                        }
                    listeners[i].fn.apply(listeners[i].context, args);
            }
        }
    }
    return true;
};
/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
    return addListener(this, event, fn, context, false);
};
/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
    return addListener(this, event, fn, context, true);
};
/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt])
        return this;
    if (!fn) {
        clearEvent(this, evt);
        return this;
    }
    var listeners = this._events[evt];
    if (listeners.fn) {
        if (listeners.fn === fn &&
            (!once || listeners.once) &&
            (!context || listeners.context === context)) {
            clearEvent(this, evt);
        }
    }
    else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
            if (listeners[i].fn !== fn ||
                (once && !listeners[i].once) ||
                (context && listeners[i].context !== context)) {
                events.push(listeners[i]);
            }
        }
        //
        // Reset the array, or remove it completely if we have no more listeners.
        //
        if (events.length)
            this._events[evt] = events.length === 1 ? events[0] : events;
        else
            clearEvent(this, evt);
    }
    return this;
};
/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;
    if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt])
            clearEvent(this, evt);
    }
    else {
        this._events = new Events();
        this._eventsCount = 0;
    }
    return this;
};
//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;
//
// Expose the prefix.
//
EventEmitter['prefixed'] = prefix;
//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter['EventEmitter'] = EventEmitter;
/* harmony default export */ __webpack_exports__["a"] = (EventEmitter);


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__log__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__loader__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__animation_fly_animation__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__plugin_overlay_plugin__ = __webpack_require__(10);




/**
 * 执行环境
 */
/* harmony default export */ __webpack_exports__["a"] = ({
    panoramList: [],
    /**
     * 环境构造 stream
     * @param {Object} panoram 全景对象
     * @param {string} url 资源地址
     */
    run: function (panoram, url) {
        Object(__WEBPACK_IMPORTED_MODULE_1__loader__["a" /* fetch */])(url).then(function (ret) {
            if (ret && ret.sceneGroup && ret.defaultSceneId) {
                if (ret.enableAnimation) {
                    panoram.addAnimation(__WEBPACK_IMPORTED_MODULE_2__animation_fly_animation__["a" /* default */]);
                }
                return panoram.initSource(ret);
            }
            else {
                __WEBPACK_IMPORTED_MODULE_0__log__["a" /* default */].errorLog('load source error');
            }
            // 预览场景
        }).then(function (scene) {
            if (scene) {
                if (scene.overlays) {
                    panoram.addPlugin(__WEBPACK_IMPORTED_MODULE_3__plugin_overlay_plugin__["a" /* default */], scene);
                }
                return Object(__WEBPACK_IMPORTED_MODULE_1__loader__["b" /* loadPreviewTex */])(scene.panoPath);
            }
            else {
                __WEBPACK_IMPORTED_MODULE_0__log__["a" /* default */].errorLog('get preview scene error');
            }
            // 场景贴图
        }).then(function (texture) {
            if (texture) {
                panoram.initMesh(texture);
                panoram.animate();
                return Object(__WEBPACK_IMPORTED_MODULE_1__loader__["c" /* loadSceneTex */])(panoram.currentScene.panoPath);
            }
            else {
                __WEBPACK_IMPORTED_MODULE_0__log__["a" /* default */].errorLog('load preview texture error');
            }
            // 完整场景
        }).then(function (textures) {
            if (textures) {
                panoram.loader.load(textures, function (tex) { return panoram.replaceTexture(tex); });
            }
            else {
                __WEBPACK_IMPORTED_MODULE_0__log__["a" /* default */].errorLog('load textures error');
            }
        }).catch(function (e) { return __WEBPACK_IMPORTED_MODULE_0__log__["a" /* default */].errorLog(e); });
    }
});


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = fetch;
/* harmony export (immutable) */ __webpack_exports__["b"] = loadPreviewTex;
/* harmony export (immutable) */ __webpack_exports__["c"] = loadSceneTex;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(1);

/**
 * @file fetch request
 */
function fetch(url, type) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = type || 'json';
        xhr.withCredentials = true;
        xhr.onload = function () { return resolve(xhr.response); };
        xhr.onerror = function (e) { return reject(e); };
        xhr.send();
    });
}
/**
 * 加载预览图
 * @param {string} path 资源路径
 * @param {number} timeout 超时时间
 */
function loadPreviewTex(path, timeout) {
    timeout = timeout || 100000;
    return new Promise(function (resolve, reject) {
        var texture = new THREE.CubeTexture();
        var image = new Image();
        image.setAttribute('crossOrigin', 'anonymous');
        var count = 0;
        image.onload = function () {
            var canvas;
            var context;
            var tileWidth = image.width;
            for (var i = 0; i < 6; i++) {
                canvas = document.createElement('canvas');
                context = canvas.getContext('2d');
                canvas.height = tileWidth;
                canvas.width = tileWidth;
                context.drawImage(image, 0, tileWidth * i, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth);
                var subImage = new Image();
                subImage.src = canvas.toDataURL('image/jpeg');
                subImage['idx'] = i;
                subImage.onload = function () {
                    count++;
                    /* 加载顺序 r l u d f b */
                    switch (this['idx']) {
                        case 0:
                            texture.images[1] = this;
                            break;
                        case 1:
                            texture.images[4] = this;
                            break;
                        case 2:
                            texture.images[0] = this;
                            break;
                        case 3:
                            texture.images[5] = this;
                            break;
                        case 4:
                            texture.images[2] = this;
                            break;
                        case 5:
                            texture.images[3] = this;
                            break;
                    }
                    if (count === 6) {
                        texture.mapping = THREE.CubeRefractionMapping;
                        texture.needsUpdate = true;
                        /* 触发完成加载preview的事件*/
                        // WebVR.container.dispatchEvent(WebVR.Event.LoadPreviewSuccessEvent);
                        resolve(texture);
                    }
                };
            }
            ;
        };
        image.src = path + '/preview.jpg';
        setTimeout(timeout, function () { return resolve('load images timeout'); });
    });
}
/**
 * 加载场景 bxl & 解密
 * @param {string} path 资源路径
 */
function loadSceneTex(path) {
    return Promise.all([fetch(path + "/images.bxl", 'text'), fetch(path + "/images.pem", 'text')])
        .then(function (ret) {
        var list = String(ret[0]).split('~#~');
        var secretData = list.slice(0, 6);
        var secretKey = String(ret[1]).replace(/-*[A-Z\s]*-\n?/g, '').split('~#~');
        var key = Object(__WEBPACK_IMPORTED_MODULE_0__util__["a" /* decode */])(secretKey[0], 0xf);
        var EOF = Object(__WEBPACK_IMPORTED_MODULE_0__util__["c" /* parseEOF */])(Object(__WEBPACK_IMPORTED_MODULE_0__util__["a" /* decode */])(secretKey[1], 0xe));
        if (!EOF.pass) {
            throw new Error('incorrect product domian');
        }
        return secretData.map(function (ciphertext, i) {
            var start = EOF.line;
            // find real cipher header
            var header = ciphertext.substring(0, start);
            var body = ciphertext.substring(start);
            return Object(__WEBPACK_IMPORTED_MODULE_0__util__["a" /* decode */])(header, key) + body;
        });
    });
}


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @file 开场动画组组件
 */
function calc(t, b, c, d) {
    return c * t / d + b;
}
var AnimationFly = /** @class */ (function () {
    function AnimationFly(panoram) {
        this.time = 0;
        var camera = panoram.camera;
        var path = this.path = this.getPath(camera);
        this.panoram = panoram;
        this.camera = camera;
        panoram.subscribe('renderProcess', this.update, this);
    }
    AnimationFly.prototype.update = function () {
        var camera = this.camera;
        var path = this.path;
        var phase = path[0];
        var time = this.time;
        if (!phase) {
            return this.dispose();
        }
        if (time > phase.time) {
            camera.fov = phase.end.fov;
            camera.position.set(phase.end.px, phase.end.py, phase.end.pz);
            camera.rotation.set(phase.end.rx, phase.end.ry, phase.end.rz);
            camera.updateProjectionMatrix();
            time = this.time = 0;
            return path.shift();
        }
        for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
            var data = path_1[_i];
            var px = calc(time, data.start.px, data.end.px - data.start.px, data.time);
            var py = calc(time, data.start.py, data.end.py - data.start.py, data.time);
            var pz = calc(time, data.start.pz, data.end.pz - data.start.pz, data.time);
            var rx = calc(time, data.start.rx, data.end.rx - data.start.rx, data.time);
            var ry = calc(time, data.start.ry, data.end.ry - data.start.ry, data.time);
            var rz = calc(time, data.start.rz, data.end.rz - data.start.rz, data.time);
            var fov = calc(time, data.start.fov, data.end.fov - data.start.fov, data.time);
            camera.fov = fov;
            camera.position.set(px, py, pz);
            camera.rotation.set(rx, ry, rz);
            this.time += 16;
            return camera.updateProjectionMatrix();
        }
    };
    AnimationFly.prototype.dispose = function () {
        this.panoram.dispatch('animationEnd', this);
        this.panoram.unsubscribe('renderProcess', this.update, this);
    };
    AnimationFly.prototype.getPath = function (camera) {
        return [{
                start: { fov: 160, px: 0, py: 1900, pz: 0, rx: -Math.PI / 2, ry: 0, rz: 0 },
                end: { fov: 120, px: 0, py: 1500, pz: 0, rx: -Math.PI / 2, ry: 0, rz: Math.PI * 0.8 },
                time: 1500
            }, {
                start: { fov: 120, px: 0, py: 1500, pz: 0, rx: -Math.PI / 2, ry: 0, rz: Math.PI * 0.8 },
                end: { fov: camera.fov, px: camera.position.x, py: camera.position.y, pz: camera.position.z, rx: -Math.PI, ry: 0, rz: Math.PI },
                time: 1500
            }];
    };
    return AnimationFly;
}());
/* harmony default export */ __webpack_exports__["a"] = (AnimationFly);
;


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__log__ = __webpack_require__(0);

/**
 * @file 全景覆盖物
 */
// 全景描述坐标转为世界坐标
function parseLocation(data, camera) {
    var location = data.location;
    if (location.h !== undefined && location.v !== undefined) {
        var spherical = new THREE.Spherical();
        var vector = new THREE.Vector3();
        spherical.theta = location.h / 180 * Math.PI;
        spherical.phi = location.v / 180 * Math.PI;
        spherical.radius = 1000;
        vector.setFromSpherical(spherical);
        data.location = {
            x: camera.position.x - vector.x,
            y: camera.position.y - vector.y,
            z: camera.position.z - vector.z
        };
    }
}
var Overlay = /** @class */ (function () {
    function Overlay(panoram, data) {
        this.panoram = panoram;
        this.camera = panoram.getCamera();
        this.data = data;
        this.loader = new THREE.TextureLoader();
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.cache = {};
        this.bindEvents();
    }
    Overlay.prototype.bindEvents = function () {
        var _this = this;
        var panoram = this.panoram;
        panoram.subscribe('sceneAttach', function (scene) {
            // 当前的场景数据
            _this.data = scene;
            _this.init(scene);
        });
        panoram.subscribe('renderProcess', function (scene) {
            var cache = _this.getCache(scene.id);
            cache.domGroup.forEach(function (element) { return _this.updateDomOverlay(element); });
        });
        panoram.webgl.domElement.addEventListener('click', this.onCanvasClick.bind(this));
    };
    Overlay.prototype.init = function (data) {
        var _this = this;
        if (!data.id) {
            data.id = 'panoram' + Date.now();
        }
        var cache = this.getCache(data.id);
        var overlays = data.overlays || [];
        overlays.forEach(function (overlay) {
            switch (overlay.type) {
                case 'dom':
                    _this.createDomOverlay(overlay, cache);
                    break;
                case 'mesh':
                    _this.createMeshOverlay(overlay, cache);
                    break;
                case 'animation':
                    _this.createAnimationOverlay(overlay, cache);
                    break;
            }
        });
    };
    Overlay.prototype.getCache = function (id) {
        var data = this.cache[id];
        if (data) {
            return data;
        }
        else {
            var group = new THREE.Group();
            this.panoram.addObject(group);
            return this.cache[id] = {
                domGroup: [],
                meshGroup: group
            };
        }
    };
    /**
     * html dom overlay
     * @param {Object} data 标签配置对象
     */
    Overlay.prototype.createDomOverlay = function (data, cache) {
        var _this = this;
        parseLocation(data, this.camera);
        var overlay = document.createElement('div');
        overlay.id = data.id;
        overlay.innerHTML = data.content;
        if (data.cls) {
            overlay.style.position = 'absolute';
            overlay.className = data.cls;
        }
        else {
            overlay.style.cssText = 'position:absolute;padding:0 4px;background: rgba(0, 0, 0, .3);white-space:nowrap;'
                + 'color:#fff;border-radius:2px;font-size:14px;height:20px;line-height: 20px;';
        }
        overlay.onclick = function (e) { return _this.onOverlayClick(data, e); };
        overlay.location = data.location;
        this.panoram.root.appendChild(overlay);
        this.updateDomOverlay(overlay);
        cache.domGroup.push(overlay);
    };
    Overlay.prototype.updateDomOverlay = function (element) {
        var root = this.panoram.getRoot();
        var width = root.clientWidth / 2;
        var height = root.clientHeight / 2;
        var location = element.location;
        var position = new THREE.Vector3(location.x, location.y, location.z);
        // world coord to screen coord
        var vector = position.project(this.camera);
        if (vector.z > 1) {
            element.style.display = 'none';
        }
        else {
            element.style.left = Math.round(vector.x * width + width) + 'px';
            element.style.top = Math.round(-vector.y * height + height) + 'px';
            element.style.display = 'block';
        }
    };
    /**
     * trxture img overlay
     * @param {Object} data 配置对象
     */
    Overlay.prototype.createMeshOverlay = function (data, cache) {
        var camera = this.camera;
        var texture = this.loader.load(data.img);
        var material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.FrontSide,
            transparent: true
        });
        // window.devicePixelRatio ? window.devicePixelRatio : 1;
        var scale = 1;
        var plane = new THREE.PlaneGeometry(data.width * scale, data.height * scale);
        var planeMesh = new THREE.Mesh(plane, material);
        parseLocation(data, camera);
        planeMesh.position.set(data.location.x, data.location.y, data.location.z);
        planeMesh.name = data.id;
        planeMesh.data = data;
        data.planeMesh = planeMesh;
        if (!data.rotation) {
            planeMesh.lookAt(camera.position);
        }
        else {
            planeMesh.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
        }
        cache.meshGroup.add(planeMesh);
    };
    Overlay.prototype.createAnimationOverlay = function () { };
    /**
     * 射线追踪确定点击物体
     * @param {Object} event
     */
    Overlay.prototype.onCanvasClick = function (event) {
        var element = this.panoram.webgl.domElement;
        var pos = {
            x: (event.clientX / element.clientWidth) * 2 - 1,
            y: -(event.clientY / element.clientHeight) * 2 + 1
        };
        try {
            var group = this.getCache(this.data.id).meshGroup;
            if (group.children) {
                this.raycaster.setFromCamera(pos, this.camera);
                var intersects = this.raycaster.intersectObjects(group.children, false);
                if (intersects.length > 0) {
                    this.onOverlayClick(intersects[0].object.data);
                }
            }
        }
        catch (e) {
            __WEBPACK_IMPORTED_MODULE_0__log__["a" /* default */].errorLog(e);
        }
    };
    Overlay.prototype.onOverlayClick = function (data, e) {
        var panoram = this.panoram;
        panoram.dispatch('overlayClick', data);
        switch (data.actionType) {
            case 'scene':
                panoram.enterNext(data.sceneId);
                break;
            case 'link':
                window.open(data.linkUrl, '_blank');
                break;
        }
    };
    Overlay.prototype.hideOverlays = function (scene) {
        var _this = this;
        var id = scene.id;
        if (scene.overlays) {
            var cache = this.getCache(id);
            cache.domGroup.forEach(function (overlay) { return _this.hideTextOverlay(overlay); });
            cache.meshGroup.forEach(function (overlay) { return _this.hideImgOverlay(overlay); });
        }
    };
    Overlay.prototype.showOverlays = function (scene) {
        var _this = this;
        var id = scene.id;
        if (scene.overlays) {
            var cache = this.getCache(id);
            cache.domGroup.forEach(function (overlay) { return _this.showTextOverlay(overlay); });
            cache.meshGroup.forEach(function (overlay) { return _this.showImgOverlay(overlay); });
        }
    };
    Overlay.prototype.hideTextOverlay = function (overlay) {
        overlay.style.display = 'none';
    };
    Overlay.prototype.showTextOverlay = function (overlay) {
        overlay.style.display = 'block';
    };
    Overlay.prototype.hideImgOverlay = function (overlay) {
        overlay.visible = false;
        overlay.material.map.dispose();
    };
    Overlay.prototype.showImgOverlay = function (overlay) {
        overlay.visible = true;
    };
    Overlay.prototype.hideAnimationOverlay = function (overlay) {
        overlay.pause();
        overlay.getMesh().visible = false;
    };
    Overlay.prototype.showAnimationOverlay = function (overlay) {
        overlay.play();
        overlay.getMesh().visible = true;
    };
    return Overlay;
}());
/* harmony default export */ __webpack_exports__["a"] = (Overlay);


/***/ })
/******/ ]);