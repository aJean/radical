import {TextureLoader, MeshBasicMaterial, PlaneGeometry, Mesh} from 'three';
import {IPluggableOverlay} from './interface.overlay';

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

export default class FrameOverlay implements IPluggableOverlay {
    textures = [];
    data: any;
    limit: number;
    index = 0;
    particle: any;
    enable = true;
    finished = false;
    lastTime = Date.now();

    constructor(data) {
        this.data = Object.assign({}, defaultOpts, data);
        this.particle = this.create();
    }

    loadTextures() {
        const loader = new TextureLoader();
        const data = this.data;
        const count = data.count;
        const url = data.imgPath;
        const limit = this.limit = data.count;

        for (let i = 0; i < limit; i++) {
            this.textures.push(loader.load(`${url}/${i}.png`));
        }
    }

    create() {
        this.loadTextures();

        const data = this.data;
        const location = data.location;      
        const material = new MeshBasicMaterial({
            map: this.textures[0],
            transparent: true
        });
        const plane = new PlaneGeometry(data.width, data.height);
        const mesh = new Mesh(plane, material);
        
        mesh.position.set(location.x, location.y, location.z);

        if (data.rx) {
            mesh.rotation.set(data.rx, data.ry, data.rz);
        } else {
            mesh.lookAt(data.lookat);
        }

        return mesh;
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

    hide() {
        this.particle.visible = false;
    }

    show() {
        this.particle.visible = true;
    }

    dispose() {
        this.particle.geometry.dispose();
    }
}