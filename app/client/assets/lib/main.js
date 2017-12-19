/**
 * @file 全景主程序
 * @author liwenhui(liwenhui01@baidu.com)
 */
/* globals THREE WebVR*/
const WebVR = window['WebVR'] = {};
WebVR.setControl = function (control) {
    this.control = control;
};
WebVR.DefaultParam = {};
WebVR.EventType = {
    RenderUpdate: 'WebVR_RenderUpdate',
    AppStart: 'WebVR_AppStart',
    WebGLUnSupport: 'WebVR_WebGLUnSupport',
    CanvasClick: 'WebVR_CanvasClick',
    ChangeScene: 'WebVR_ChangeScene',
    LoadJsonError: 'WebVR_LoadJsonError',
    LoadJsonSuccess: 'WebVR_LoadJsonSuccess',
    LoadPreviewSuccess: 'WebVR_LoadPreviewSuccess',
    LoadPanoSuccess: 'WebVR_LoadPanoSuccess'
};
WebVR.Event = {
    RenderUpdateEvent: new Event(WebVR.EventType.RenderUpdate),
    AppStartEvent: new Event(WebVR.EventType.AppStart),
    WebGLUnSupportEvent: new Event(WebVR.EventType.WebGLUnSupport),
    CanvasClickEvent: new Event(WebVR.EventType.CanvasClick),
    ChangeSceneEvent: new Event(WebVR.EventType.ChangeScene),
    LoadJsonErrorEvent: new Event(WebVR.EventType.LoadJsonError),
    LoadJsonSuccessEvent: new Event(WebVR.EventType.LoadJsonSuccess),
    LoadPreviewSuccessEvent: new Event(WebVR.EventType.LoadPreviewSuccess),
    LoadPanoSuccessEvent: new Event(WebVR.EventType.LoadPanoSuccess)
};

