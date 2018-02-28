import {TextureLoader, MeshBasicMaterial, PlaneGeometry, Mesh} from 'three';
import {IPluggableOverlay} from '../interface/overlay.interface';
import Popup from '../ui/popup.ui';
import Util from '../util';

/**
 * @file 视频播放
 */

const defaultOpts = {
    width: 80,
    height: 80,
    loop: false,
    auto: false
};
export default class videoOverlay implements IPluggableOverlay {
    data: any;
    particle: any;
    video: any;
    popup: Popup;
    type = "video";

    constructor(data) {
        this.data = Object.assign({}, defaultOpts, data);
        this.particle = this.create();
    }

    create() {
        const data = this.data;
        const location = data.location;

        const video = this.video = Util.createElement(`<video class="panoram-video" src="${data.src}"${data.auto ? ' autoplay' : ''}${data.loop ? ' loop' : ''} controls webkit-playsinlin></video>`);

        const layer = this.popup = new Popup({
            width: window.innerWidth,
            height: window.innerHeight,
            effect: 'scale',
            onLayerClose: () => this.stop()
        });
        layer.setContent(video);
        layer.setContainer(document.body);

        const texture = new TextureLoader().load(data.img);
        const material = new MeshBasicMaterial({
            map: texture,
            transparent: true
        });

        const plane = new PlaneGeometry(data.width, data.height);
        const planeMesh = new Mesh(plane, material);

        planeMesh.position.set(location.x, location.y, location.z);
        planeMesh.lookAt(data.lookat);
        planeMesh.name = data.id;
        planeMesh['instance'] = this;

        return planeMesh;
    }

    update() {}

    play() {
        this.popup.show();
        this.video.play();
    }

    stop() {
        this.video.pause();
    }

    show() {
        this.particle.visible = true;
    }

    hide() {
        this.particle.visible = false;
    }

    dispose() {
        delete this.particle['instance'];
        this.video.pause();
        this.particle.geometry.dispose();
        this.popup.dispose();
    }
}