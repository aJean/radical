import {WebGLRenderer, Scene, PerspectiveCamera, TextureLoader, BoxBufferGeometry, MeshBasicMaterial, Mesh} from 'three';
import Util from '../util';

/**
 * @file web ar
 * @TODO: use corner to set box's world position
 * http://bhollis.github.io/aruco-marker/demos/angular.html
 */

const AR = window['AR'];
const POS = window['POS'];
const winWidth = window.innerWidth;
const winHeight = window.innerHeight;
export default class Runtime {
    detector: any;
    posit: any;
    video: any;
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
        this.posit = new POS.Posit(35, winWidth);
        
        this.createDom();
        this.createRender();
        this.tick();
    }

    createDom() {
        const video = this.video = Util.createElement(`<video class="ar-video" style="position:relative;z-index:1;" autoplay playsinline></video>`);
        const canvas:any = Util.createElement(`<canvas width="300" height="300"></canvas>`);

        this.context = canvas.getContext("2d");
        
        document.body.appendChild(video);
    }

    createRender() {
        const webgl = this.webgl = new WebGLRenderer({alpha: true, antialias: true});
        const render = this.render = webgl.domElement;

        webgl.setPixelRatio(window.devicePixelRatio);
        webgl.setSize(winWidth, winHeight);
        Util.styleElement(render, {
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: '999'
        });

        document.body.appendChild(render);

        const scene = this.scene = new Scene();
        const camera = this.camera = new PerspectiveCamera(80, winWidth / winHeight, 1, 1000);
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

        const context = this.context;
        context.drawImage(this.video, 0, 0, 300, 300);
        const markers = this.detector.detect(context.getImageData(0, 0, 300, 300));
        
        markers.length ? this.show3d(markers[0]) : this.hide3d();
    }

    show3d(marker) {
        const corners = marker.corners;
        const mesh = this.mesh;

        corners.forEach(data => {
            data.x = data.x - (winWidth / 2);
            data.y = (winHeight / 2) - data.y;
        });

        const pos = this.posit.pose(corners);
        mesh.position.set(pos.bestTranslation[0], pos.bestTranslation[1], pos.bestTranslation[2]);
        mesh.visible = true;
    }

    hide3d() {
        this.mesh.visible = false;
    }
}