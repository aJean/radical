import {TextureLoader, MeshBasicMaterial, PlaneGeometry, Mesh} from 'three';
import {IPluggableOverlay} from './interface.overlay';
import Layer from '../ui/layer.ui';

/**
 * @file 视频播放
 */

const defaultOpts = {
    width: 30,
    height: 30,
    loop: false,
    auto: true
};
export default class videoOverlay implements IPluggableOverlay {
    data: any;
    particle: any;
    video: any;
    type = "video";
    layer: Layer;

    constructor(data) {
        this.data = Object.assign({}, defaultOpts, data);
        this.particle = this.create();
    }

    create() {
        const data = this.data;
        const location = data.location;

        const video = this.video = document.createElement('video');
        video.className = "panoram-video";
        video.src = data.src;
        video.autoplay = false;
        video.loop = data.loop;
        video.controls = true;
        video.setAttribute('webkit-playsinlin', 'true');

        const layer = this.layer = new Layer({
            hide: true,
            closeBtn: true,
            width: window.innerWidth,
            height: window.innerHeight,
            effect: 'scale',
            onLayerClose: () => this.stop()
        });
        layer.setContent(video);
        layer.appendTo(document.body);

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
        this.layer.show();
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
        this.particle.geometry.dispose();
        document.body.removeChild(this.video);
    }
}