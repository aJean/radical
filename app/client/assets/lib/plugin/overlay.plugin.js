/**
 * @file 全景覆盖物
 */

// 全景描述坐标转为世界坐标
function parseLocation(label, camera) {
    const location = label.location;

    if (location.h !== undefined && location.v !== undefined) {
        const spherical = new THREE.Spherical();
        const vector = new THREE.Vector3();

        spherical.theta = location.h / 180 * Math.PI;
        spherical.phi = location.v / 180 * Math.PI;
        spherical.radius = 1000;

        vector.setFromSpherical(spherical);
        label.location = {
            x: camera.position.x - vector.x,
            y: camera.position.y - vector.y,
            z: camera.position.z - vector.z
        };
    }
}

export default class Overlay {
    constructor(panoram, data) {
        this.panoram = panoram;
        this.camera = panoram.getCamera();
        this.scene = panoram.getScene();

        this.data = data;
        this.loader = new THREE.TextureLoader();
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

        this.bindEvents();
    }

    bindEvents() {
        const panoram = this.panoram;

        panoram.subscribe('sceneAttach', secne => {

        });
    }

    onLabelobjClick(labelObj, e) {
        if (labelObj.onclick) {
            labelObj.onclick(labelObj, e);
        } else if (labelObj.actionType && labelObj.actionType !== '') {
            switch (labelObj.actionType) {
                case 'scene':
                    WebVR.enterScenebyId(labelObj.sceneId);
                    break;
                case 'link':
                    window.open(labelObj.linkUrl, '_blank');
                    break;
                case 'custom':
                    if (WebVR.controlObj && typeof WebVR.controlObj.labelObjClick === 'function') {
                        WebVR.controlObj.labelObjClick(labelObj);
                    }
                    break;
            }
        }
    }

    setPosition(label) {
        const root = this.panoram.getRoot();
        const width = root.clientWidth / 2;
        const height = root.clientHeight / 2;
        const location = label.location;
        const element = lable.element;

        const position = new THREE.Vector3(location.x, location.y, location.z);
        // 视图摄像机坐标
        const vector = position.project(this.camera);

        if (vector.z > 1) {
            element.stlye.display = 'none';
        } else {
            element.stlye.left = Math.round(vector.x * width + width) + 'px';
            element.stlye.top = Math.round(-vector.y * height + hight) + 'px';
        }
    }

    hideTextLabel(labelObj) {
        labelObj.textDom.style.display = 'none';
    }

    showTextLabel(labelObj) {
        labelObj.textDom.style.display = 'block';
    }

    /**
     * html dom label
     * @param {Object} label 标签配置对象
     */
    createTextLabel(label, handle) {
        parseLocation(label, this.camera);

        const div = document.createElement('div');
        div.id = label.id;
        div.innerHTML = label.content;

        if (label.cls) {
            div.className = label.textClass;
        } else {
            div.style.cssText = 'position: absolute;padding:0 4px;background: rgba(0, 0, 0, .3);white-space: nowrap;'
                + 'color: #fff;border-radius: 2px;font-size: 14px;height: 20px;line-height: 20px;';
        }

        div.onclick = function (e) {
            onLabelobjClick(label, e);
        };
        return label.element = div;
    }

    /*img */
    createImgLabel(label) {
        const camera = this.camera;        
        const texture = this.loader.load(label.imgurl);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.FrontSide,
            transparent: true
        });
        // window.devicePixelRatio ? window.devicePixelRatio : 1;
        const scale = 1;
        const plane = new THREE.PlaneGeometry(label.width * scale, label.height * scale);
        const planeMesh = new THREE.Mesh(plane, material);
        
        parseLocation(label, camera)
        planeMesh.position.set(label.location.x, label.location.y, label.location.z);
        planeMesh.name = label.id;
        planeMesh.label = label;

        if (!label.rotation) {
            imgPlaneMesh.lookAt(camera.position);
        } else {
            imgPlaneMesh.rotation.set(label.rotation.x, label.rotation.y, label.rotation.z);
        }

        label.planeMesh = planeMesh;
        const group = new THREE.Group();
        if (!label.sceneObj.LabelGroup) {
            label.sceneObj.LabelGroup = new THREE.Group();
            label.sceneObj.LabelGroup.name = label.sceneObj.id;
            scene.add(label.sceneObj.LabelGroup);
        }

        labelObj.sceneObj.LabelGroup.add(imgPlaneMesh);
    }

    hideImgLabel(labelObj) {
        labelObj.imgPlaneMesh.visible = false;
        labelObj.imgPlaneMesh.material.map.dispose();
    }

    showImgLabel(labelObj) {
        labelObj.imgPlaneMesh.visible = true;
    }
    /*animation */
    createAnimationLabel(labelObj) {
        initLocation(labelObj.location);
        var labelPos = new THREE.Vector3(labelObj.location.x, labelObj.location.y, labelObj.location.z);
        var imagePlayer = WebVR.ImagePlayerControl.createImagePlayer(labelPos,
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

    updateAnimationLabel(lanelObj) {
        lanelObj.animationObj.update();
    }

    hideAnimationLabel(lanelObj) {
        lanelObj.animationObj.pause();
        lanelObj.animationObj.getMesh().visible = false;
    }

    showAnimationLabel(lanelObj) {
        lanelObj.animationObj.play();
        lanelObj.animationObj.getMesh().visible = true;
    }
    /*event*/
    onTouchstart(event) {
        mouse.x = (event.changedTouches[0].clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.changedTouches[0].clientY / renderer.domElement.clientHeight) * 2 + 1;
    }

    onMousedown(event) {
        switch (event.button) {
            case 0:
                mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
                mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
                break;
        }
    }

    onTouchmove(event) {}

    onMousemove(event) {}

    onTouchend(event) {
        var startX = mouse.x;
        var startY = mouse.y;
        var dis = 0;
        mouse.x = (event.changedTouches[0].clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.changedTouches[0].clientY / renderer.domElement.clientHeight) * 2 + 1;
        var dx = mouse.x - startX;
        var dy = mouse.y - startY;
        dis = Math.sqrt(dx * dx + dy * dy);
        if (dis < 0.1) {
            /* 触发点击场景的事件*/
            WebVR.container.dispatchEvent(WebVR.Event.CanvasClickEvent);
            clickCanvas(mouse);
        }
    }

    onMouseup(event) {
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
                    /* 触发点击场景的事件*/
                    WebVR.container.dispatchEvent(WebVR.Event.CanvasClickEvent);
                    clickCanvas(mouse);
                }
                break;
        }
    }

    clickCanvas(mousePos) {
        var currentScene = WebVR.getCurrentScene();
        if (currentScene && currentScene.LabelGroup) {
            Raycaster.setFromCamera(mousePos, camera);
            var intersects = Raycaster.intersectObjects(currentScene.LabelGroup.children, false);
            if (intersects.length !== 0) {
                onLabelobjClick(intersects[0].object.labelObj);
            }
        }
    }

    bindEvent() {
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
    }

    createLabel(opts) {
        const group = opts.labelGroup || [];

        group.forEach(label => {
            switch (label.type) {
                case 'text':
                    this.createTextLabel(label);
                    break;
                case 'img':
                    this.createImgLabel(label);
                    break;
                case 'animation':
                    this.createAnimationLabel(label);
                    break;
            }
        });
    }

    hideSceneLabel(scene) {
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
    }

    showSceneLabel(scene) {
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
    }
}