import {TextureLoader, MeshBasicMaterial, PlaneGeometry, Mesh} from 'three';
import {IPluggableOverlay} from '../interface/overlay.interface';
import Popup from '../ui/popup.ui';
import Util from '../../core/util';

/**
 * @file 视频播放
 * @deprecated see plugins/media
 */

const defaultOpts = {
    width: 80,
    height: 80,
    loop: false,
    auto: false
};
export default class videoOverlay implements IPluggableOverlay {
    pano: any;
    data: any;
    particle: any;
    video: any;
    popup: Popup;
    type = "video";

    constructor(data, pano) {
        this.pano = pano;
        this.data = Object.assign({}, defaultOpts, data);
        this.particle = this.create();
    }

    create() {
        const data = this.data;
        const location = data.location;

        const video = this.video = Util.createElement(`<video class="pano-video" src="${data.src}"${data.auto ? ' autoplay' : ''}${data.loop ? ' loop' : ''} controls webkit-playsinlin></video>`);

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
        planeMesh.lookAt(this.pano.getCamera().position);
        planeMesh.name = data.id;
        planeMesh['instance'] = this;

        return planeMesh;
    }

    update() {}

    /**
     * 显示窗口 & 播放视频
     */
    play() {
        const size = this.pano.getSize();
        const origin = Util.calcWorldToScreen(this.data.location, this.pano.getCamera());
        origin.x = Math.floor((origin.x * size.width + size.width) / 2);
        origin.y = Math.floor((-origin.y * size.height + size.height) / 2);

        this.popup.root.style.transformOrigin = origin.x + 'px ' + origin.y + 'px';
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
        const particle = this.particle;

        delete particle['instance'];
        particle.geometry.dispose();
        particle.material.map.dispose();
        particle.material.dispose();

        this.video.pause();
        this.popup.dispose();
    }
}