WebVR.run = function (element, dataJsonUrl, control) {
    WebVR.container = element;
    WebVR.controlObj = control;
    /* 执行启动应用时的回调事件*/
    if (control && typeof control.onAppStart === 'function') {
        control.onAppStart();
    }
    /* 触发启动应用时的事件*/
    WebVR.container.dispatchEvent(WebVR.Event.AppStartEvent);

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
        /* 触发不支持webgl时的事件*/
        WebVR.container.dispatchEvent(WebVR.Event.WebGLUnSupportEvent);
        return;
    }
    /* 变量 */
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
    var increaseIdx = 0;
    var fullScreenParam = {};

    var isMobile = (function () {
        var ua = navigator.userAgent;
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);

        var isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

        var isAndroid = ua.match(/(Android)\s+([\d.]+)/);

        return isIphone || isAndroid;
    }());

    this.textureLoader = new THREE.TextureLoader();
    this.updateArr = [];
    this.container;
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
    this.getControls = function () {
        return controls;
    };

    this.resize = function () {
        onWindowResize();
    };
    this.setDeviceControlState = function (value) {
        if (deviceControls.enabled !== value) {
            if (value) {
                connectDevice();
            } else {
                disConnectDevice();
            }
        }
    };

    this.getFov = function () {
        if (camera) {
            return camera.fov;
        } else {
            return null;
        }
    };

    this.setFov = function (value) {
        if (camera) {
            camera.fov = value;
            camera.updateProjectionMatrix();
        } else {
            return null;
        }
    };
    this.getPanoSize = function () {
        return {
            width: renderer.domElement.clientWidth,
            height: renderer.domElement.clientHeight
        };
    };

    this.getLookH = function () {
        if (controls) {
            return controls.getAzimuthalAngle() / Math.PI * 180;
        } else {
            return null;
        }
    };

    this.getLookV = function () {
        if (controls) {
            return controls.getPolarAngle() / Math.PI * 180;
        } else {
            return null;
        }
    };

    this.setLook = function (valueH, valueV) {
        if (controls) {
            if (valueH !== undefined && valueH !== undefined) {
                valueH = valueH / 180 * Math.PI;
            }
            else {
                valueH = Math.PI;
            }
            if (valueV !== undefined && valueV !== undefined) {
                valueV = valueV / 180 * Math.PI;
            }
            else {
                valueV = Math.PI / 2;
            }
            controls.setSphericalAngle(valueH, valueV);
        }
    };

    this.addLabel = function (labelObj, sceneObjId) {
        var sceneObj;
        if (sceneObjId) {
            sceneObj = getSceneById();
        }
        else {
            sceneObj = currentSceneObj;
        }
        if (sceneObj) {
            if (!sceneObj.scene3DLabelGroup) {
                sceneObj.scene3DLabelGroup = [];
            }

            var increaseId = getIncreaseId();
            if (labelObj) {
                labelObj.id = increaseId;
            }
            sceneObj.scene3DLabelGroup.push(labelObj);
            return labelObj;
        }
        return null;
    };

    this.removeLabelByLabelObj = function (labelObj, sceneObjId) {
        var sceneObj;
        var result = false;
        if (sceneObjId) {
            sceneObj = getSceneById();
        }
        else {
            sceneObj = currentSceneObj;
        }
        if (sceneObj && sceneObj.scene3DLabelGroup && labelObj) {
            var idx = sceneObj.scene3DLabelGroup.indexOf(labelObj);
            if (idx >= 0) {
                result = true;
                var deleteObjArr = sceneObj.scene3DLabelGroup.splice(idx, 1);
                delete deleteObjArr[0];
            }
            if (labelObj.textDom) {
                labelObj.textDom.remove();
            }
            if (labelObj.imgPlaneMesh) {
                sceneObj.LabelGroup.remove(labelObj.imgPlaneMesh);
                labelObj.imgPlaneMesh.material.map.dispose();
            }
            if (labelObj.animationObj) {
                var mesh = labelObj.animationObj.getMesh();
                sceneObj.LabelGroup.remove(mesh);
                labelObj.animationObj.dispose();
            }
        }
        return result;
    };

    function getIncreaseId() {
        increaseIdx++;
        return 'Increase_' + increaseIdx;
    }

    function onWindowResizeCore() {
        containerWidth = WebVR.container.clientWidth;
        containerHeight = WebVR.container.clientHeight;

        camera.aspect = containerWidth / containerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerWidth, containerHeight);
    }

    function onWindowResize() {
        onWindowResizeCore();
        setTimeout(function () {
            onWindowResizeCore();
        }, 2000);

    }


    function fullScreenEvent() {
        var parent = WebVR.container;
        fullScreenParam.position = parent.style.position;
        fullScreenParam.width = parent.style.width;
        fullScreenParam.height = parent.style.height;
        fullScreenParam.left = parent.style.left;
        fullScreenParam.top = parent.style.top;

        parent.style.position = 'absolute';
        parent.style.width = window.innerWidth + 'px';
        parent.style.height = window.innerHeight + 'px';
        parent.style.left = '0px';
        parent.style.top = '0px';
        WebVR.resize();
        window.removeEventListener('resize', fullScreenEvent, false);
    }

    function cancelFullScreenEvent() {
        var parent = WebVR.container;
        parent.style.position = fullScreenParam.position;
        parent.style.width = fullScreenParam.width;
        parent.style.height = fullScreenParam.height;
        parent.style.left = fullScreenParam.left;
        parent.style.top = fullScreenParam.top;
        WebVR.resize();
        window.removeEventListener('resize', cancelFullScreenEvent, false);
    }

    function requestFullscreenCore(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.oRequestFullscreen) {
            element.oRequestFullscreen();
        }
        else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullScreen();
        }
    }

    function cancleFullscreenCore() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.oRequestFullscreen) {
            document.oCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    this.cancleFullscreen = function () {
        window.addEventListener('resize', cancelFullScreenEvent, false);
        cancleFullscreenCore();
    };
    this.requestFullscreen = function () {
        window.addEventListener('resize', fullScreenEvent, false);
        requestFullscreenCore(document.body);
    };

    function getSceneById(sceneId) {
        for (var idx in opt.sceneGroup) {
            if (opt.sceneGroup[idx].id === sceneId) {
                return opt.sceneGroup[idx];
            }
        }
        return null;
    }

    function afterNormalSceneLoadCallBack(sceneObj, tex) {
        sceneObj.tex = tex;
        replaceSkyTex(sceneObj);
    }
    
    /**
     * 改变场景的 background
     * 改变 mesh 的 envMap
     */
    function replaceSkyTex(sceneObj) {
        // var tempTex = scene.background;
        // scene.background = sceneObj.tex;
        // scene.background.needsUpdate = true;
        // tempTex.dispose();

        var tempTex = skyMesh.material.envMap;
        skyMesh.material.envMap = sceneObj.tex;
        skyMesh.material.envMap.needsUpdate = true;
        tempTex.dispose();

        if (currentSceneObj !== sceneObj) {
            currentSceneObj = sceneObj;
            WebVR.labelControl.showSceneLabel(currentSceneObj);
            /* 执行切换场景Scene后的回调事件*/
            if (control && typeof control.afterEnterScene === 'function') {
                control.afterEnterScene(currentSceneObj);
            }

            /* 触发切换场景后的事件*/
            WebVR.container.dispatchEvent(WebVR.Event.ChangeSceneEvent);
        }
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
            }
            // /* 执行切换场景Scene后的回调事件*/
            // if (control && typeof control.afterEnterScene === 'function') {
            //     control.afterEnterScene(enterScene);
            // }
            //
            // /* 触发切换场景后的事件*/
            // WebVR.container.dispatchEvent(WebVR.Event.ChangeSceneEvent);
        }
    };

    function loadSceneTex(scene, path, cb) {
         // generate key & decode       
        Promise.all([fetchSource(`${path}images.bxl`, 'text'), fetchSource('webar/getKey', 'json')])   
            .then(ret => {
                const data = ret[0].split('~#~').slice(0, 6);
                const key = ret[1].key;

                const textures = data.map(ciphertext => {
                    const plaintext = CryptoJS.AES.decrypt({
                        ciphertext: CryptoJS.enc.Hex.parse(ciphertext),
                        salt: CryptoJS.lib.WordArray.create(0)
                    }, key);
                    return plaintext.toString(CryptoJS.enc.Utf8);
                });

                cubeTexLoader.load(textures, texture => cb(scene, texture));
                // WebVR.container.dispatchEvent(WebVR.Event.LoadPanoSuccessEvent);
            });
    }

    function loadPreviewTex(sceneObj, texPath, afterLoadCallBack) {
        // loadSceneTex(sceneObj, texPath, (sceneObj, texture) => {
        //     texture.needsUpdate = true;
        //     afterLoadCallBack(sceneObj, texture);
        // });
        // return;

        var texture = new THREE.CubeTexture();
        var texFilePath = texPath + 'preview.jpg';
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

                        /* 触发完成加载preview的事件*/
                        WebVR.container.dispatchEvent(WebVR.Event.LoadPreviewSuccessEvent);

                        loadSceneTex(sceneObj, texPath, afterNormalSceneLoadCallBack);
                        afterLoadCallBack(sceneObj, texture);
                    }
                };
            };
        };
        imageObj.src = texFilePath;
        return texture;
    }

    function afterAnimation() {
        startAnimationEnd = true;
        if (opt.enableDevice) {
            connectDevice();
        }
    }

    function disConnectDevice() {
        if (isMobile && deviceControls) {
            deviceControls.disconnect();
        }
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
                    'fov': 160,
                    'position': {
                        'x': 0,
                        'y': 1900,
                        'z': 0
                    },
                    'rotation': {
                        'x': -Math.PI / 2,
                        'y': 0,
                        'z': 0
                    }
                },
                'end': {
                    'fov': 120,
                    'position': {
                        'x': 0,
                        'y': 1500,
                        'z': 0
                    },
                    'rotation': {
                        'x': -Math.PI / 2,
                        'y': 0,
                        'z': Math.PI * 0.8
                    }
                },
                'time': '1500'
            },
            {
                'start': {
                    'fov': 120,
                    'position': {
                        'x': 0,
                        'y': 1500,
                        'z': 0
                    },
                    'rotation': {
                        'x': -Math.PI / 2,
                        'y': 0,
                        'z': Math.PI * 0.8
                    }
                },
                'end': {
                    'fov': camera.fov,
                    'position': {
                        'x': camera.position.x,
                        'y': camera.position.y,
                        'z': camera.position.z
                    },
                    'rotation': {
                        'x': -Math.PI,
                        'y': 0,
                        'z': Math.PI
                    }
                },
                'time': '1500'
            }
        ];
        startAnimation = new WebVR.CameraFly(camera, path, afterAnimation);
        startAnimation.play();
    }

    function init() {
        window.addEventListener('resize', onWindowResize, false);
        containerWidth = WebVR.container.clientWidth;
        containerHeight = WebVR.container.clientHeight;

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

        var defaultFov = 55;
        if (WebVR.DefaultParam.defaultFov) {
            defaultFov = WebVR.DefaultParam.defaultFov;
        } else if (opt && opt.defaultFov) {
            defaultFov = opt.defaultFov;
        }
        camera = new THREE.PerspectiveCamera(defaultFov, window.innerWidth / window.innerHeight, 0.1, 10000);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.rotateSpeed = -0.2;
        controls.target = new THREE.Vector3(0, 0, 1);
        controls.target0 = new THREE.Vector3(0, 0, 1);
        WebVR.setLook(WebVR.DefaultParam.defaultLookH, WebVR.DefaultParam.defaultLookV);
        controls.reset();

        if (opt && opt.title) {
            document.title = opt.title;
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


        var defaultEnterScene = getSceneById(WebVR.DefaultParam.defaultEnterSceneId || opt.defaultEnterSceneId);
        /* 执行切换场景Scene之前的回调事件*/
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
        if (isMobile) {
            deviceControls = new THREE.DeviceOrientationControls(camera, controls);
        }
        if (control) {
            control.deviceControls = deviceControls;
        }
    }


    function afterFirstSceneLoadCallBack(sceneObj, tex) {
        var material = new THREE.MeshBasicMaterial({
            envMap: tex,
            side: THREE.DoubleSide
        });

        // scene.background = tex;
        skyBox = new THREE.SphereGeometry(2000, 32, 32);
        skyMesh = new THREE.Mesh(skyBox, material);
        scene.add(skyMesh);

        /* 执行Init初始化后的回调事件*/
        if (control && typeof control.afterInit === 'function') {
            control.afterInit();
        }

        currentSceneObj = sceneObj;

        /* 执行切换场景Scene后的回调事件*/
        if (control && typeof control.afterEnterScene === 'function') {
            control.afterEnterScene(sceneObj);
        }

        initDeviceControls();

        if (opt.enableAnimation) {
            renderScene();
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
            if (deviceControls && isMobile && deviceControls.enabled) {
                deviceControls.update();
            } else {
                controls.update();
            }

        } else {
            if (startAnimation) {
                startAnimation.update();
            }
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

        /* 触发render之后的事件*/
        WebVR.container.dispatchEvent(WebVR.Event.RenderUpdateEvent);
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
        else {
            return;
        }
    }


    /*加载静态配置数据data.json*/
    function loadJsonError() {
        /* 执行加载失败时的回调事件*/
        if (control && typeof control.loadJsonError === 'function') {
            control.loadJsonError();
        }

        /* 触发加载失败时的事件*/
        WebVR.container.dispatchEvent(WebVR.Event.LoadJsonErrorEvent);
    }

    /*自定义静态配置数据回调函数*/
    function customCallBack(customOpt) {
        opt = customOpt;
        callInit();
    }

    /* 执行自定义配置数据的回调事件*/
    if (control && typeof control.setDataJson === 'function') {
        control.setDataJson(customCallBack);
    }
    else {
        var beforeLoadJsonResult = true;
        /* 执行加载前的回调事件*/
        if (control && typeof control.beforeLoadJson === 'function') {
            beforeLoadJsonResult = control.beforeLoadJson();
        }
        if (beforeLoadJsonResult) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', dataJsonUrl);
            xhr.responseType = 'text';
            xhr.onload = function (e) {
                if (this.status === 200) {
                    try {
                        opt = JSON.parse(this.responseText);
                    } catch (ex) {
                        loadJsonError();
                        return;
                    }

                    callInit();
                    /* 执行加载成功时的回调事件*/
                    if (control && typeof control.loadJsonSuccess === 'function') {
                        control.loadJsonSuccess();
                    }
                    /* 触发加载成功时的事件*/
                    WebVR.container.dispatchEvent(WebVR.Event.LoadJsonSuccessEvent);
                }
                else {
                    loadJsonError();
                }
            };
            xhr.send();
        }
        else {
            return;
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
        const scope = window[root.getAttribute('scope')];
        WebVR.run(elem, root.getAttribute('source'), scope);
    }
};