import {WebGLRenderer, Scene, PerspectiveCamera, PCFSoftShadowMap} from 'three';
import OrbitControl from './controls/orbit.control';
import GyroControl from './controls/gyro.control';
import ResourceLoader from './loaders/resource.loader';
import HDMonitor from './hdmap/monitor.hdmap';
import Tween from './animations/tween.animation';
import Overlays from './overlays/overlays';
import Inradius from './plastic/inradius.plastic';
import Log from '../core/log';
import Util from '../core/util';
import History from '../interface/history.interface';

/**
 * @file 全景渲染 & 历史记录
 */

const defaultOpts = {
    gyro: false,
    fov: 100,
    width: null,
    height: null,
    sceneTrans: false
};
const myLoader = new ResourceLoader();
export default class Pano extends History {
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
    reqid = 0;
    currentData = null;
    frozen = true;
    interactable = true;
    pluginList = [];

    constructor(el, source) {
        super();

        this.currentData = Util.findScene(source);
        this.opts = Object.assign({el}, defaultOpts, source['pano']);
        this.source = source;

        this.initEnv();
    }

    /**
     * 初始化环境, 创建 webgl, scene, camera
     */
    initEnv() {
        const opts = this.opts;
        const data = this.currentData;
        const size = this.size = Util.calcRenderSize(opts);
        const root = this.root = Util.createElement(`<div class="pano-root"></div>`);
        const webgl = this.webgl = new WebGLRenderer({alpha: true, antialias: true, precision: 'highp'});

        webgl.autoClear = true;
        webgl.setPixelRatio(window.devicePixelRatio);
        webgl.setSize(size.width, size.height);
        // dom
        root.appendChild(webgl.domElement);
        opts.el.appendChild(root);
        // scene camera
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(data.fov || opts.fov, size.aspect, 0.1, 10000);
        // create control
        const orbit = this.orbit = new OrbitControl(this.camera, webgl.domElement, this);
        // 设置初始角度, 需要执行 orbit control update
        if (data.lng !== void 0) {
            this.setLook(data.lng, data.lat);
            orbit.update();
        }

        if (opts.gyro) {
            this.gyro = new GyroControl(this.camera, orbit);
        }

        if (opts.hdm) {
            new HDMonitor(this, opts.hdm);
        }

        if (opts.history) {
            this._setRouter(opts.router);
            this.initState(data);
        }
        
        // all overlays manager
        this.overlays = new Overlays(this, this.source['sceneGroup']);
    }

    /**
     * 重置场景的 fov, lookat
     * @param data 
     */
    resetEnv(data) {
        const fov = data.fov || this.opts.fov;

        // set current scene data
        this.currentData = data;
        // look at angle
        if (!this.gyro && data.lng !== void 0) {
            this.setLook(data.lng, data.lat);
        }
        // scene fov        
        if (fov != this.camera.fov) {
            this.setFov(fov);
        }
    }
    
    /**
     * 执行渲染流水线
     */
    async run() {
        const source = this.source;
        const Topic = this.Topic;
        const data = this.currentData;
        const publishdata = {scene: data, pano: this};
        // has pano instance
        this.publishSync(this.Topic.SCENE.CREATE, publishdata);
        source['cretPath'] && myLoader.loadCret(source['cretPath']);

        try {
            const img = await myLoader.loadTexture(data.imgPath, 'canvas');
            const skyBox = this.skyBox = new Inradius({envMap: img}, this);

            skyBox.addBy(this);
            this.publishSync(Topic.SCENE.INIT, publishdata);
            this.render();
            // high source
            await myLoader.loadTexture(data.bxlPath || data.texPath)
                .then(texture => {
                    skyBox.setMap(texture);
                    this.publishSync(Topic.SCENE.LOAD, publishdata);
                }).catch(e => Log.output(e));
            this.animate();
        } catch(e) {
            Log.output(e);
        }
    }

    /**
     * 在渲染帧中更新控制器, 开场动画时刻 freeze
     */
    updateControl() {
        const control = this.gyro || this.orbit;
        !this.frozen && control.update();
    }

    /**
     * 改变控制器的状态
     * @param {string} state 启用或禁止
     */
    makeControl(state) {
        const control = this.gyro || this.orbit;
        control.enabled = state;
    }

