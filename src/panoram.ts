import {WebGLRenderer, Scene, CubeTextureLoader, PerspectiveCamera, Vector3, BackSide, MeshBasicMaterial, SphereGeometry, Mesh, CubeRefractionMapping} from 'three';
import OrbitControl from './controls/orbitControl';
import DeviceControl from './controls/deviceControl';
import EventEmitter from './event';
import Log from './log';
import Loader from './loader';
import Util from './util';

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
        // look at front
        control.target = new Vector3(0, 0, 1);
        control.target0 = new Vector3(0, 0, 1);
        // TODO: let user set camera direction ?
        this.setLook();

        if (Util.isMobile) {
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
        this.dispatch('preview-attach');
    }

    /**
     * 初始化资源配置
     * @param {Object} source 配置对象 
     */
    initSource(source) {
        const group = this.group = source.sceneGroup;
        const scene = group.find(item => item.id == source.defaultSceneId);

        return (this.currentScene = scene || group[0]);
    }

    updateControl() {
        if (this.deviceControl && this.deviceControl.enabled) {
            this.deviceControl.update();
        } else {
            this.orbitControl.update();
        }
    }

    setLook (lng?, lat?) {
        if (lng !== undefined) {
            const theta = (lng) * (Math.PI / 180);
            const phi = (90 - lat) * (Math.PI / 180);

            this.orbitControl.setSphericalAngle(theta, phi);
            this.orbitControl.reset();
        }
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
     * @param {boolean} slient 安静模式
     */
    replaceTexture(texture, slient?) {
        texture.mapping = CubeRefractionMapping;
        texture.needsUpdate = true;

        const tempTex = this.skyBox.material.envMap;
        this.skyBox.material.envMap = texture;
        tempTex.dispose();
        // 触发场景切换事件
        !slient && this.dispatch('scene-attach', this.currentScene);
    }

    animate() {
        this.updateControl();
        this.dispatch('render-process', this.currentScene);
        this.render();

        requestAnimationFrame(this.animate.bind(this));
    }

    resize() {
        const opts = this.opts;
        const root = this.root;
        const camera = this.camera;
        const width = opts.width || root.clientWidth || window.innerWidth;
        const height = opts.height || root.clientHeight || window.innerHeight;

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

    getSize() {
        return {
            width: this.root.clientWidth,
            height: this.root.clientHeight
        };
    }
    
    getLookAtTarget() {
        return this.orbitControl.target;
    }

    addSceneObject(obj) {
        this.scene.add(obj);
    }

    removeSceneObject(obj) {
        this.scene.remove(obj);
    }

    addDomObject(obj) {
        this.root.appendChild(obj);
    }

    removeDomObject(obj) {
        this.root.removeChild(obj);
    }

    /**
     * enter next scene
     * @param {Object} data scene data or id
     */
    enterNext(data) {
        if (typeof data === 'string') {
            data = this.group && this.group.find(item => item.id == data);
        }

        if (!data) {
            return Log.errorLog('no scene data provided');
        }

        Loader.loadSceneTex(data.bxlPath)
            .then(textures => {
                if (textures) {
                    this.loader.load(textures, tex => {
                        this.currentScene = data;
                        this.replaceTexture(tex);
                    });
                } else {
                    Log.errorLog('load textures error');
                }
            }).catch(e => Log.errorLog(e));
    }

    dispose() {
        function cleanup(parent, target) {
            if (target.children.length) {
                target.children.forEach(item => cleanup(target, item));
            } else if (parent) {
                parent.remove(target);
            }
        }

        cleanup(null, this.scene);
        this.event.removeAllListeners();
        this.webgl.dispose();
        this.root.innerHTML = '';
    }
}