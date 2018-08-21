import {Scene, Mesh, SphereGeometry, ShaderMaterial, UniformsUtils, Vector3} from 'three';
import PShader from '../shader/plastic.shader';
import Plastic from '../../interface/plastic.interface';

/**
 * @file 悬浮球
 */

const defaultOpts = {
    name: 'suspend',
    radius: 200,
    widthSegments: 24,
    heightSegments: 24,
    map: null
};
export default class Suspend extends Plastic {
    camera: any;
    scene: any;

    constructor(opts, pano) {
        super();
        
        this.pano = pano;
        this.opts = Object.assign({}, defaultOpts, opts);
        this.create();
        this.subscribe(this.Topic.RENDER.PROCESS, this.update.bind(this));
    }

    create() {
        const opts = this.opts;
        const scene = this.scene = new Scene();
        this.camera = this.pano.getCamera().clone();
        
        const uniforms = UniformsUtils.clone(PShader.reflection.uniforms);
        uniforms.tCube.value = opts.map;

        const sphere = this.plastic = new Mesh(new SphereGeometry(opts.radius, opts.widthSegments, opts.heightSegments), 
            new ShaderMaterial({
                uniforms: uniforms,
                vertexShader: PShader.reflection.vertex,
                fragmentShader: PShader.reflection.fragment,
                transparent: true,
                depthTest: false
            }));
        
        sphere.name = opts.name;
        sphere.renderOrder = 2;

        scene.add(sphere);
        this.pano.webgl.autoClear = false;
    }

    update() {
        const pano = this.pano;
        const camera = this.camera;
        
        if (this.plastic) {
            const pcamera = pano.getCamera();
            const vector = new Vector3();

            pcamera.getWorldDirection(vector);
            vector.x *= 1000;
            vector.y *= 1000;
            vector.z *= 1000;

            camera.position.copy(vector);
            camera.lookAt(this.plastic.position);
        }

        pano.webgl.render(this.scene, camera);
    }

    dispose() {
        super.dispose();
        this.pano.webgl.autoClear = true;
    }
}