import {Vector3, Raycaster, Group} from 'three';
import Panoram from '../panoram';
import Util from '../util';
import Log from '../log';
import DomOverlay from './dom.overlay';
import MeshOverlay from './mesh.overlay';
import SpriteOverlay from './sprite.overlay';
import FrameOverlay from './frame.overlay';
import VideoOverlay from './video.overlay';

/**
 * @file 管理所有场景下的覆盖物
 */

const AnimationOpts = {
    rain: {
        type: 2,
        size: 15,
        spriteCount: 1000,
        speed: 9,
        colorR: 0.25,
        colorG: 0.25,
        colorB: 0.25
    },
    snow: {
        type: 1,
        spriteCount: 500,
        colorR: 1,
        colorG: 1,
        colorB: 1
    }
};

export default class Overlays {
    maps = {};
    panoram: Panoram;
    cid: number;
    raycaster = new Raycaster();

    constructor(panoram: Panoram) {
        this.panoram = panoram;

        panoram.subscribe('scene-attach', scene => {
            this.removeOverlays();
            this.init(scene);
        });

        panoram.subscribe('render-process', scene => {
            const cache = this.getCurrent(scene.id);
            cache.domGroup.forEach(item => this.updateDomOverlay(item));
            cache.meshGroup.forEach(item => item.update());
        });

        panoram.getCanvas().addEventListener('click', this.onCanvasHandle.bind(this));
    }

    init(data) {
        // scene cache id
        if (!data.id) {
            data.id = 'panoram' + Date.now();
        }

        this.cid = data.id;
        this.create(data);
    }

    create(data) {
        const cache = this.getCurrent(this.cid);
        const props = data.overlays || [];

        props.forEach(prop => {
            switch (prop.type) {
                case 'dom':
                    this.createDomOverlay(prop, cache);
                    break;
                case 'mesh':
                    this.createMeshOverlay(prop, cache);
                    break;
                case 'animation':
                    this.createAnimationOverlay(prop, cache);
                    break;
                case 'video':
                    this.createVideoOverlay(prop, cache);
                    break;
            }
        });
    }

    /**
     * 创建 dom 覆盖物并添加进 maps
     */
    createDomOverlay(prop, cache) {
        Util.parseLocation(prop, this.panoram.getCamera());

        const item = new DomOverlay(prop);
        item.elem.onclick = e => this.onOverlayHandle(item);
        cache.domGroup.push(item);

        this.panoram.addDomObject(item.elem);
        this.updateDomOverlay(item);
    }

    /**
     * 不断更新 dom overlay 的屏幕坐标
     */
    updateDomOverlay(item) {
        const panoram = this.panoram;
        const root = panoram.getRoot();
        const width = root.clientWidth / 2;
        const height = root.clientHeight / 2;
        const position = Util.calcScreenPosition(item.data.location, panoram.getCamera());
        // z > 1 is backside
        if (position.z > 1) {
            item.hide();
        } else {
            const x = Math.round(position.x * width + width);
            const y = Math.round(-position.y * height + height);
            item.update(x, y);
        }
    }

    /**
     * 创建 mesh 覆盖物
     */
    createMeshOverlay(prop, cache) {
        const camera = this.panoram.getCamera();

        Util.parseLocation(prop, camera);
        const item = new MeshOverlay(prop);
        const particle = item.particle;

        if (!prop.rotation) {
            particle.lookAt(camera.position);
        } else {
            particle.rotation.set(prop.rotation.x, prop.rotation.y, prop.rotation.z);
        }
        // 加入可检测分组
        cache.detects.add(particle);
        cache.meshGroup.push(item);
    }

    /**
     * 创建动画覆盖物
     */
    createAnimationOverlay(prop, cache) {
        const panoram = this.panoram;
        const camera = panoram.getCamera();
        let item;
    
        Util.parseLocation(prop, camera);
        if (prop.category == 'frame') {
            prop.lookat = camera.position;
            item = new FrameOverlay(prop);
        } else {
            item = new SpriteOverlay(AnimationOpts[prop.category]);
        }

        panoram.addSceneObject(item.particle);
        cache.meshGroup.push(item);
    }

    /**
     * 创建视频覆盖物
     */
    createVideoOverlay(prop, cache) {
        const panoram = this.panoram;
        const camera = panoram.getCamera();

        Util.parseLocation(prop, camera);
        prop.lookat = camera.position;
        const item = new VideoOverlay(prop);

        cache.detects.add(item.particle);
        cache.meshGroup.push(item);
    }

    /**
     * 获取当前的缓存对象
     * @param {any} id 场景id
     */
    getCurrent(id) {
        const data = this.maps[id];

        if (data) {
            return data;
        } else {
            const group = new Group();
            this.panoram.addSceneObject(group);

            return this.maps[id] = {
                detects: group,
                domGroup: [],
                meshGroup: []
            }
        }
    }

    /**
     * 点击 canvas
     */
    onCanvasHandle(evt) {
        const panoram = this.panoram;
        const raycaster = this.raycaster;
        const element = panoram.getCanvas();
        const pos = {
            x: (evt.clientX / element.clientWidth) * 2 - 1,
            y: -(evt.clientY / element.clientHeight) * 2 + 1
        };
        
        try {
            const group = this.getCurrent(this.cid).detects;

            if (group.children) {
                raycaster.setFromCamera(pos, panoram.getCamera());
                const intersects = raycaster.intersectObjects(group.children, false);
                intersects.length && this.onOverlayHandle(intersects[0].object['instance']);
            } else {
                // TODO: nescessary to dispatch ???
                // panoram.dispatch('panoram-click', panoram);
            }
        } catch(e) {
            Log.errorLog(e);
        }
    }

    /**
     * 点击覆盖物
     */
    onOverlayHandle(instance) {
        const panoram = this.panoram;
        const data = instance.data;
        
        switch (data.actionType) {
            case 'scene':
                panoram.enterNext(data.sceneId);
                break;
            case 'link':
                window.open(data.linkUrl, '_blank');
                break;
            // let Multiple plugin control
            case 'multiple':
                panoram.dispatch('multiple-active', data);
                break;
            case 'video':
                instance.play();
                break;
            default:
                panoram.dispatch('overlay-click', instance, panoram);
        }
    }

    /**
     * 删除当前场景下的所有 overlays
     */
    removeOverlays() {
        const cache = this.getCurrent(this.cid);
        delete this.maps[this.cid];
        this.cid = null;

        cache && this.hideOverlays(cache, true);
    }

    /**
     * 隐藏当前场景下的 overlays
     * @param {Object} data 缓存数据 
     * @param {boolean} isclean 是否清除
     */
    hideOverlays(data, isclean) {
        const panoram = this.panoram;

        if (data) {
            data.domGroup.forEach(item => {
                item.hide();
                if (isclean) {
                    item.dispose();
                    panoram.removeDomObject(item.elem);
                }
            });

            data.meshGroup.forEach(item => {
                item.hide();
                if (isclean) {
                    item.dispose();
                    panoram.removeSceneObject(item.particle);
                }
            });

            if (isclean && data.detects.children) {
                data.detects.remove(...data.detects.children);
                panoram.removeSceneObject(data.detects);
            }

        }
    }

    /**
     * 展示 overlays
     * @todo 加入缓存机制, 这个方法才有意义, 当前是 remove + create
     */
    showOverlays(data) {
        if (data) {
            data.domGroup.forEach(item => item.show());
            data.meshGroup.forEach(item => item.show());
        }
    }
}