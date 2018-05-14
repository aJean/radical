import {WebGLRenderer, Scene, PerspectiveCamera, Vector3, PCFSoftShadowMap, Math as TMath} from 'three';
import OrbitControl from './controls/orbit.control';
import GyroControl from './controls/gyro.control';
import ResourceLoader from './loaders/resource.loader';
import Tween from './animations/tween.animation';
import Overlays from './overlays/overlays';
import Inradius from './plastic/inradius.plastic';
import EventEmitter from '../core/event';
import Log from '../core/log';
import Util from '../core/util';

/**
 * @file 全景渲染
 */

const defaultOpts = {
    gyro: false,
    fov: 100,
    width: null,
    height: null,
    sceneTrans: false
};
const myLoader = new ResourceLoader();
export default class Pano {
    overlays: Overlays;
    source: any;
    size: any;
    opts = null;
    root = null;
    webgl = null;
    scene = null;
    camera = null;
    skyBox = null;
    orbit = null;
    gyro = null;
    currentData = null;
    frozen = true;
    event = new EventEmitter();
    pluginList = [];

    constructor(el, source) {
        const data = this.currentData = Util.findScene(source);

        this.opts = Object.assign({el}, defaultOpts, source['pano']);
        this.source = source;
        this.initEnv(data);
    }

    initEnv(data) {
        const opts = this.opts;
        const container = opts.el;
        const size = this.size = Util.calcRenderSize(container, opts);
        const root = this.root = Util.createElement(`<div class="pano-root"></div>`);
        const webgl = this.webgl = new WebGLRenderer({alpha: true});
        // webgl
        webgl.autoClear = true;
        webgl.setPixelRatio(window.devicePixelRatio);
        webgl.setSize(size.width, size.height);
        // canvas
        root.appendChild(webgl.domElement);
        container.appendChild(root);
        // 场景, 相机
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(data.fov || opts.fov, size.aspect, 0.1, 10000);
        // control
        const orbit = this.orbit = new OrbitControl(this.camera, webgl.domElement, this);
        if (opts.gyro) {
            this.gyro = new GyroControl(this.camera, orbit);
        }
        // all overlays manager
        this.overlays = new Overlays(this, this.source['sceneGroup']);
    }

    resetEnv(data) {
        const fov = data.fov || this.opts.fov;
        const camera = this.camera;
        // scene fov        
        if (fov != camera.fov) {
            this.setFov(fov);
        }
        // look at angle
        if (data.lng !== void 0) {
            this.setLook(data.lng, data.lat);
        }
    }

    async run() {
        const source = this.source;
        source['cretPath'] && myLoader.loadCret(source['cretPath']);

        try {
            // push pano obj for client
            this.dispatch('scene-create', this);
            const data = this.currentData;
            const img = await myLoader.loadTexture(data.imgPath, 'canvas');
            const skyBox = this.skyBox = new Inradius({envMap: img});

            skyBox.addTo(this.scene);
            this.dispatch('scene-init', data, this);
            this.render();

            await myLoader.loadTexture(data.bxlPath || data.texPath)
                .then(texture => {
                    this.skyBox.setMap(texture);
                    this.dispatch('scene-load', data, this);
                }).catch(e => Log.output(e));
            this.animate();
        } catch(e) {
            Log.output(e);
        }
    }

    /**
     * 在渲染帧中更新控制器
     */
    updateControl() {
        const control = this.gyro || this.orbit;
        !this.frozen && control.update();
    }

    /**
     * 设置相机角度, 相机方向 (0, 0, -1), 相对初始 z 轴正方向 (180, 90)
     * @param {number} lng 横向角度
     * @param {number} lat 纵向角度
     */
    setLook(lng?, lat?) {
        const control = this.orbit;

        if (lng !== undefined && lat !== undefined) {
            const theta = (180 - lng) * (Math.PI / 180);
            const phi = (90 - lat) * (Math.PI / 180);

            control.reset();
            control.rotateLeft(theta);
            control.rotateUp(phi);
        }
    }
    
    /**
     * 获取相机角度
     */
    getLook() {
        const control = this.orbit;
        const theta = control.getAzimuthalAngle();
        const phi = control.getPolarAngle();

        return {
            lng: theta * 180 / Math.PI,
            lat: phi * 180 / Math.PI
        };
    }

    /**
     * 设置视角
     * @param {number} fov 视角
     * @param {number} duration 时长
     */
    setFov(fov, duration?) {
        const camera = this.getCamera();
        
        if (this.opts.fovTrans) {
            new Tween(camera).to({fov}).effect('quadEaseOut', duration || 1000)
                .start(['fov'], this).process(() => camera.updateProjectionMatrix());
        } else {
            camera.fov = fov;
            camera.updateProjectionMatrix();
        }
    }

    /**
     * 获取视角
     */
    getFov() {
        return this.getCamera().fov;
    }

    /**
     * 恢复视角
     */
    resetFov() {
        const camera = this.camera;
        camera.fov = this.opts.fov;
        camera.updateProjectionMatrix();
    }

    /**
     * 安装插件并注入属性
     * @param {Object} Plugin 插件 class
     * @param {Object} data 插件数据
     */
    addPlugin(Plugin, data?) {
        const plugin = new Plugin(this, data);
        this.pluginList.push(plugin);
    }

    subscribe(type, fn, context?) {
        this.event.on(type, fn, context);
    }

