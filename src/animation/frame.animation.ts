import {TextureLoader, MeshBasicMaterial, PlaneGeometry, Mesh, Vector3} from 'three';

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

export default class AnimationFrame {
    textures = [];
    opts: any;
    camera: any;
    limit: number;
    index = 0;
    particle: any;
    enable = true;
    finished = false;
    lastTime = Date.now();

    constructor(camera, opts) {
        this.camera = camera;
        this.opts = Object.assign({}, defaultOpts, opts);
        this.loadTextures();
        this.createParticle();
    }

    loadTextures() {
        const loader = new TextureLoader();
        const opts = this.opts;
        const count = opts.count;
        const url = opts.imgPath;
        const limit = this.limit = opts.count;

        for (let i = 0; i < limit; i++) {
            this.textures.push(loader.load(`${url}/${i}.png`));
        }
    }

    createParticle() {
        const opts = this.opts;        
        const vector = new Vector3(opts.px, opts.py, opts.pz);
        const material = new MeshBasicMaterial({
            map: this.textures[0],
            transparent: true
        });
        const plane = new PlaneGeometry(opts.width, opts.height);
        const mesh = this.particle = new Mesh(plane, material);
        
        mesh.position.set(vector.x, vector.y, vector.z);

        if (opts.rx) {
            mesh.rotation.set(opts.rx, opts.ry, opts.rz);
        }
        
        mesh.lookAt(this.camera.position);
    }

    update() {
        if (!this.enable) {
            return;
        }

        const opts = this.opts;
        const now = Date.now();
        const textures = this.textures;
        const newIndex = parseInt((now - this.lastTime) / opts.inverval + '');
        let texture;

        if (newIndex != this.index) {
            if (textures[newIndex]) {
                texture = textures[this.index = newIndex];
            } else {
                if (opts.loop) {
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