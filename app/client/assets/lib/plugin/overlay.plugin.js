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

function setStyle(element, data) {
    for (let key in data) {
        element.style[key] = data[key];
    }
}

export default class Overlay {
    constructor(panoram, data) {
        this.panoram = panoram;
        this.camera = panoram.getCamera();

        this.data = data;
        this.loader = new THREE.TextureLoader();
        this.raycaster = new THREE.Raycaster();
        this.cache = {};

        this.bindEvents();
    }

    bindEvents() {
        const panoram = this.panoram;

        panoram.subscribe('sceneAttach', scene => {
            // 当前的场景数据
            this.data = scene;
            this.removeOverlays();
            this.init(scene);
        });

        panoram.subscribe('renderProcess', scene => {
            const cache = this.getCache(scene.id);
            cache.domGroup.forEach(item => this.updateDomOverlay(item));
        });

        panoram.webgl.domElement.addEventListener('click', this.onCanvasClick.bind(this));
    }

    init(data) {
        if (!data.id) {
            data.id = 'panoram' + Date.now();
        }
        this.lastId = data.id;

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
        cache.domGroup.push(data);        

        const overlay = document.createElement('div');
        overlay.id = data.id;
        overlay.innerHTML = data.content;
        overlay.className = 'panrom-domoverlay';

        if (data.cls) {
            overlay.className += ` ${data.cls}`;
        }

        overlay.onclick = e => this.onOverlayClick(data, e);
        this.panoram.root.appendChild(overlay);

        // cache for dom events and animation updates
        data.overlay = overlay;
        this.updateDomOverlay(data);
    }

    updateDomOverlay(data) {
        const root = this.panoram.getRoot();
        const width = root.clientWidth / 2;
        const height = root.clientHeight / 2;
        const location = data.location;
        const overlay = data.overlay;

        const position = new THREE.Vector3(location.x, location.y, location.z);
        // world coord to screen coord
        const vector = position.project(this.camera);

        if (vector.z > 1) {
            overlay.style.display = 'none';
        } else {
            const x = data.x = Math.round(vector.x * width + width);
            const y = data.y = Math.round(-vector.y * height + height);

            setStyle(overlay, {
                left: x + 'px',
                top: y + 'px',
                display: 'block'
            });
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
                // data.id
                panoram.enterNext(null);
                break;
            case 'link':
                window.open(data.linkUrl, '_blank');
                break;
        }
    }

    removeOverlays() {
        const cache = this.getCache(this.lastId);
        delete this.cache[this.lastId];
        this.lastId = null;

        cache && this.hideOverlays(cache, true);
    }

    hideOverlays(data, isclean) {
        if (data) {
            const root = this.panoram.getRoot();

            data.domGroup.forEach(item => {
                const overlay = item.overlay;

                overlay.style.display = 'none';
                isclean && root.removeChild(overlay);
            });

            if (data.meshGroup.children) {
                data.meshGroup.children.forEach(overlay => {
                    overlay.visible = false;
                    overlay.material.map.dispose();
                    isclean && overlay.remove();
                });
            }
        }
    }

    showOverlays(data) {
        if (data) {
            data.domGroup.forEach(item => {
                item.overlay.style.display = 'block';
            });
            data.meshGroup.children.forEach(overlay => {
                overlay.visible = true;
            });
        }
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