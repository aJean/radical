import {WebGLRenderer, Scene, CubeTextureLoader, PerspectiveCamera, Vector3, BackSide, MeshBasicMaterial, SphereGeometry, Mesh, CubeRefractionMapping} from 'three';
import OrbitControl from './controls/orbitControl';
import DeviceControl from './controls/deviceControl';
import EventEmitter from './event';
import Log from './log';
import Loader from './loader';
import {isMobile} from './util';

/**
 * @file 全景渲染
 */

const defaultOpts = {
    fov: 55,
    fog: null
};

export default class Panoram {
    source = null;
    opts = null;
    root = null;
    webgl = null;
    scene = null;
    camera = null;
    skyBox = null;
    orbitControl = null;
    deviceControl = null;
    currentScene = null;
    event = new EventEmitter();
    loader = new CubeTextureLoader();
    group = [];
    pluginList = [];
    animateList = [];

    constructor(opts?) {
        this.opts = Object.assign({}, defaultOpts, opts);
        this.initEnv();
        this.initControl();
    }

    initEnv() {
        const opts = this.opts;
        const root = this.root = opts.el;
        const width = opts.width || root.clientWidth || window.innerWidth;
        const height = opts.height || root.clientHeight || window.innerHeight;
        // 渲染器
        const webgl = this.webgl = new WebGLRenderer({alpha: true, antialias: true});
        webgl.autoClear = true;
        webgl.setPixelRatio(window.devicePixelRatio);
        webgl.setSize(width, height);
        // 容器 element
        root.className = 'panoram-root';
        root.appendChild(webgl.domElement);
        // 场景, 相机
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(opts.fov, width / height, 0.1, 10000);
        // fog ?
    }

    initControl() {
        const control = this.orbitControl = new OrbitControl(this.camera, this.webgl.domElement);

        control.enableZoom = true;
        control.enablePan = false;
        control.rotateSpeed = -0.2;
        control.target = new Vector3(0, 0, 1);
        control.target0 = new Vector3(0, 0, 1);

        this.setLook();

        if (isMobile) {
            this.deviceControl = new DeviceControl(this.camera, control);
        }
    }

    /**
     * 渲染预览图纹理
     * @param {Object} texture 纹理贴图 
     */
    initMesh(texture) {
        const material = new MeshBasicMaterial({
            envMap: texture,
            side: BackSide,
            refractionRatio: 0,
            reflectivity: 1
        });
        const geometry = new SphereGeometry(2000, 32, 16);
        const skyBox = this.skyBox = new Mesh(geometry, material);

        this.scene.add(skyBox);
        this.dispatch('previewAttach');
    }

    /**
     * 初始化资源配置
     * @param {Object} source 配置对象 
     */
    initSource(source) {
        const group = this.group = source.sceneGroup;
        const scene = group.find(item => item.id == source.defaultSceneId);

        this.currentScene = scene || group[0];

        return scene;
    }

    updateControl() {
        if (this.deviceControl && this.deviceControl.enabled) {
            this.deviceControl.update();
        } else {
            this.orbitControl.update();
        }
        // labelControl ?
    }

    setLook (valueH?, valueV?) {
        valueH = valueH ? valueH / 180 * Math.PI : Math.PI;
        valueV = valueV ? valueV / 180 * Math.PI : Math.PI / 2;

        this.orbitControl.setSphericalAngle(valueH, valueV);
        this.orbitControl.reset();
    }

    subscribe(type, fn, context) {
        this.event.on(type, fn, context);
    }

    unsubscribe(type, fn, context) {
        this.event.removeListener(type, fn, context);
    }

    dispatch(type, args?) {
        this.event.emit(type, args);
    }

    /**
     * 安装动画
     * @param {Object} Animaiton 
     */
    addAnimation(Animaiton) {
        const animate = new Animaiton(this);
        this.animateList.push(animate);
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

    render() {
        this.webgl.render(this.scene, this.camera);
    }

    /**
     * 渲染场景贴图
     * @param {Object} texture 场景原图纹理
     */
    replaceTexture(texture) {
        texture.mapping = CubeRefractionMapping;
        texture.needsUpdate = true;

        const tempTex = this.skyBox.material.envMap;
        this.skyBox.material.envMap = texture;
        tempTex.dispose();
        // 触发场景添加事件
        this.dispatch('sceneAttach', this.currentScene);
    }

    animate() {
        this.updateControl();
        this.dispatch('renderProcess', this.currentScene);
        this.render();

        requestAnimationFrame(this.animate.bind(this));
    }

    resize() {
        const opts = this.opts;
        const root = this.root;
        const camera = this.camera;
        const width = opts.width || root.clientWidth || window.innerWidth;
        const height = opts.height || root.clientHeight || window.innerHeight;
console.log(root.clientHeight)
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        this.webgl.setSize(width, height);
    }

    getCamera() {
        return this.camera;
    }

    getCanvas() {
        return this.webgl.domElement;
    }

    getRoot() {
        return this.root;
    }

    getScene() {
        return this.scene;
    }

    addObject(obj) {
        this.scene.add(obj);
    }

    /**
     * 进入下一个场景
     * @param {Object} data 场景数据
     */
    enterNext(data) {
        if (!data) {
            return Log.errorLog('no scene data provided');
        }

        this.currentScene = data;
        Loader.loadSceneTex(data.bxlPath)
            .then(textures => {
                if (textures) {
                    this.loader.load(textures, tex => this.replaceTexture(tex));
                } else {
                    Log.errorLog('load textures error');
                }
            }).catch(e => Log.errorLog(e));
    }
}