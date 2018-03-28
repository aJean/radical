import {WebGLRenderer, PerspectiveCamera, Scene, CubeGeometry, MeshLambertMaterial, Mesh, SpotLight, PlaneGeometry, MeshPhongMaterial, DoubleSide, CameraHelper} from 'three';
import Util from '../core/util';
import VrControl from '../pano/controls/vr.control';
import VrEffect from '../vr/effect.vr';

/**
 * @file wev vr test
 */

export default abstract class VrRuntime {
    static start(el) {
        const webgl = new WebGLRenderer();
        webgl.setPixelRatio(window.devicePixelRatio);
        webgl.setSize(window.innerWidth, window.innerHeight);
        webgl.setClearColor(0xeeeeee);
        webgl.shadowMap.enabled = true;

        document.querySelector(el).appendChild(webgl.domElement);

        const scene = new Scene();
        const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

        const geometry = new CubeGeometry(10, 10, 10);
        const cubematerial = new MeshLambertMaterial({color: 0xef6500, opacity: 1, transparent: true});
        const cube = new Mesh(geometry, cubematerial);

        cube.position.set(0, 10, -40);
        cube.rotation.set(Math.PI / 6, Math.PI / 4, 0);
        cube.castShadow = true;
        scene.add(cube);

        const plane = new Mesh(new PlaneGeometry(50, 50), new MeshPhongMaterial({
            color: 0xff0000,
            shininess: 150,
            specular: 0x222222,
            side: DoubleSide
        }));
        plane.position.set(0, 0, -80);
        plane.rotateX(Math.PI / 1.5);
        
        plane.receiveShadow = true;
        scene.add(plane);

        const spotLight = new SpotLight(0xffffff);
        spotLight.name = 'Spot Light';
        spotLight.angle = Math.PI / 5;
        spotLight.penumbra = 0.3;
        spotLight.position.set(10, 20, 10);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.target = cube;
        scene.add(spotLight);

        scene.add(new CameraHelper(spotLight.shadow.camera));

        const vrControl = new VrControl(camera);
        const effect = new VrEffect(webgl);
        effect.setSize(window.innerWidth, window.innerHeight);

        const animate = () => {
            cube.rotation.y += 0.01;
            vrControl.update();
            effect.render(scene, camera);
            
            requestAnimationFrame(animate);
        };

        animate();
    }
}