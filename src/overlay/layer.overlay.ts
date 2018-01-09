import {Vector3, Raycaster, Group} from 'three';
import Panoram from '../panoram';
import Util from '../util';
import Log from '../log';
import DomOverlay from './dom.overlay';
import MeshOverlay from './mesh.overlay';
import SpriteOverlay from './sprite.overlay';
import FrameOverlay from './frame.overlay';

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

export default abstract class Layer {
    static maps = {};
    static panoram: Panoram;
    static cid: number;
    static raycaster = new Raycaster();

    static install(panoram: Panoram, data) {
        this.panoram = panoram;
        this.create(data);

        panoram.subscribe('sceneAttach', scene => {
            this.removeOverlays(); 
            this.create(scene);
        });

        panoram.subscribe('renderProcess', scene => {
            const cache = this.getCurrent(scene.id);
            cache.domGroup.forEach(item => this.updateDomOverlay(item));
            cache.animGroup.forEach(item => item.update());
        });

        panoram.getCanvas().addEventListener('click', this.onCanvasClick.bind(this));
    }

    static create(data) {
        if (!data.id) {
            data.id = 'panoram' + Date.now();
        }

        this.cid = data.id;

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
            }
        });
    }

    /**
     * 创建 dom 覆盖物并添加进 maps
     */
    static createDomOverlay(prop, cache) {
        Util.parseLocation(prop, this.panoram.getCamera());

        const item = new DomOverlay(prop);
        item.elem.onclick = e => this.onOverlayClick(item.data);
        cache.domGroup.push(item);

        this.panoram.addDomObject(item.elem);
        this.updateDomOverlay(item);
    }

    /**
     * 不断更新 dom overlay 的屏幕坐标
     */
    static updateDomOverlay(item) {
        const root = this.panoram.getRoot();
        const width = root.clientWidth / 2;
        const height = root.clientHeight / 2;
        const position = this.getScreenPosition(item.data.location);

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
    static createMeshOverlay(prop, cache) {
        const camera = this.panoram.getCamera();

        Util.parseLocation(prop, camera);
        const mesh = MeshOverlay.create(prop);

        if (!prop.rotation) {
            mesh.lookAt(camera.position);
        } else {
            mesh.rotation.set(prop.rotation.x, prop.rotation.y, prop.rotation.z);
        }

        cache.meshGroup.add(mesh);
    }

    /**
     * 创建动画覆盖物
     */
    static createAnimationOverlay(prop, cache) {
        let item;
    
        if (prop.category == 'frame') {
            prop.lookat = this.panoram.getCamera().position;
            item = new FrameOverlay(prop);
        } else {
            item = new SpriteOverlay(AnimationOpts[prop.category]);
        }

        this.panoram.addSceneObject(item.particle);
        cache.animGroup.push(item);
    }

    /**
     * 获取当前的缓存对象
     * @param {any} id 场景id
     */
    static getCurrent(id) {
        const data = this.maps[id];

        if (data) {
            return data;
        } else {
            const group = new Group();
            this.panoram.addSceneObject(group);

            return this.maps[id] = {
                domGroup: [],
                meshGroup: group,
                animGroup: []
            }
        }
    }

    /**
     * 点击 canvas
     */
    static onCanvasClick(event) {
        const element = this.panoram.webgl.domElement;
        const pos = {
            x: (event.clientX / element.clientWidth) * 2 - 1,
            y: -(event.clientY / element.clientHeight) * 2 + 1
        };
        
        try {
            const group = this.getCurrent(this.cid).meshGroup;

            if (group.children) {
                this.raycaster.setFromCamera(pos, this.panoram.getCamera());
                const intersects = this.raycaster.intersectObjects(group.children, false);
                if (intersects.length > 0) {
                    this.onOverlayClick(intersects[0].object['data']);
                }
            }
        } catch(e) {
            Log.errorLog(e);
        }
    }

    /**
     * 点击覆盖物
     */
    static onOverlayClick(data, e?) {
        const panoram = this.panoram;

        panoram.dispatch('overlayClick', data);
        switch (data.actionType) {
            case 'scene':
                // TODO: go next scene
                panoram.enterNext(null);
                break;
            case 'link':
                window.open(data.linkUrl, '_blank');
                break;
        }
    }

    /**
     * 获取屏幕坐标
     */
    static getScreenPosition(location) {
        const position = new Vector3(location.x, location.y, location.z);
        // world coord to screen coord
        return position.project(this.panoram.getCamera());
    }

    /**
     * 删除当前场景下的所有 overlays
     */
    static removeOverlays() {
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
    static hideOverlays(data, isclean) {
        const panoram = this.panoram;

        if (data) {
            data.domGroup.forEach(item => {
                item.hide();
                isclean && panoram.removeDomObject(item.elem);
            });

            if (data.meshGroup.children) {
                data.meshGroup.children.forEach(item => item.visible = false);
                isclean && panoram.removeSceneObject(data.meshGroup);
            }

            data.animGroup.forEach(item => {
                item.hide();
                isclean && panoram.removeSceneObject(item);
            });
        }
    }

    static showOverlays(data) {
        if (data) {
            data.domGroup.forEach(item => item.show());
            data.meshGroup.children.forEach(item => item.visible = true);
            data.animGroup.forEach(item => item.show());
        }
    }
}