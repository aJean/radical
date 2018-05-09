import {WebGLRenderer, Scene, PerspectiveCamera, TextureLoader, PlaneGeometry, MeshBasicMaterial, Mesh, Vector2, AxesHelper} from 'three';

/**
 * @file uv mapping
 * 每一个面由两个三角形组成, 底部对应 uv 顶点 0, 1, 3 顶部对应 1, 2, 3
 * 顶点从低端开始逆时针
 */

export default function (id) {
    const webgl = new WebGLRenderer({alpha: true});
    const render = webgl.domElement;

    webgl.setPixelRatio(window.devicePixelRatio);
    webgl.setSize(window.innerWidth, window.innerHeight);
    document.getElementById(id).appendChild(render);

    const scene = this.scene = new Scene();
    const camera = this.camera = new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 600);
    
    const texture = new TextureLoader().load('../../../bxl-ar/examples/assets/material.gif');
    const geometry = new PlaneGeometry(300, 300, 1, 1);
    geometry.faceVertexUvs[0][0] = [new Vector2(0, 0), new Vector2(1, 0), new Vector2(0, 1)];
    geometry.faceVertexUvs[0][1] = [new Vector2(1, 0), new Vector2(1, 1), new Vector2(0, 1)];

    const material = new MeshBasicMaterial({map: texture});
    const mesh = this.mesh = new Mesh(geometry, material);
    const axesHelper = new AxesHelper(300);

    scene.add(axesHelper);
    scene.add(mesh);
    webgl.render(scene, camera);

    function tick() {
        webgl.render(scene, camera);
        requestAnimationFrame(tick);
    }

    tick();
}