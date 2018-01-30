import {VideoTexture, LinearFilter, RGBFormat, MeshBasicMaterial, PlaneGeometry, Mesh} from 'three';
import {IPluggableOverlay} from './interface.overlay';

/**
 * 视频播放
 */

const defaultOpts = {
    width: 200,
    height: 200,
    loop: true,
    auto: true,
    inverval: 60
};
export default class videoOverlay implements IPluggableOverlay {
    data: any;
    particle: any;

    constructor(data) {
        this.data = Object.assign({}, defaultOpts, data);
        this.particle = this.create();
    }

    create() {
        const data = this.data;
        const video = document.createElement('video');
        video.src = data.src;
        video.setAttribute('autoPlay', 'true');
        video.setAttribute('webkit-playsinlin', 'true');
        video.loop = true;
        video.style.display = 'none';
        document.body.appendChild(video);

        const texture = new VideoTexture(video);
        texture.minFilter = LinearFilter;
        texture.magFilter = LinearFilter;
        texture.format = RGBFormat;

        const material = new MeshBasicMaterial({
            color: 0xffffff,
            map: texture
        });

        const plane = new PlaneGeometry(data.width, data.height);
        const planeMesh = new Mesh(plane, material);

        planeMesh.position.set(data.location.x, data.location.y, data.location.z);
        planeMesh.lookAt(data.lookat);
        planeMesh.name = data.id;
        planeMesh['data'] = data;

        return planeMesh;
    }

    update() {}

    show() {
        this.particle.visible = true;
    }

    hide() {
        this.particle.visible = false;
    }

    dispose() {
        this.particle.geometry.dispose();
    }
}