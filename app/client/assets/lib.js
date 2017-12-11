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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @file 全景主程序
 * @author liwenhui(liwenhui01@baidu.com)
 */

const WebVR = window['WebVR'] = {};
WebVR.run = function (elem, dataJsonUrl, control) {
    WebVR.controlObj = control;
    /* 执行启动应用时的回调事件*/
    if (control && typeof control.onAppStart === 'function') {
        control.onAppStart();
    }

    /* 判断浏览器是否支持webgl */
    var webglSupport = false;
    try {
        var canvas = document.createElement('canvas');
        webglSupport = !!(window.WebGLRenderingContext
            && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    }
    catch (e) {
        webglSupport = false;
    }
    if (!webglSupport) {
        /* 执行不支持webgl时的回调事件*/
        if (control && typeof control.onUnSupport === 'function') {
            control.onUnSupport();
        }
        return;
    }

    var renderer;
    var camera;
    var scene;
    var controls;
    var deviceControls;
    var cubeTexLoader = new THREE.CubeTextureLoader();
    cubeTexLoader.crossOrigin = '';
    var startAnimationEnd = false;
    var startAnimation;
    var skyBox;
    var skyMesh;
    var containerWidth;
    var containerHeight;
    var currentSceneObj;
    var opt;

    var isMobile = (function () {
        var ua = navigator.userAgent;
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);

        var isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

        var isAndroid = ua.match(/(Android)\s+([\d.]+)/);

        return isIphone || isAndroid;
    }());

    this.textureLoader = new THREE.TextureLoader();
    this.updateArr = [];
    this.container = elem;
    this.getCamera = function () {
        return camera;
    };
    this.getRenderer = function () {
        return renderer;
    };
    this.getScene = function () {
        return scene;
    };
    this.getCurrentScene = function () {
        return currentSceneObj;
    };

    this.resize = function () {
        onWindowResize();
    };

    function onWindowResize() {
        containerWidth = elem.offsetWidth;
        containerHeight = elem.offsetHeight;

        camera.aspect = containerWidth / containerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(containerWidth, containerHeight);

        setTimeout(function () {
            onWindowResize();
        }, 2000);

    }

    function getSceneById(sceneId) {
        for (var idx in opt.sceneGroup) {
            if (opt.sceneGroup[idx].id === sceneId) {
                return opt.sceneGroup[idx];
            }
        }
        return null;
    }

    // 6 张全景图加载
    function afterNormalSceneLoadCallBack(sceneObj, tex) {
        sceneObj.tex = tex;
        replaceSkyTex(sceneObj);
    }

    // 替换背景贴图
    function replaceSkyTex(sceneObj) {
        var tempTex = scene.background;
        scene.background = sceneObj.tex;
        scene.background.needsUpdate = true;
        tempTex.dispose();

        currentSceneObj = sceneObj;
        WebVR.labelControl.showSceneLabel(currentSceneObj);
    }

    this.enterScenebyId = function (sceneId) {
        var enterScene = getSceneById(sceneId);

        /* 执行切换场景Scene之前的回调事件*/
        var beforeEnterSceneResult = true;
        if (control && typeof control.beforeEnterScene === 'function') {
            beforeEnterSceneResult = control.beforeEnterScene(currentSceneObj, enterScene);
        }

        if (beforeEnterSceneResult) {
            /* 隐藏场景的标签*/
            WebVR.labelControl.hideSceneLabel(currentSceneObj);

            if (!enterScene.tex) {
                loadPreviewTex(enterScene, enterScene.panoPath + '/', afterNormalSceneLoadCallBack);
            } else {
                replaceSkyTex(enterScene);
                /* 执行切换场景Scene后的回调事件*/
                if (control && typeof control.afterEnterScene === 'function') {
                    control.afterEnterScene(enterScene);
                }
            }
        }
    };

    function loadSceneTex(scene, path, cb) {
        // @todo 先进行解密, 此时应有去 server fetch key 的操作
        Promise.all([fetchSource(`${path}images.bxl`, 'text'), fetchSource('getKey', 'json')])   
            .then(ret => {
                const data = ret[0];
                const key = ret[1].key;

                const textures = data.split('~#~').map(ciphertext => {
                    const plaintext = CryptoJS.AES.decrypt({
                        ciphertext: CryptoJS.enc.Hex.parse(ciphertext),
                        salt: CryptoJS.lib.WordArray.create(0)
                    }, key);
                    return plaintext.toString(CryptoJS.enc.Utf8);
                });

                cubeTexLoader.load(textures, texture => cb(scene, texture));
            });
    }

    function loadPreviewTex(sceneObj, path, afterLoadCallBack) {
        loadSceneTex(sceneObj, path, (sceneObj, texture) => {
            texture.needsUpdate = true;
            afterLoadCallBack(sceneObj, texture);
        });
        return;

        var texture = new THREE.CubeTexture();
        var texFilePath = path + 'preview.jpg';
        var imageObj = new Image();
        imageObj.setAttribute('crossOrigin', 'anonymous');
        var subImgloadedCount = 0;

        imageObj.onload = function () {
            var canvas;
            var context;
            var tileWidth = imageObj.width;
            for (var i = 0; i < 6; i++) {
                canvas = document.createElement('canvas');
                context = canvas.getContext('2d');
                canvas.height = tileWidth;
                canvas.width = tileWidth;
                context.drawImage(imageObj, 0, tileWidth * i, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth);
                var subImage = new Image();
                subImage.src = canvas.toDataURL('image/jpeg');
                subImage.idx = i;
                subImage.onload = function () {
                    subImgloadedCount += 1;
                    /* 加载顺序 r l u d f b */
                    switch (this.idx) {
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
                    if (subImgloadedCount === 6) {
                        texture.needsUpdate = true;
                        // loadSceneTex(scene, path, afterNormalSceneLoadCallBack);
                        afterLoadCallBack(sceneObj, texture);
                    }
                };
            }
            ;

        };
        imageObj.src = texFilePath;
        return texture;
    }

    function afterAnimation() {
        startAnimationEnd = true;
        connectDevice();

    }

    function connectDevice() {
        if (isMobile && deviceControls) {
            deviceControls.connect();
        }
    }

    function initStartAnimation() {
        var path = [
            {
                'start': {
                    'fov': 150,
                    'position': {
                        'x': 0,
                        'y': 900,
                        'z': 0
                    },
                    'rotation': {
                        'x': -1.57,
                        'y': 3.14,
                        'z': -1.57
                    }
                },
                'end': {
                    'fov': 150,
                    'position': {
                        'x': 0,
                        'y': 300,
                        'z': 0.1
                    },
                    'rotation': {
                        'x': -1.0,
                        'y': 3.14,
                        'z': -0.5
                    }
                },
                'time': '1500'
            },
            {
                'start': {
                    'fov': 150,
                    'position': {
                        'x': 0,
                        'y': 300,
                        'z': 0.1
                    },
                    'rotation': {
                        'x': -1.0,
                        'y': 3.14,
                        'z': -0.5
                    }
                },
                'end': {
                    'fov': 55,
                    'position': {
                        'x': 0,
                        'y': 0,
                        'z': 0.1
                    },
                    'rotation': {
                        'x': 0,
                        'y': 3.14,
                        'z': 0
                    }
                },
                'time': '1000'
            }
        ];
        startAnimation = new WebVR.CameraFly(camera, path, afterAnimation);
        startAnimation.play();
    }

    function init() {
        window.addEventListener('resize', onWindowResize, false);

        containerWidth = elem.offsetWidth;
        containerHeight = elem.offsetHeight;

        renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(containerWidth, containerHeight);
        renderer.autoClear = true;
        renderer.setFaceCulling(THREE.CullFaceNone);
        WebVR.container.appendChild(renderer.domElement);

        scene = new THREE.Scene();
        if (opt && opt.fog) {
            scene.fog = new THREE.Fog(opt.fog.color, opt.fog.near, opt.fog.far);
        }
        camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 10000);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.rotateSpeed = -0.2;
        controls.target = new THREE.Vector3(0, 0, 1);
        controls.target0 = new THREE.Vector3(0, 0, 1);
        controls.reset();

        if (opt && opt.title) {
            document.querySelector('title').innerHTML = opt.title;
        }

        /* 注入参数到control对象*/
        if (control) {
            control.camera = camera;
            control.scene = scene;
            control.canvasDom = renderer.domElement;
            control.three = THREE;
            control.webvr = WebVR;
            control.controls = controls;
        }

        /*初始化labelCOntrol事件*/
        WebVR.labelControl.initParam();
        WebVR.labelControl.bindEvent();


        var defaultEnterScene = getSceneById(opt.defaultEnterSceneId);
        // 进入场景
        var beforeEnterSceneResult = true;
        if (control && typeof control.beforeEnterScene === 'function') {
            beforeEnterSceneResult = control.beforeEnterScene(null, defaultEnterScene);
        }

        if (beforeEnterSceneResult) {
            defaultEnterScene.tex = loadPreviewTex(defaultEnterScene,
                defaultEnterScene.panoPath + '/',
                afterFirstSceneLoadCallBack);
        }
    }

    function initDeviceControls() {
        deviceControls = new THREE.DeviceOrientationControls(camera, controls);
        if (control) {
            control.deviceControls = deviceControls;
        }
    }

    // 缩略图加载完成
    function afterFirstSceneLoadCallBack(sceneObj, tex) {
        scene.background = tex;

        /* 执行Init初始化后的回调事件*/
        if (control && typeof control.afterInit === 'function') {
            control.afterInit();
        }

        currentSceneObj = sceneObj;

        /* 执行切换场景Scene后的回调事件*/
        if (control && typeof control.afterEnterScene === 'function') {
            control.afterEnterScene(sceneObj);
        }

        if (opt.enableDevice) {
            initDeviceControls();
        }

        if (opt.enableAnimation) {
            initStartAnimation();
        }
        else {
            afterAnimation();
        }

        /*开始渲染循环*/
        animate();
    }

    function renderScene() {
        /* 执行render之前的回调事件*/
        if (control && typeof control.beforeRender === 'function') {
            control.beforeRender();
        }

        if (startAnimationEnd) {
            if (deviceControls && isMobile) {
                deviceControls.update();
            } else {
                controls.update();
            }

        } else {
            startAnimation.update();
        }


        /* 更新外部插件*/
        for (var i = 0; i < WebVR.updateArr.length; ++i) {
            WebVR.updateArr[i].update();
        }

        renderer.render(scene, camera);

        /* 更新场景的label*/
        if (currentSceneObj) {
            WebVR.labelControl.updateSceneLabel(currentSceneObj);
        }

        /* 执行render之后的回调事件*/
        if (control && typeof control.afterRender === 'function') {
            control.afterRender();
        }
    }

    function animate() {
        renderScene();
        requestAnimationFrame(animate);
    }

    function callInit() {
        var beforeResult = true;
        /* 执行Init初始化前的回调事件*/
        if (control && typeof control.beforeInit === 'function') {
            beforeResult = control.beforeInit();
        }
        if (beforeResult) {
            init();
        }
    }


    /*加载静态配置数据data.json*/

    /*自定义静态配置数据回调函数*/
    function customCallBack(customOpt) {
        opt = customOpt;
        callInit();
    }

    /* 执行自定义配置数据的回调事件*/
    if (control && typeof control.setDataJson === 'function') {
        control.setDataJson(customCallBack);
    } else {
        var beforeLoadJsonResult = true;
        /* 执行加载前的回调事件*/
        if (control && typeof control.beforeLoadJson === 'function') {
            beforeLoadJsonResult = control.beforeLoadJson();
        }
        if (beforeLoadJsonResult) {
            fetchSource(dataJsonUrl).then(res => {
                    opt = res;
                    callInit();
                    // control.loadJsonSuccess();
                }).catch(e => {
                    console.log(e);
                    control.loadJsonError();
                });
        }
    }
};

