import {TextureLoader, MeshBasicMaterial, PlaneGeometry, Mesh} from 'three';
import PluggableOverlay from '../../interface/overlay.interface';

/**
 * @file 全景序列帧控制器
 */

const defaultOpts = {
    width: 200,
    height: 200,
    loop: true,
    auto: true,
    inverval: 60
};
export default class FrameOverlay extends PluggableOverlay {
    textures = [];
    limit: number;
    index = 0;
    enable = true;
    finished = false;
    lastTime = Date.now();
    type = "frame";

    constructor(data) {
        super();

        this.data = Object.assign({}, defaultOpts, data);
        this.create();
    }

    loadTextures() {
        const loader = new TextureLoader();
        const data = this.data;
        const url = data.imgPath;
        const limit = this.limit = data.count;

        for (let i = 1; i <= limit; i++) {
            this.textures.push(loader.load(`${url}/${i}.png`));
        }
    }

    create() {
        this.loadTextures();

        const data = this.data;
        const location = data.location;      
        const material = new MeshBasicMaterial({
            map: this.textures[0],
            transparent: true,
            depthTest: false
        });
        const plane = new PlaneGeometry(data.width, data.height);
        const mesh = this.particle = new Mesh(plane, material);
        
        mesh.position.set(location.x, location.y, location.z);
        mesh.renderOrder = 100;

        if (data.rx) {
            mesh.rotation.set(data.rx, data.ry, data.rz);
        } else {
            mesh.lookAt(data.lookat);
        }
    }

    update() {
        if (!this.enable || !this.particle.visible) {
            return;
        }

        const data = this.data;
        const now = Date.now();
        const textures = this.textures;
        const newIndex = parseInt((now - this.lastTime) / data.inverval + '');
        let texture;

        if (newIndex != this.index) {
            if (textures[newIndex]) {
                texture = textures[this.index = newIndex];
            } else {
                if (data.loop) {
                    this.lastTime = now;
                    texture = textures[this.index = 0];
                } else {
                    this.finished = true;
                }
            }
        }

        if (texture) {
            this.particle.material.map = texture;
        }
    }

    isEnd() {
        return this.finished;
    }

    stop() {
        this.enable = false;
        this.finished = true;
    }

    pause() {
        this.enable = false;
    }

    play() {
        this.enable = true;
    }
}