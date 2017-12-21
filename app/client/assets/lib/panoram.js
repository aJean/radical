import OrbitControl from './controls/OrbitControl';
import DeviceControl from './controls/deviceOrientationControls';
import EventEmitter from './event';
import Log from './log';
import {fetch, loadPreviewTex, loadSceneTex} from './loader';
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

    constructor(opts) {
        this.opts = Object.assign({}, defaultOpts, opts);
    }

    run(url) {
        fetch(url).then(ret => {
            console.log(ret);
            if (ret && ret.sceneGroup && ret.defaultSceneId) {
                this.source = ret;
                this.init();
                this.initControl();
    
                return this.getScene(ret.defaultSceneId);
            } else {
                Log.errorLog('load source error');
            }
        // 预览场景
        }).then(scene => {
            if (scene) {
                this.currentScene = scene;
                return loadPreviewTex(scene.panoPath);
            } else {
                Log.errorLog('get preview scene error');
            }
        // 场景贴图
        }).then(texture => {
            if (texture) {
                this.initMesh(texture);
                this.animate();
                return loadSceneTex(this.currentScene.panoPath);
            } else {
                Log.errorLog('load preview texture error');
            }
        // 完整场景
        }).then(textures => {
            if (textures) {
                this.loader.load(textures, tex => this.replaceTexture(tex));
            } else {
                Log.errorLog('load textures error');
            }
        });
    }

    init() {
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
        const control = this.orbitControl = new OrbitControl(this.camera, this.root);

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

        this.addToScene(skyBox);
        this.dispatch('previewLoaded');
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

    subscribe(data) {
        const event = this.event;
        for (let type in data) {
            event.on(type, data[type]);
        }
    }

    dispatch(type, args) {
        this.event.emit(type, args);
    }

    /**
     * 安装插件并注入属性
     * @param {Object} plugin 插件对象
     */
    installPlugin(plugin) {
        plugin.panrom = this;
        plugin.canvas = this.webgl.domElement;
    }

    getScene(id) {
        const group = this.source.sceneGroup;
        return group.find(item => item.id == id);
    }

    addToScene(obj) {
        this.scene.add(obj);
    }

    renderScene(first) {
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
        this.renderScene();
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