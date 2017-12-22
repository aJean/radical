import OrbitControl from './controls/orbitControl';
import DeviceControl from './controls/deviceControl';
import EventEmitter from './event';
import Log from './log';
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
    event = new EventEmitter();
    loader = new THREE.CubeTextureLoader();
    pluginList = [];
    animateList = [];

    constructor(opts) {
        this.opts = Object.assign({}, defaultOpts, opts);
        this.initEnv();
        this.initControl();
    }

    initEnv() {
        const opts = this.opts;
        const root = this.root = document.querySelector(opts.el);
        const width = opts.width || root.clientWidth || window.innerWidth;
        const height = opts.height || root.clientHeight || window.innerHeight;
        // 渲染器
        const webgl = this.webgl = new THREE.WebGLRenderer({alpha: true, antialias: true});
        webgl.autoClear = true;
        webgl.setPixelRatio(window.devicePixelRatio);
        webgl.setSize(width, height);
        webgl.setFaceCulling(THREE.CullFaceNone);
        root.appendChild(webgl.domElement);
        // 场景, 相机
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(opts.fov, width / height, 0.1, 10000);
        // fog ?
    }

    initControl() {
        const control = this.orbitControl = new OrbitControl(this.camera, this.webgl.domElement);

        control.enableZoom = true;
        control.enablePan = false;
        control.rotateSpeed = -0.2;
        control.target = new THREE.Vector3(0, 0, 1);
        control.target0 = new THREE.Vector3(0, 0, 1);

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
        const material = new THREE.MeshBasicMaterial({
            envMap: texture,
            side: THREE.BackSide,
            refractionRatio: 0,
            reflectivity: 1
        });
        const geometry = new THREE.SphereGeometry(2000, 32, 16);
        const skyBox = this.skyBox = new THREE.Mesh(geometry, material);

        this.scene.add(skyBox);
        this.dispatch('previewLoaded');
    }

    /**
     * 初始化资源配置
     * @param {Object} source 配置对象 
     */
    initSource(source) {
        const group = source.sceneGroup;
        const scene = group.find(item => item.id == source.defaultSceneId);

        this.currentScene = scene;
        this.sceneList = group;

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

    setLook (valueH, valueV) {
        valueH = valueH ? valueH / 180 * Math.PI : Math.PI;
        valueV = valueV ? valueV / 180 * Math.PI : Math.PI / 2;

        this.orbitControl.setSphericalAngle(valueH, valueV);
        this.orbitControl.reset();
    }

    subscribe(type, fn) {
        this.event.on(type, fn);
    }

    dispatch(type, args) {
        this.event.emit(type, args);
    }

    /**
     * 安装插件并注入属性
     * @param {Object} plugin 插件对象
     */
    addPlugin(plugin) {
        plugin.panrom = this;
        plugin.canvas = this.webgl.domElement;

        this.pluginList.push(plugin);
    }

    updatePlugins() {}

    addAnimation(Animaiton) {
        const animate = new Animaiton(this.camera);
        animate.play();

        this.animateList.push(animate);
    }

    updateAnimation() {
        const list = this.animateList;

        if (list.length) {
            list.forEach((animate, i) => {
                if (animate.end) {
                    list.splice(i, 1);
                    this.dispatch('animationEnd', animate);
                } else {
                    animate.update();
                }
            });
        }
    }

    render(first) {
        this.dispatch('beforeRender');
        
        this.webgl.render(this.scene, this.camera);
        this.dispatch('afterRender');
    }

    replaceTexture(texture) {
        texture.mapping = THREE.CubeRefractionMapping;
        texture.needsUpdate = true;

        const tempTex = this.skyBox.material.envMap;
        this.skyBox.material.envMap = texture;
        tempTex.dispose();

        // WebVR.labelControl.showSceneLabel(currentSceneObj);
    }

    animate() {
        this.updateControl();
        this.updateAnimation();
        // this.updatePlugin();

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
}