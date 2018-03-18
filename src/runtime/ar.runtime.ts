import {WebGLRenderer, Scene, PerspectiveCamera, TextureLoader, BoxBufferGeometry, MeshBasicMaterial, Mesh} from 'three';
import Util from '../util';

/**
 * @file web ar
 * @TODO: use corner to set box's world position
 * http://bhollis.github.io/aruco-marker/demos/angular.html
 */

const AR = window['AR'];
export default class Runtime {
    detector: any;
    video: any;
    canvas: any;
    context: any;
    webgl: any;
    render: any;
    scene: any;
    camera: any;
    mesh: any;

    constructor() {
        const constraints = {audio: false, video: {facingMode: 'environment'}};
        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
            const video = this.video;

            if ('srcObject' in video) {
                video.srcObject = stream;
            } else {
                video.src = window.URL.createObjectURL(stream);
            }

            video.onloadedmetadata = e => video.play();
        }).catch(function(err) {
            alert(err);
        });

        this.detector = new AR.Detector();
        
        this.createDom();
        this.createRender();
        this.tick();
    }

    createDom() {
        const video = this.video = Util.createElement(`<video class="ar-video" style="position:relative;z-index:1;" autoplay playsinline></video>`);
        const canvas:any = this.canvas = Util.createElement(`<canvas width="300" height="300"></canvas>`);

        this.context = canvas.getContext("2d");
        
        document.body.appendChild(video);
    }

    createRender() {
        
        const webgl = this.webgl = new WebGLRenderer({alpha: true, antialias: true});
        const render = this.render = webgl.domElement;

        webgl.setPixelRatio(window.devicePixelRatio);
        webgl.setSize(window.innerWidth, window.innerHeight);
        Util.styleElement(render, {
            position: 'absolute',
            display: 'none',
            left: 0,
            top: 0,
            zIndex: '999'
        });

        document.body.appendChild(render);

        const scene = this.scene = new Scene();
        const camera = this.camera = new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.set(0, 0, 600);
        
        const texture = new TextureLoader().load('../assets/webar/material.gif');
        const geometry = new BoxBufferGeometry(200, 200, 200);
        const material = new MeshBasicMaterial({map: texture});
        const mesh = this.mesh = new Mesh(geometry, material);

        scene.add(mesh);

        webgl.render(scene, camera);
    }

    tick() {
        requestAnimationFrame(this.tick.bind(this));

        this.webgl.render(this.scene, this.camera);
        this.mesh.rotation.x += 0.005;
        this.mesh.rotation.y += 0.01;

        const video = this.video;
        const canvas = this.canvas;
        const context = this.context;
        const detector = this.detector;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const data = context.getImageData(0, 0, canvas.width, canvas.height);

        const markers = detector.detect(data);
        
        if (markers.length) {
            const marker = markers[0];
            this.show3d(marker);
        } else {
            this.hide3d();
        }
    }

    show3d(marker) {
        const left = marker.corners[0];
        const render = this.render;

        render.style.display = 'block'
        // render.style.left = left.x + 'px';
        // render.style.top = left.y + 'px';
    }

    hide3d() {
        this.render.style.display = 'none';
    }
}