    /**
     * 重置控制器
     */
    resetControl() {
        const control = this.gyro || this.orbit;
        control.reset();
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

        this.orbit.dispose();
        delete this.orbit;
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
            new Tween(camera, this['ref']).to({fov}).effect('quadEaseOut', duration || 1000)
                .start(['fov']).process(() => camera.updateProjectionMatrix());
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
     * @param {Object} external 对外 api
     */
    addPlugin(Plugin, data?, external?) {
        const plugin = new Plugin(this, data, external);
        this.pluginList.push(plugin);
    }

    /**
     * 渲染场景贴图
     * @param {Object} texture 场景原图纹理
     */
    replaceTexture(texture) {
        const publishdata = {scene: this.currentData, pano: this};
        const Topic = this.Topic;

        this.publish(Topic.SCENE.ATTACHSTART, publishdata);
        this.skyBox.setMap(texture);
        setTimeout(() => this.publish(Topic.SCENE.ATTACH, publishdata), 100);
    }

    /**
     * 悄然替换
     * @param {Object} texture
     */
    replaceSlient(texture) {
        this.skyBox.setMap(texture);
    }

    /**
     * 动画效果切换场景贴图
     * @param {Object} texture 场景原图纹理
     */
    replaceAnim(texture) {
        const publishdata = {scene: this.currentData, pano: this};
        const Topic = this.Topic;        
        
        this.publish(Topic.SCENE.ATTACHSTART, publishdata);
        
        const skyBox = this.skyBox;
        const newBox = new Inradius({envMap: texture, opacity: 0}, this);

        newBox.addTo(this.scene);
        newBox.fadeIn(() => {
            skyBox.setMap(texture);
            newBox.dispose();
            this.publish(Topic.SCENE.ATTACH, publishdata);
        });
    }

    /**
     * 帧渲染
     */
    animate() {
        this.updateControl();
        this.render();
        this.publishSync(this.Topic.RENDER.PROCESS, this)

        this.reqid = requestAnimationFrame(this.animate.bind(this));
    }

    render() {
        this.webgl.render(this.scene, this.camera);
    }

    /**
     * 窗口变化响应事件
     */
    onResize() {
        const camera = this.getCamera();
        const size =  this.size = Util.calcRenderSize(this.opts);

        camera.aspect = size.aspect;
        camera.updateProjectionMatrix();
        this.webgl.setSize(size.width, size.height);
    }

    /**
     * 用户设置 size, 会导致 onresize 失效
     * @param {number} width 
     * @param {number} height 
     */
    customSize(width, height) {
        const opts = this.opts;
        const camera = this.getCamera();

        opts.width = width;
        opts.height = height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        this.webgl.setSize(width, height);
    }

    /**
     * 增加历史纪录
     */
    pushState(data) {
        if (!this.opts.history) {
            return;
        }

        super.pushState(data);
    }

    /**
     * 修改历史纪录
     */
    replaceState(data) {
        if (!this.opts.history) {
            return;
        }

        super.replaceState(data);
    }

    /**
     * 处理场景后退, 会发请求获取场景 group
     */
    onPopState(topic, payload) {
        if (!this.opts.history) {
            return;
        }

        const data = payload.data;

        if (!data || !data.sceneid || data.sceneid == this.currentData.id) {
            this.exhaustState();
        } else if (data.sceneid) {
            const id = data.sceneid;
            const setid = data.xrkey;
            const setname = data.setname;

            myLoader.fetchUrl(`https://image.baidu.com/img/image/quanjing/bxlpanoinfo?sf=1&setid=${setid}&sceneid=${id}`)
                .then(res => {
                    const data = res.data;
                    const scenes = data.sceneGroup;
                    const scene = scenes.find(obj => obj.id == id);
                    // for nextpage
                    scene.setName = setname && decodeURIComponent(setname);
                    this.enterNext(scene);
                    this.publish(this.Topic.THRU.BACK, {id, scene, scenes, data});
                });
        }
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
        this.publish(this.Topic.SCENE.RESET, {scenes, pano: this});
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
        const path = data.imgPath;
        const opts = this.opts;
        // replace history
        this.replaceState(data);

        // preTrans defeates sceneTrans
        if (opts.preTrans && path) {
            myLoader.loadTexture(path, 'canvas')
                .then(texture => {
                    this.resetEnv(data);
                    this.replaceTexture(texture);
                    // 清晰图
                    return myLoader.loadTexture(data.bxlPath || data.texPath)
                        .then(texture => this.currentData == data && this.replaceSlient(texture));
                }).catch(e => Log.output(e));
        } else {
            myLoader.loadTexture(data.bxlPath || data.texPath)
                .then(texture => {
                    this.resetEnv(data);
                    opts.sceneTrans ? this.replaceAnim(texture) : this.replaceTexture(texture);
                }).catch(e => Log.output(e));
        }
    }

    /**
     * enter with thru
     * @param {Object} data scene data
     * @param {Object} texture skybox texture to replace
     */
    enterThru(data, texture) {
        // positive direction add history state
        this.pushState(data);
        this.resetEnv(data);
        this.replaceTexture(texture);
    }

    /** 
     * 开场动画结束, 控制器需要在这时候开启
     */
    noTimeline() {
        // to judgement scene-ready and scene-load which is first
        this.frozen = false;
        this.startControl();
        // entrance animation end, scene become stable
        this.publishSync(this.Topic.SCENE.READY, {scene: this.currentData, pano: this});
    }

    /**
     * 锁定全景, click animation ...
     */
    lock() {
        this.interactable = false;
    }

    /**
     * 解锁全景
     */
    unlock() {
        this.interactable = true;
    }

    /** 
     * 释放资源
     */
    dispose() {
        cancelAnimationFrame(this.reqid);
        // delete all subscribes
        super.dispose();
        
        this.stopControl();
        this.pluginList.forEach(plugin => plugin.dispose());
        this.skyBox.dispose();
        this.overlays.dispose();
        
        this.publish(this.Topic.RENDER.DISPOSE, this);
        Util.cleanup(null, this.scene);

        const webgl = this.webgl;
        webgl.dispose();
        webgl.forceContextLoss();
        webgl.context = null;
        webgl.domElement = null;
    }
}