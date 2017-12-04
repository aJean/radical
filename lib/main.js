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
        const url = `${path}images.bxl`;
        fetchSource(url, 'text').then(ret => {
            ret = ret.split('~#~');
            console.log(ret)
            cubeTexLoader.load(ret, texture => cb(scene, texture));
        });
        return;

        const urls = ['r', 'l', 'u', 'd', 'f', 'b'].map(key => `${path}mobile_${key}.bxl`);
        fetchSources(urls, 'text').then(ret => {
            cubeTexLoader.load(ret, texture => cb(scene, texture));
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
        xhr.onerror = () => reject('!!!');

        xhr.send();
    });
}

function fetchSources(urls, type) {
    const requests = urls.map(url => fetchSource(url, type));
    return Promise.all(requests);
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

export default WebVR;