function fetchSource(url, type) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = type || 'json';
        xhr.withCredentials = true;
    
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = e => reject(e);

        xhr.send();
    });
}

window.onload = function () {
    const root = document.querySelector('pano');
    if (root) {
        const elem = document.createElement('div');
        elem.style.cssText = 'width: 100vw;height: 100vh;';
        root.appendChild(elem);
        WebVR.run(elem, root.getAttribute('source'));
    }
};

/* harmony default export */ __webpack_exports__["a"] = (WebVR);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_main__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_imagePlayerControl__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_labelControl__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_controls_orbitControls__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lib_controls_deviceOrientationControls__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__lib_plugin_cameraFly__ = __webpack_require__(6);







/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main__ = __webpack_require__(0);


/**
 * @file 全景序列帧控制器
 * @author liwenhui(liwenhui01@baidu.com)
 */

/* globals THREE WebVR*/
__WEBPACK_IMPORTED_MODULE_0__main__["a" /* default */].ImagePlayerControl = (function () {
    var result;

    function ImagePlayer(position,
                         cameraPosition,
                         planeWidth,
                         planeHeight,
                         imgPath,
                         coverImgPath,
                         imgCount,
                         autoPlay,
                         loop) {
        var self = this;
        this.autoPlay = autoPlay;
        this.loop = loop;
        var isPlaying = false;
        var coverShowState = true;
        var readyState = false;
        var loading = false;
        var loadedCount = 0;
        var textureLoader = __WEBPACK_IMPORTED_MODULE_0__main__["a" /* default */].textureLoader;

        var currentIndex = 0;
        var timePerFrame = 1000 / 20;

        var selfClass = this;

        var lastTime = 0;


        var texture;
        var textureArray = [];

        var coverTexture = textureLoader.load(coverImgPath);
        var material = new THREE.MeshBasicMaterial({map: coverTexture, transparent: true});

        var plane = new THREE.PlaneGeometry(planeWidth, planeHeight);

        var mesh = new THREE.Mesh(plane, material);
        mesh.position.set(position.x, position.y, position.z);
        mesh.lookAt(cameraPosition);

        function setCurrentFrame() {
            if (!isPlaying) {
                return;
            }
            /*根据时间设置当前帧*/
            if (lastTime > 0) {
                var currentTime = new Date().getTime();
                var deltaTime = currentTime - lastTime;

                var dIndex = parseInt(deltaTime / timePerFrame, 10);
                currentIndex += dIndex;
                if (!self.loop && currentIndex >= imgCount) {
                    selfClass.pause();
                    return;
                }
                currentIndex = currentIndex % imgCount;
                if (dIndex > 0) {
                    lastTime = currentTime;
                    if (textureArray[currentIndex]) {
                        textureArray[currentIndex].dispose();
                    }
                    texture = textureArray[currentIndex];
                    material.map = texture;
                }
            } else {
                if (textureArray[currentIndex]) {
                    textureArray[currentIndex].dispose();
                }
                texture = textureArray[currentIndex];
                material.map = texture;
                lastTime = new Date().getTime();
            }


        }

        function loadTexture() {
            if (loadedCount < imgCount) {
                loading = true;
                var loadImgPath = imgPath + '/' + (loadedCount + 1) + '.png';
                textureLoader.load(loadImgPath, function (tex) {
                    textureArray[loadedCount] = tex;
                    ++loadedCount;
                    loadTexture();
                });
            } else {
                texture = textureArray[0];
                readyState = true;
                loading = false;
            }

        }

        this.startLoad = function () {
            if (!loading) {
                loadTexture();
            }
        };

        this.update = function () {
            if (readyState && isPlaying) {

                setCurrentFrame();

            }
        };
        this.play = function () {
            if (!loading) {
                loadTexture();
            }
            isPlaying = true;
            lastTime = 0;
            currentIndex = currentIndex % imgCount;
            if (coverShowState) {
                coverShowState = false;
            }
        };
        this.pause = function () {
            isPlaying = false;
        };
        this.getMesh = function () {
            return mesh;
        };
        this.togglePlay = function () {
            if (isPlaying) {
                this.pause();
            }
            else {
                this.play();
            }
        };
        if (self.autoPlay) {
            self.play();
        }
    }

    function ImagePlayerControl() {
        this.createImagePlayer = function (position,
                                           cameraPosition,
                                           planeWidth,
                                           planeHeight,
                                           imgPath,
                                           coverImgPath,
                                           imgCount,
                                           autoPlay,
                                           loop) {
            return new ImagePlayer(position,
                cameraPosition,
                planeWidth,
                planeHeight,
                imgPath,
                coverImgPath,
                imgCount,
                autoPlay,
                loop);
        };
    }

    if (!result) {
        result = new ImagePlayerControl();
    }
    return result;
}());

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main__ = __webpack_require__(0);


