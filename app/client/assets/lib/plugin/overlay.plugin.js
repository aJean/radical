import {isMobile} from '../util';
import Log from '../log';

/**
 * @file 全景覆盖物
 */

// 全景描述坐标转为世界坐标
function parseLocation(data, camera) {
    const location = data.location;

    if (location.h !== undefined && location.v !== undefined) {
        const spherical = new THREE.Spherical();
        const vector = new THREE.Vector3();

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

export default class Overlay {
    constructor(panoram, data) {
        this.panoram = panoram;
        this.camera = panoram.getCamera();

        this.data = data;
        this.loader = new THREE.TextureLoader();
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

        this.cache = {};

        this.bindEvents();
    }

    bindEvents() {
        const panoram = this.panoram;
        const canvasDom = panoram.webgl.domElement;        

        panoram.subscribe('sceneAttach', scene => {
            // 当前的场景数据
            this.data = scene;
            this.init(scene);
        });


        canvasDom.addEventListener('click', this.onCanvasClick.bind(this));
        return;
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

    init(data) {
        if (!data.id) {
            data.id = 'panoram' + Date.now();
        }

        const cache = this.getCache(data.id);
        const overlays = data.overlays || [];

        overlays.forEach(overlay => {
            switch (overlay.type) {
                case 'dom':
                    this.createDomOverlay(overlay, cache);
                    break;
                case 'mesh':
                    this.createMeshOverlay(overlay, cache);
                    break;
                case 'animation':
                    this.createAnimationOverlay(overlay, cache);
                    break;
            }
        });
    }

    getCache(id) {
        const data = this.cache[id];

        if (data) {
            return data;
        } else {
            const group = new THREE.Group();
            this.panoram.addObject(group);

            return this.cache[id] = {
                domGroup: [],
                meshGroup: group
            }
        }
    }

    /**
     * html dom overlay
     * @param {Object} data 标签配置对象
     */
    createDomOverlay(data, cache) {
        parseLocation(data, this.camera);

        const element = document.createElement('div');
        element.id = data.id;
        element.innerHTML = data.content;

        if (data.cls) {
            element.style.position = 'absolute';
            element.className = data.cls;
        } else {
            element.style.cssText = 'position:absolute;padding:0 4px;background: rgba(0, 0, 0, .3);white-space:nowrap;'
                + 'color:#fff;border-radius:2px;font-size:14px;height:20px;line-height: 20px;';
        }

        element.onclick = e => this.onOverlayClick(data, e);

        this.panoram.root.appendChild(element);
        cache.domGroup.push(data.element = element);

        this.updateDomOverlayPosition(element, data);
    }

    updateDomOverlayPosition(element, data) {
        const root = this.panoram.getRoot();
        const width = root.clientWidth / 2;
        const height = root.clientHeight / 2;
        const location = data.location;

        const position = new THREE.Vector3(location.x, location.y, location.z);
        // world coord to screen coord
        const vector = position.project(this.camera);

        if (vector.z > 1) {
            element.stlye.display = 'none';
        } else {
            const left = data.x = Math.round(vector.x * width + width);
            const top = data.y = Math.round(-vector.y * height + height);
            element.style.left = left + 'px';
            element.style.top = top + 'px';
        }
    }

    /**
     * trxture img overlay
     * @param {Object} data 配置对象
     */
    createMeshOverlay(data, cache) {
        const camera = this.camera;        
        const texture = this.loader.load(data.img);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.FrontSide,
            transparent: true
        });
        // window.devicePixelRatio ? window.devicePixelRatio : 1;
        const scale = 1;
        const plane = new THREE.PlaneGeometry(data.width * scale, data.height * scale);
        const planeMesh = new THREE.Mesh(plane, material);
        
        parseLocation(data, camera)
        planeMesh.position.set(data.location.x, data.location.y, data.location.z);
        planeMesh.name = data.id;
        planeMesh.data = data;
        data.planeMesh = planeMesh;

        if (!data.rotation) {
            planeMesh.lookAt(camera.position);
        } else {
            planeMesh.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
        }

        cache.meshGroup.add(planeMesh);
    }

    createAnimationOverlay() {}

    /**
     * 射线追踪确定点击物体
     * @param {Object} event 
     */
    onCanvasClick(event) {
        const element = this.panoram.webgl.domElement;
        const pos = {
            x: (event.clientX / element.clientWidth) * 2 - 1,
            y: -(event.clientY / element.clientHeight) * 2 + 1
        };
        
        try {
            const group = this.getCache(this.data.id).meshGroup;

            if (group.children) {
                this.raycaster.setFromCamera(pos, this.camera);
                const intersects = this.raycaster.intersectObjects(group.children, false);
                if (intersects.length > 0) {
                    this.onOverlayClick(intersects[0].object.data);
                }
            }
        } catch(e) {
            Log.errorLog(e);
        }
    }

    onOverlayClick(data, e) {
        const panoram = this.panoram;

        panoram.dispatch('overlayClick', data);
        switch (data.actionType) {
            case 'scene':
                panoram.enterNext(data.sceneId);
                break;
            case 'link':
                window.open(data.linkUrl, '_blank');
                break;
        }
    }

    hideOverlays(scene) {
        const id = scene.id;

        if (scene.overlays) {
            const cache = this.getCache(id);

            cache.domGroup.forEach(overlay => this.hideTextOverlay(overlay));
            cache.meshGroup.forEach(overlay => this.hideImgOverlay(overlay));
        }
    }

    showOverlays(scene) {
        const id = scene.id;
        
        if (scene.overlays) {
            const cache = this.getCache(id);

            cache.domGroup.forEach(overlay => this.showTextOverlay(overlay));
            cache.meshGroup.forEach(overlay => this.showImgOverlay(overlay));
        }
    }

    hideTextOverlay(overlay) {
        overlay.style.display = 'none';
    }

    showTextOverlay(overlay) {
        overlay.style.display = 'block';
    }

    hideImgOverlay(overlay) {
        overlay.visible = false;
        overlay.material.map.dispose();
    }

    showImgOverlay(overlay) {
        overlay.visible = true;
    }

    hideAnimationOverlay(overlay) {
        overlay.pause();
        overlay.getMesh().visible = false;
    }

    showAnimationOverlay(overlay) {
        overlay.play();
        overlay.getMesh().visible = true;
    }
}