    unsubscribe(type, fn, context?) {
        this.event.off(type, fn, context);
    }

    dispatch(type, arg1?, arg2?, arg3?) {
        this.event.emit(type, arg1, arg2, arg3);
    }

    /**
     * 渲染场景贴图
     * @param {Object} texture 场景原图纹理
     */
    replaceTexture(texture) {
        this.dispatch('scene-attachstart', this.currentData, this);

        this.skyBox.setMap(texture);
        // 触发场景切换事件
        setTimeout(() => this.dispatch('scene-attach', this.currentData, this), 100);
    }

    /**
     * 动画效果切换场景贴图
     * @param {Object} texture 场景原图纹理
     */
    replaceAnim(texture) {
        this.dispatch('scene-attachstart', this.currentData, this);
        
        const skyBox = this.skyBox;
        const oldMap = skyBox.getMap();
        const newBox = new Inradius({
            envMap: texture,
            transparent: true,
            opacity: 0
        });

        newBox.addTo(this.scene);
        newBox.fadeIn(this, () => {
            skyBox.setMap(texture);
            newBox.dispose();
            // 触发场景切换事件
            this.dispatch('scene-attach', this.currentData, this);
        });
    }

    /**
     * 帧渲染
     */
    animate() {
        this.updateControl();
        this.dispatch('render-process', this.currentData, this);
        this.render();

        requestAnimationFrame(this.animate.bind(this));
    }

    render() {
        this.webgl.render(this.scene, this.camera);
    }

    /**
     * 窗口变化响应事件
     */
    onResize() {
        const camera = this.getCamera();
        const root = this.getRoot();
        const size =  this.size = Util.calcRenderSize(root);

        camera.aspect = size.aspect;
        camera.updateProjectionMatrix();
        this.webgl.setSize(size.width, size.height);
    }

    /**
     * 获取相机
     */
    getCamera() {
        return this.camera;
    }

    /**
     * 获取画布元素
     */
    getCanvas() {
        return this.webgl.domElement;
    }

    /**
     * 获取容器元素
     */
    getRoot() {
        return this.root;
    }

    /**
     * 获取场景对象
     */
    getScene() {
        return this.scene;
    }

    /**
     * 获取轨道控制器
     */
    getControl() {
        return this.orbit;
    }

    /**
     * 设置旋转速度
     */
    setRotateSpeed(speed) {
        this.orbit.autoRotateSpeed = speed;
    }

    /**
     * 设置旋转
     */
    setRotate(flag) {
        this.orbit.autoRotate = flag;
    }

    /**
     * 获取 camera lookat 目标的 vector3 obj
     */
    getLookAtTarget() {
        return this.orbit.target;
    }

    /**
     * 添加 object3d 对象
     */
    addSceneObject(obj) {
        this.scene.add(obj);
    }

    /**
     * 删除 object3d 对象
     */
    removeSceneObject(obj) {
        this.scene.remove(obj);
    }

    /**
     * 添加 dom 对象
     */
    addDomObject(obj) {
        this.root.appendChild(obj);
    }

    /**
     * 删除 dom 对象
     */
    removeDomObject(obj) {
        this.root.removeChild(obj);
    }

    /**
     * 添加热点覆盖物, default = dom
     */
    addOverlay(data) {
        data.type = data.type || 'dom';
        return this.overlays.create([{...data}]);
    }

    /**
     * 删除热点覆盖物, 目前仅支持 dom
     */
    removeOverlay(data) {
        this.overlays.delete(data);
    }

    /**
     * 为 overlays 补充场景数据
     */
    supplyOverlayScenes(scenes) {
        this.overlays.addScenes(scenes);
    }

    /**
     * 获取组件尺寸
     */
    getSize() {
        return this.size;
    }

    /**
     * 开启阴影
     */
    enableShadow() {
        this.webgl.shadowMap.enabled = true;
        this.webgl.shadowMap.type = PCFSoftShadowMap;
    }

    /**
     * 关闭阴影
     */
    disableShadow() {
        this.webgl.shadowMap.enabled = false;
    }
    
    /**
     * internal enter next scene
     * @param {Object} data scene data
     */
    enterNext(data) {
        return myLoader.loadTexture(data.bxlPath || data.texPath)
            .then(texture => {
                this.currentData = data;
                this.resetEnv(data);
                this.opts.sceneTrans ? this.replaceAnim(texture) : this.replaceTexture(texture);
            }).catch(e => Log.output(e));
    }

    /** 
     * 启动控制器
     */
    startControl() {
        if (this.gyro && !this.gyro.enabled) {
            this.gyro.connect();
        }
        
        this.orbit.enabled = true;
    }

    /** 
     * 停止控制器
     */
    stopControl() {
        if (this.gyro) {
            this.gyro.disconnect();
            delete this.gyro;
        }

        this.orbit.enabled = false;
        delete this.orbit;
    }

    /** 
     * 开场动画结束, 控制器需要在这时候开启
     */
    noTimeline() {
        // to judgement scene-ready and scene-load which is first
        this.frozen = false;
        this.startControl();
        // entrance animation end, scene become stable
        this.dispatch('scene-ready', this.currentData, this);
    }

    /** 
     * 释放资源
     */
    dispose() {
        Util.cleanup(null, this.scene);

        this.stopControl();
        this.dispatch('render-dispose', this);
        this.event.removeAllListeners();
        this.webgl.dispose();
        this.root.innerHTML = '';
    }
}