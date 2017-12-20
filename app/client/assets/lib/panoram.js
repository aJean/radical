import OrbitControl from './controls/OrbitControl';
import EventEmitter from './event';
import {fetch} from './loader';

/**
 * @file 全景渲染
 */

const defaultOpts = {
    fov: 55,
    fog: null
};

export default class Panoram {
    root = null;
    opts = null;
    webgl = null;
    scene = null;
    camera = null;
    orbitControl = null;
    event = new EventEmitter();
    loader = new THREE.CubeTextureLoader();

    constructor(opts) {
        this.opts = Object.assign({}, defaultOpts, opts);
    }

    run(url) {
        fetch(url).then(ret => {
            this.init();
            this.initControl();
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

        control.reset();
    }

    setLook (valueH, valueV) {
        valueH = valueH ? valueH / 180 * Math.PI : Math.PI;
        valueV = valueV ? valueV / 180 * Math.PI : Math.PI / 2;

        this.orbitControl.setSphericalAngle(valueH, valueV);
    }

    subscribe(data) {
        const event = this.event;
        for (let type in data) {
            event.on(type, data[type]);
        }
    }

    dispatch(type, args) {
        this.event.emmit(type, args);
    }
}