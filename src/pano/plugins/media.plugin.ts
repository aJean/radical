import {Scene, PerspectiveCamera, Vector3, Mesh, LinearFilter, RGBFormat, BoxBufferGeometry, MeshBasicMaterial, VideoTexture} from 'three';
import {IPluggableUI} from '../interface/ui.interface';
import Util from '../../core/util';
import Inradius from '../plastic/inradius.plastic';

/**
 * @file 多媒体面板
 */

const defaultOpts = {
    vsrc: null,
    vloop: false,
    vauto: false,
    asrc: null,
    aloop: true,
    aauto: true
};
export default class Media implements IPluggableUI {
    container: any;
    element: any;
    pano: any;
    scene: any;
    camera: any;
    opts: any;
    video: any;
    box: any;
    inradius: any;
    audio: any;

    constructor(pano, opts) {
        this.pano = pano;
        this.opts = Object.assign({}, defaultOpts, opts);

        this.create();
        this.setContainer();
        this.bindEvent();
    }

    create() {
        const opts = this.opts;
        const element = this.element = Util.createElement('<section class="pano-media"><div class="pano-media-full"></div>'
            + '<div class="pano-media-video"></div><div class="pano-media-audio"></div></section>');

        // video
        const video: any = this.video = Util.createElement(`<video width="600" height="400" preload="auto" webkit-playsinlin></video>`);
        video.src = opts.vsrc;
        video.loop = opts.vloop;
        const texture = new VideoTexture(video);
        texture.minFilter = LinearFilter;
        texture.magFilter = LinearFilter;
        texture.format = RGBFormat;
        const box = this.box =  new Mesh(new BoxBufferGeometry(300, 300, 300),
            new MeshBasicMaterial({map: texture}));
        box.rotation.set(0, -2, 0);
        box.visible = false;

        const scene = this.scene = new Scene();
        const camera = this.camera = new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(0, 0, 600);
        scene.add(box);

        // music
        this.audio = Util.createElement(`<audio src="${opts.asrc}"${opts.aauto ? ' autoplay' : ''}${opts.aloop ? ' loop' : ''}></audio>`);

        const felem: any = element.querySelector('.pano-media-full');
        felem.onclick = e => this.handleFull(e);

        const velem: any = element.querySelector('.pano-media-video');
        velem.onclick = e => this.handleVideo(e);

        const aelem: any = element.querySelector('.pano-media-audio');
        aelem.onclick = e => this.handleAudio(e);

        if (!opts.aauto) {
            aelem.className = 'pano-media-audio  pano-media-audio-paused';
        }
    }

    /**
     * 播放环境创建
     */
    createInradius() {
        const inradius = this.inradius = new Inradius({
            color: '#000',
            opacity: 0,
            visible: false,
            radius: 1900});
        inradius.addBy(this.pano);
    }

    setContainer() {
        this.pano.getRoot().appendChild(this.element);
    }

    detachContainer() {
        this.pano.getRoot().removeChild(this.element);
    }

    bindEvent() {
        const pano = this.pano;

        pano.webgl.autoClear = false;
        pano.subscribe('render-process', this.update, this);
        pano.subscribe('scene-load', this.createInradius, this);
    }

    getElement() {
        return this.element;
    }

    update() {
        const webgl = this.pano.webgl;
        const camera = this.camera;        
        
        if (this.box.visible) {
            const pcamera = this.pano.getCamera();
            const vector = new Vector3();
            pcamera.getWorldDirection(vector);
            vector.x *= 600;
            vector.y *= 600;
            vector.z *= 600;

            camera.position.copy(vector);
            camera.lookAt(this.box.position);
        }

        webgl.render(this.scene, camera);
    }

    handleFull(e) {
        const root = this.pano.getRoot();
        const elem = e.target;

        if (document.webkitFullscreenElement) {
            elem.className = 'pano-media-full';
            document.webkitCancelFullScreen();
        } else {
            elem.className = 'pano-media-exitfull';
            root.webkitRequestFullScreen();
        }
    }

    /**
     * webgl play
     */
    handleVideo(e) {
        const pano = this.pano;
        const video = this.video;
        const elem = e.target;
        const inradius = this.inradius;

        if (video.paused) {
            elem.className = 'pano-media-pause';
            inradius.show();
            inradius.setOpacity(.5, pano);
            this.box.visible = true;
            video.play();
        } else {
            elem.className = 'pano-media-video';
            inradius.hide();
            inradius.setOpacity(0);
            this.box.visible = false;
            video.pause();
        }
    }

    handleAudio(e) {
        const audio = this.audio;
        const elem = e.target;

        if (audio.paused) {
            elem.className = 'pano-media-audio';
            audio.play();
        } else {
            elem.className = 'pano-media-audio  pano-media-audio-paused';
            audio.pause();
        }
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }

    dispose() {
        const pano = this.pano;
        const box = this.box;

        this.detachContainer();

        box.material.map.dispose();
        box.material.dispose();
        box.geometry.dispose();

        pano.removeSceneObject(box);
        pano.unSubscribe('render-process', this.update, this);
        pano.unSubscribe('scene-load', this.createInradius, this);
        pano.webgl.autoClear = true;
    }
}