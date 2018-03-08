import {WebGLRenderer, Scene, PerspectiveCamera, Vector3, Math as TMath} from 'three';
import OrbitControl from './controls/orbitControl';
import GyroControl from './controls/gyroControl';
import EventEmitter from './event';
import Log from './log';
import Util from './util';
import ResourceLoader from './loaders/resource.loader';
import Tween from './animations/tween.animation';
import Overlays from './overlays/overlays.overlay';
import Inradius from './plastic/inradius.plastic';

/**
 * @file 全景渲染
 */

const defaultOpts = {
    el: undefined,
    fov: 100,
    gyro: false,
    width: null,
    height: null,
    sceneTrans: false
};
const myLoader = new ResourceLoader();
export default class Pano {
    overlays: Overlays;
    source: any;
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

    constructor(opts, source) {
        const data = this.currentData = Util.findScene(source);
        opts = Object.assign({}, defaultOpts, opts);

        if (data.fov) {
            opts.fov = data.fov;
        }

        this.opts = opts;
        this.source = source;
        this.initEnv();
        this.dispatch('scene-create', this);
    }

    initEnv() {
        const opts = this.opts;
        const container = opts.el;
        const size = Util.calcRenderSize(opts, container);
        const root = this.root = Util.createElement('<div class="pano-root" style="width:'
            + size.width + 'px;height:' + size.height + 'px;"></div>');
        // 渲染器
        const webgl = this.webgl = new WebGLRenderer({alpha: true, antialias: true});
        webgl.autoClear = true;
        webgl.setPixelRatio(window.devicePixelRatio);
        webgl.setSize(size.width, size.height);
        // 容器
        root.appendChild(webgl.domElement);
        container.appendChild(root);
        // 场景, 相机
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(opts.fov, size.aspect, 0.1, 10000);
        // 场景控制器
        const control = this.orbit = new OrbitControl(this.camera, webgl.domElement);
        // 陀螺仪控制器
        if (opts.gyro) {
            this.gyro = new GyroControl(this.camera, control);
        }
        // bind overlays events
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
        this.setLook(data.lng || 180, data.lat || 90);
    }

    async run() {
        const source = this.source;
        // set pem path
        myLoader.loadCret(source['cretPath']);

        try {
            const data = this.currentData;
            // load preview
            const img = await myLoader.loadTexture(data.imgPath, 'canvas');
            const skyBox = this.skyBox = new Inradius({envMap: img});
            skyBox.addTo(this.scene);
            // preview init
            this.dispatch('scene-init', data, this);
            this.render();
            // load bxl
            await myLoader.loadTexture(data.bxlPath || data.texPath)
            .then(texture => {      
                this.skyBox.setMap(texture);
                // bxl loaded
                this.dispatch('scene-ready', data, this);
            }).catch(e => Log.output('load scene: load source texture fail'));
            // start render process
            this.animate();
        } catch(e) {
            Log.output(e)
        }
    }

    /**
     * 在渲染帧中更新控制器
     */
    updateControl() {
        const control = this.gyro && this.gyro.enabled ? this.gyro : this.orbit;
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
    addPlugin(Plugin, data) {
        const plugin = new Plugin(this, data);
        this.pluginList.push(plugin);
    }

    subscribe(type, fn, context?) {
        this.event.on(type, fn, context);
    }

    unsubscribe(type, fn, context?) {
        this.event.off(type, fn, context);
    }

    dispatch(type, arg1?, arg2?) {
        this.event.emit(type, arg1, arg2);
    }

    /**
     * 渲染场景贴图
     * @param {Object} texture 场景原图纹理
     */
    replaceTexture(texture) {
        this.dispatch('scene-attachstart', this.currentData, this);

        this.skyBox.setMap(texture);
        // 触发场景切换事件
        this.dispatch('scene-attach', this.currentData, this);
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
        const size =  Util.calcRenderSize(this.opts, root);

        camera.aspect = size.aspect;
        camera.updateProjectionMatrix();
        this.webgl.setSize(size.width, size.height);
        // set root element's size
        Util.styleElement(root, {
            width: size.width,
            height: size.height
        });
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
     * 获取控制器
     */
    getControl() {
        return this.orbit;
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
     * 添加热点覆盖物, 目前支持 mesh
     */
    addOverlay(location, text) {
        const data = {
            'overlays': [{
                type: 'dom',
                actionType: 'custom',
                content: '<strong>动态热点</strong>',
                location: {
                    lng: location.lng,
                    lat: location.lat
                }
            }]
        };

        this.overlays.create(data);
    }

    /**
     * internal enter next scenel
     * @param {Object} data scene data
     */
    enterNext(data) {
        return myLoader.loadTexture(data.bxlPath || data.texPath)
            .then(texture => {
                this.currentData = data;
                this.resetEnv(data);
                this.opts.sceneTrans ? this.replaceAnim(texture) : this.replaceTexture(texture);
            }).catch(e => Log.output('load scene: load source texture fail'));
    }

    /** 
     * 启动陀螺仪
     */
    startGyroControl() {
        if (this.gyro && !this.gyro.enabled) {
            this.gyro.connect();
        }
    }

    /** 
     * 停止陀螺仪
     */
    stopGyroControl() {
        if (this.gyro) {
            this.gyro.disconnect();
            delete this.gyro;
        }
    }

    /** 
     * 开场动画结束
     */
    noTimeline() {
        this.frozen = false;
        this.startGyroControl();
    }

    /** 
     * 释放资源
     */
    dispose() {
        Util.cleanup(null, this.scene);

        this.stopGyroControl();
        this.dispatch('render-dispose', this);
        this.event.removeAllListeners();
        this.webgl.dispose();
        this.root.innerHTML = '';
    }
}