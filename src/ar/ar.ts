import {WebGLRenderer, Scene, PerspectiveCamera, TextureLoader, BoxBufferGeometry, MeshBasicMaterial, Mesh} from 'three';
import Util from '../core/util';

/**
 * @file webar
 * use js-aruco & jsartoolkit
 * http://bhollis.github.io/aruco-marker/demos/angular.html
 */

const Aruco = window['AR'];
const POS = window['POS'];
const winWidth = window.innerWidth;
const winHeight = window.innerHeight;
export default class AR {
    detector: any;
    posit: any;
    video: any;
    webgl: any;
    render: any;
    scene: any;
    camera: any;
    mesh: any;
    painter: any;

    constructor(opts) {
        const constraints = {audio: false, video: {facingMode: 'environment'}};
        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
            const video = this.video;

            if ('srcObject' in video) {
                video.srcObject = stream;
            } else {
                video.src = window.URL.createObjectURL(stream);
            }

           video.play();
        }).catch(function(err) {
            alert(err);
        });

        this.createDom();
        this.createRender(opts.texurl);

        if (opts.aruco) {
            this.detector = new Aruco.Detector();
            this.posit = new POS.Posit(35, winWidth);
            this.tick();
        } else {
            this.tickArtoolkit();
        }
    }

    createDom() {
        const video = this.video = Util.createElement(`<video class="ar-video" style="position:relative;z-index:1;" autoplay playsinline></video>`);
        const canvas:any = Util.createElement(`<canvas width="300" height="300"></canvas>`);
        this.painter = canvas.getContext('2d');

        document.body.appendChild(video);
    }

    createRender(texurl) {
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
        
        const texture = new TextureLoader().load(texurl);
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

        const painter = this.painter;
        painter.drawImage(this.video, 0, 0, 300, 300);
        const markers = this.detector.detect(painter.getImageData(0, 0, 300, 300));
        
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

    tickArtoolkit() {
        requestAnimationFrame(this.tick.bind(this));


    }
}