/**
 * @file 全景3D标签控制器
 * @author liwenhui(liwenhui01@baidu.com)
 */

/* globals THREE WebVR*/
__WEBPACK_IMPORTED_MODULE_0__main__["a" /* default */].labelControl = (function () {
    var result;

    function LabelControl() {
        /* text*/
        var camera;
        var renderer;
        var scene;
        var mouse = new THREE.Vector2();
        var Raycaster = new THREE.Raycaster();

        var isMobile = (function () {
            var ua = navigator.userAgent;
            var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);

            var isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

            var isAndroid = ua.match(/(Android)\s+([\d.]+)/);

            return isIphone || isAndroid;
        }());

        /*util*/
        function getCamera() {
            if (!camera) {
                camera = __WEBPACK_IMPORTED_MODULE_0__main__["a" /* default */].getCamera();
            }
            return camera;
        }

        function getScene() {
            if (!scene) {
                scene = __WEBPACK_IMPORTED_MODULE_0__main__["a" /* default */].getScene();
            }
            return scene;
        }

        function getRenderer() {
            if (!renderer) {
                renderer = __WEBPACK_IMPORTED_MODULE_0__main__["a" /* default */].getRenderer();
            }
            return renderer;
        }

        /*labelObj clicked*/
        function onLabelobjClick(labelObj) {
            if (labelObj.actionType && labelObj.actionType !== '') {
                switch (labelObj.actionType) {
                    case 'scene':
                        __WEBPACK_IMPORTED_MODULE_0__main__["a" /* default */].enterScenebyId(labelObj.sceneId);
                        break;
                    case 'link':
                        window.open(labelObj.linkUrl, '_blank');
                        break;
                    case 'custom':
                        if (__WEBPACK_IMPORTED_MODULE_0__main__["a" /* default */].controlObj && typeof __WEBPACK_IMPORTED_MODULE_0__main__["a" /* default */].controlObj.labelObjClick === 'function') {
                            __WEBPACK_IMPORTED_MODULE_0__main__["a" /* default */].controlObj.labelObjClick(labelObj);
                        }
                        break;
                }
            }
        }

        /*text*/
        function createTextLabel(labelObj) {
            var div = document.createElement('div');
            div.id = labelObj.id;
            div.innerHTML = labelObj.labelContent;
            div.style.position = 'absolute';

            if (labelObj.textClass) {
                div.className = labelObj.textClass;
            } else {
                div.style.padding = '0px 4px';
                div.style.backgroundColor = 'rgba(0,0,0,0.3)';
                div.style.whiteSpace = 'nowrap';
                div.style.color = '#fff';
                div.style.borderRadius = '2px';
                div.style.fontSize = '14px';
                div.style.height = '20px';
                div.style.lineHeight = '20px';
            }

            if (labelObj.actionType && labelObj.actionType !== '') {
                div.onclick = function () {
                    onLabelobjClick(labelObj);
                };
            }

            __WEBPACK_IMPORTED_MODULE_0__main__["a" /* default */].container.appendChild(div);
            labelObj.textDom = div;
        }

        function updateTextLabel(labelObj) {
            var halfWidth = __WEBPACK_IMPORTED_MODULE_0__main__["a" /* default */].container.clientWidth / 2;
            var halfHeight = __WEBPACK_IMPORTED_MODULE_0__main__["a" /* default */].container.clientHeight / 2;
            var vector;
            var left = 0;
            var top = 0;
            var position = new THREE.Vector3(labelObj.location.x, labelObj.location.y, labelObj.location.z);
            vector = position.project(camera);
            if (vector.z > 1) {
                top = -1000;
            } else {
                left = Math.round(vector.x * halfWidth + halfWidth);
                top = Math.round(-vector.y * halfHeight + halfHeight);
            }

            labelObj.textDom.style.left = left + 'px';
            labelObj.textDom.style.top = top + 'px';
        }

        function hideTextLabel(labelObj) {
            labelObj.textDom.style.display = 'none';
        }

        function showTextLabel(labelObj) {
            labelObj.textDom.style.display = 'block';
        }

        /*img */
        function createImgLabel(labelObj) {
            var coverTexture = __WEBPACK_IMPORTED_MODULE_0__main__["a" /* default */].textureLoader.load(labelObj.imgUrl);
            var material = new THREE.MeshBasicMaterial({map: coverTexture, side: THREE.FrontSide, transparent: true});

            var plane = new THREE.PlaneGeometry(labelObj.imgWidth, labelObj.imgHeight);

            var imgPlaneMesh = new THREE.Mesh(plane, material);
            imgPlaneMesh.position.set(labelObj.location.x, labelObj.location.y, labelObj.location.z);
            imgPlaneMesh.name = labelObj.id;
            imgPlaneMesh.labelObj = labelObj;

            if (!labelObj.rotation) {
                imgPlaneMesh.lookAt(camera.position);
            }
            else {
                imgPlaneMesh.rotation.set(labelObj.rotation.x, labelObj.rotation.y, labelObj.rotation.z);
            }
            labelObj.imgPlaneMesh = imgPlaneMesh;

            if (!labelObj.sceneObj.LabelGroup) {
                labelObj.sceneObj.LabelGroup = new THREE.Group();
                labelObj.sceneObj.LabelGroup.name = labelObj.sceneObj.id;
                scene.add(labelObj.sceneObj.LabelGroup);
            }
            labelObj.sceneObj.LabelGroup.add(imgPlaneMesh);
        }

        function hideImgLabel(labelObj) {
            labelObj.imgPlaneMesh.visible = false;
            labelObj.imgPlaneMesh.material.map.dispose();
        }

        function showImgLabel(labelObj) {
            labelObj.imgPlaneMesh.visible = true;
        }

        /*animation */
        function createAnimationLabel(labelObj) {
            var labelPos = new THREE.Vector3(labelObj.location.x, labelObj.location.y, labelObj.location.z);
            var imagePlayer = __WEBPACK_IMPORTED_MODULE_0__main__["a" /* default */].ImagePlayerControl.createImagePlayer(labelPos,
                camera.position,
                labelObj.imgWidth,
                labelObj.imgHeight,
                labelObj.imgDir,
                labelObj.coverImgUrl,
                labelObj.imgCount,
                labelObj.autoPlay === '1',
                labelObj.loop === '1');
            imagePlayer.name = labelObj.id;

            var imagePlayerMesh = imagePlayer.getMesh();
            imagePlayerMesh.name = labelObj.id;

            imagePlayerMesh.labelObj = labelObj;

            if (labelObj.rotation) {
                imagePlayerMesh.rotation.set(labelObj.rotation.x, labelObj.rotation.y, labelObj.rotation.z);
            }
            labelObj.animationObj = imagePlayer;

            if (!labelObj.sceneObj.LabelGroup) {
                labelObj.sceneObj.LabelGroup = new THREE.Group();
                labelObj.sceneObj.LabelGroup.name = labelObj.sceneObj.id;
                scene.add(labelObj.sceneObj.LabelGroup);
            }
            labelObj.sceneObj.LabelGroup.add(imagePlayerMesh);
        }

        function updateAnimationLabel(lanelObj) {
            lanelObj.animationObj.update();
        }

        function hideAnimationLabel(lanelObj) {
            lanelObj.animationObj.pause();
            lanelObj.animationObj.getMesh().visible = false;
        }

        function showAnimationLabel(lanelObj) {
            lanelObj.animationObj.play();
            lanelObj.animationObj.getMesh().visible = true;
        }


        /*event*/
        function onTouchstart(event) {
            mouse.x = (event.changedTouches[0].clientX / renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = -(event.changedTouches[0].clientY / renderer.domElement.clientHeight) * 2 + 1;
        }

        function onMousedown(event) {
            switch (event.button) {
                case 0:
                    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
                    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
                    break;
            }
        }

        function onTouchmove(event) {

        }

        function onMousemove(event) {

        }

        function onTouchend(event) {
            var startX = mouse.x;
            var startY = mouse.y;
            var dis = 0;
            mouse.x = (event.changedTouches[0].clientX / renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = -(event.changedTouches[0].clientY / renderer.domElement.clientHeight) * 2 + 1;
            var dx = mouse.x - startX;
            var dy = mouse.y - startY;
            dis = Math.sqrt(dx * dx + dy * dy);
            if (dis < 0.1) {
                clickCanvas(mouse);
            }
        }

        function onMouseup(event) {
            switch (event.button) {
                case 0:
                    var startX = mouse.x;
                    var startY = mouse.y;
                    var dis = 0;
                    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
                    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
                    var dx = mouse.x - startX;
                    var dy = mouse.y - startY;
                    dis = Math.sqrt(dx * dx + dy * dy);
                    if (dis < 0.1) {
                        clickCanvas(mouse);
                    }
                    break;
            }
        }

        function clickCanvas(mousePos) {
            var currentScene = __WEBPACK_IMPORTED_MODULE_0__main__["a" /* default */].getCurrentScene();
            if (currentScene && currentScene.LabelGroup) {
                Raycaster.setFromCamera(mousePos, camera);
                var intersects = Raycaster.intersectObjects(currentScene.LabelGroup.children, false);

                if (intersects.length !== 0) {
                    onLabelobjClick(intersects[0].object.labelObj);
                }
            }

        }

        /*public*/
        this.initParam = function () {
            getCamera();
            getRenderer();
            getScene();
        };
        this.bindEvent = function () {
            var canvasDom = renderer.domElement;

            if (isMobile) {
                canvasDom.addEventListener('touchend', onTouchend, false);
                canvasDom.addEventListener('touchmove', onTouchmove, false);
                canvasDom.addEventListener('touchstart', onTouchstart, false);
            } else {
                canvasDom.addEventListener('mouseup', onMouseup, false);
                canvasDom.addEventListener('mousemove', onMousemove, false);
                canvasDom.addEventListener('mousedown', onMousedown, false);
            }
        };
        this.updateSceneLabel = function (scene) {
            if (scene.scene3DLabelGroup && scene.scene3DLabelGroup.length > 0) {
                for (var i = 0; i < scene.scene3DLabelGroup.length; ++i) {
                    var labelObj = scene.scene3DLabelGroup[i];
                    if (!labelObj.sceneObj) {
                        labelObj.sceneObj = scene;
                    }
                    switch (labelObj.labelType) {
                        case 'text':
                            if (!labelObj.textDom) {
                                createTextLabel(labelObj);
                            }
                            updateTextLabel(labelObj);
                            break;
                        case 'img':
                            if (!labelObj.imgPlaneMesh) {
                                createImgLabel(labelObj);
                            }
                            /*updateImgLabel(labelObj);*/
                            break;
                        case 'animation':
                            if (!labelObj.animationObj) {
                                createAnimationLabel(labelObj);
                            }
                            updateAnimationLabel(labelObj);
                            break;
                    }
                }
            }
        };

        this.hideSceneLabel = function (scene) {
            if (scene.scene3DLabelGroup && scene.scene3DLabelGroup.length > 0) {
                for (var i = 0; i < scene.scene3DLabelGroup.length; ++i) {
                    var labelObj = scene.scene3DLabelGroup[i];
                    switch (labelObj.labelType) {
                        case 'text':
                            if (labelObj.textDom) {
                                hideTextLabel(labelObj);
                            }
                            break;
                        case 'img':
                            if (labelObj.imgPlaneMesh) {
                                hideImgLabel(labelObj);
                            }
                            break;
                        case 'animation':
                            if (labelObj.animationObj) {
                                hideAnimationLabel(labelObj);
                            }
                            break;
                    }
                }
            }
        };

        this.showSceneLabel = function (scene) {
            if (scene.scene3DLabelGroup && scene.scene3DLabelGroup.length > 0) {
                for (var i = 0; i < scene.scene3DLabelGroup.length; ++i) {
                    var labelObj = scene.scene3DLabelGroup[i];
                    switch (labelObj.labelType) {
                        case 'text':
                            if (labelObj.textDom) {
                                showTextLabel(labelObj);
                            }
                            break;
                        case 'img':
                            if (labelObj.imgPlaneMesh) {
                                showImgLabel(labelObj);
                            }
                            break;
                        case 'animation':
                            if (labelObj.animationObj) {
                                showAnimationLabel(labelObj);
                            }
                            break;
                    }
                }
            }
        };
    }

    if (!result) {
        result = new LabelControl();
    }
    return result;
}());

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main__ = __webpack_require__(0);


/**
 * @file 全景相机控制器
 * @author liwenhui(liwenhui01@baidu.com)
 */

/* globals THREE*/
THREE.OrbitControls = function (object, domElement) {

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
    this.keys = {LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40};

    /* Mouse buttons*/
    this.mouseButtons = {ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT};

    /* for reset*/
    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.zoom0 = this.object.zoom;


    /*
    * internals
    */
    /* current position in spherical coordinates*/
    var spherical = new THREE.Spherical();
    var sphericalDelta = new THREE.Spherical();

    var scope = this;

    var changeEvent = {type: 'change'};
    var startEvent = {type: 'start'};
    var endEvent = {type: 'end'};

    var STATE = {NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5, SLIDER: 6};

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

            } else if (state === STATE.SLIDER) {
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
                } else if (scope.object.fov < scope.minFov) {
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

            } else {

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

            } else if (scope.object instanceof THREE.OrthographicCamera) {

                /* orthographic*/
                panLeft(deltaX * (scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth,
                    scope.object.matrix);
                panUp(deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight,
                    scope.object.matrix);

            } else {

                /* camera neither orthographic nor perspective*/
                console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
                scope.enablePan = false;

            }

        };

    }());

    function dollyIn(dollyScale) {

        if (scope.object instanceof THREE.PerspectiveCamera) {

            scale /= dollyScale;

        } else if (scope.object instanceof THREE.OrthographicCamera) {

            scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom * dollyScale));
            scope.object.updateProjectionMatrix();
            zoomChanged = true;

        } else {

            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            scope.enableZoom = false;

        }

    }

    function dollyOut(dollyScale) {

        if (scope.object instanceof THREE.PerspectiveCamera) {

            scale *= dollyScale;

        } else if (scope.object instanceof THREE.OrthographicCamera) {

            scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / dollyScale));
            scope.object.updateProjectionMatrix();
            zoomChanged = true;

        } else {

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

        } else if (dollyDelta.y < 0) {

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

    function handleMouseUp(event) {
    }

    function handleMouseWheel(event) {
        if (event.deltaY < 0) {

            dollyOut(getZoomScale());

        } else if (event.deltaY > 0) {

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

        } else if (dollyDelta.y < 0) {

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

    function handleTouchEnd(event) {
    }

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

            case 1:    /* one-fingered touch: rotate*/

                if (scope.enableRotate === false) {
                    return;
                }

                handleTouchStartRotate(event);

                state = STATE.TOUCH_ROTATE;

                break;

            case 2:    /* two-fingered touch: dolly*/

                if (scope.enableZoom === false) {
                    return;
                }

                handleTouchStartDolly(event);

                state = STATE.TOUCH_DOLLY;

                break;

            case 3: /* three-fingered touch: pan*/

                if (scope.enablePan === false) {
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
            case 1: /* one-fingered touch: rotate*/
                if (scope.enableRotate === false) {
                    return;
                }
                if (state !== STATE.TOUCH_ROTATE) {
                    return;
                }
                handleTouchMoveRotate(event);
                break;
            case 2: /* two-fingered touch: dolly*/
                if (scope.enableZoom === false) {
                    return;
                }
                if (state !== STATE.TOUCH_DOLLY) {
                    return;
                }
                handleTouchMoveDolly(event);
                break;
            case 3: /* three-fingered touch: pan*/
                if (scope.enablePan === false) {
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

};

THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main__ = __webpack_require__(0);


/**
 * @file 陀螺仪控制器
 * @author liwenhui(liwenhui01@baidu.com)
 */

/* globals THREE WebVR*/
THREE.DeviceOrientationControls = function (object, controls) {

    var scope = this;

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

        var q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

        var lookAt;

        var spherical = new THREE.Spherical();
        var detaSpherical = new THREE.Spherical();
        var lastSpherical;

        return function (quaternion, alpha, beta, gamma, orient) {

            euler.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us

            quaternion.setFromEuler(euler); // orient the device

            quaternion.multiply(q1); // camera looks out the back of the device, not the top

            quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation

            lookAt = scope.camera.getWorldDirection();
            spherical.setFromVector3(lookAt);

            spherical.setFromVector3(lookAt);
            if (lastSpherical) {
                detaSpherical.theta = spherical.theta - lastSpherical.theta;
                detaSpherical.phi = -spherical.phi + lastSpherical.phi;
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

        onScreenOrientationChangeEvent(); // run once on load

        window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);
        window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);

    };

    this.disconnect = function () {

        window.removeEventListener('orientationchange', onScreenOrientationChangeEvent, false);
        window.removeEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);

        scope.enabled = false;

    };

    this.update = function () {

        if (scope.enabled === false) {
            return;
        }

        var alpha = scope.deviceOrientation.alpha ? THREE.Math.degToRad(scope.deviceOrientation.alpha) : 0;
        var beta = scope.deviceOrientation.beta ? THREE.Math.degToRad(scope.deviceOrientation.beta) : 0; // X'
        var gamma = scope.deviceOrientation.gamma ? THREE.Math.degToRad(scope.deviceOrientation.gamma) : 0; // Y''
        var orient = scope.screenOrientation ? THREE.Math.degToRad(scope.screenOrientation) : 0; // O

        setObjectQuaternion(scope.camera.quaternion, alpha, beta, gamma, orient);
    };

    this.updateAlphaOffsetAngle = function (angle) {

        this.alphaOffsetAngle = angle;
        this.update();

    };

    this.dispose = function () {

        this.disconnect();

    };
};


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main__ = __webpack_require__(0);
﻿

/**
 * @file 开场动画组组件
 * @author liwenhui(liwenhui01@baidu.com)
 */

/* globals THREE*/
__WEBPACK_IMPORTED_MODULE_0__main__["a" /* default */].CameraFly = function WebVR_Fly(camera, path, FlyEndCallBack) {
    var enable = false;
    var startTime;
    var totleTime = 0;
    var lastTime = 0;
    for (var i = 0; i < path.length; i++) {
        totleTime += path[i].time;
    }
    this.play = function () {
        startTime = new Date();
        startTime = startTime - lastTime;
        enable = true;
    }
    this.stop = function () {
        enable = false;
    }
    this.reset = function () {
        startTime = new Date();
        lastTime = 0;
    }
    this.update = function () {
        if (!enable) {
            return;
        }
        var currentTime = new Date();
        var dTime = currentTime - startTime;
        lastTime = dTime;
        if (dTime > totleTime) {
            return;
        }
        for (var i = 0; i < path.length; i++) {
            if (dTime <= path[i].time) {
                var movePercent = dTime / path[i].time;
                var pX = path[i].start.position.x + movePercent * (path[i].end.position.x - path[i].start.position.x);
                var pY = path[i].start.position.y + movePercent * (path[i].end.position.y - path[i].start.position.y);
                var pZ = path[i].start.position.z + movePercent * (path[i].end.position.z - path[i].start.position.z);

                var rX = path[i].start.rotation.x + movePercent * (path[i].end.rotation.x - path[i].start.rotation.x);
                var rY = path[i].start.rotation.y + movePercent * (path[i].end.rotation.y - path[i].start.rotation.y);
                var rZ = path[i].start.rotation.z + movePercent * (path[i].end.rotation.z - path[i].start.rotation.z);


                var fov = path[i].start.fov + movePercent * (path[i].end.fov - path[i].start.fov);

                camera.fov = fov;
                camera.position.set(pX, pY, pZ);
                camera.rotation.set(rX, rY, rZ);

                camera.updateProjectionMatrix();
                return;
            } else {
                dTime -= path[i].time;
            }
        }
        camera.fov = path[path.length - 1].end.fov;
        camera.position.set(path[path.length - 1].end.position.x, path[path.length - 1].end.position.y, path[path.length - 1].end.position.z);
        camera.rotation.set(path[path.length - 1].end.rotation.x, path[path.length - 1].end.rotation.y, path[path.length - 1].end.rotation.z);
        camera.updateProjectionMatrix();
        enable = false;
        lastTime = 0;
        if (FlyEndCallBack) {
            FlyEndCallBack();
        }
    }
}

/***/ })
/******/ ]);