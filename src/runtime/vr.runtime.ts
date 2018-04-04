import {WebGLRenderer, PerspectiveCamera, Scene, CubeGeometry, MeshLambertMaterial, Mesh, SpotLight, PlaneGeometry, MeshPhongMaterial, DoubleSide, CameraHelper} from 'three';
import ResourceLoader from '../pano/loaders/resource.loader';
import Pano from '../pano/pano';
import Util from '../core/util';
import Log from '../core/log';
import VRControl from '../pano/controls/vr.control';
import VREffect from '../vr/effect.vr';
import VRManager from '../vr/manager.vr';

/**
 * @file wev vr test
 */

const myLoader = new ResourceLoader(); 
export default abstract class VrRuntime {
    static async start(url, el, events?) {
        const source = typeof url === 'string' ? await myLoader.fetchUrl(url) : url;
        el = (typeof el == 'string') ? document.querySelector(el) : el;

        if (!el || !el.parentNode) {
            el = document.body;
        }

        if (!(source && source['sceneGroup'])) {
            return Log.output('load source error');
        }

        try {
            const pano = new Pano(el, source);
            
            // 用户订阅事件
            if (events) {
                for (let name in events) {
                    pano.subscribe(name, events[name]);
                }
            }

            pano.run();
        } catch (e) {
            events && events.nosupport && events.nosupport();
            throw new Error('build error');
        }
    }

    static test(el) {
        const webgl = new WebGLRenderer();
        const height = Math.max(screen.availHeight, window.innerHeight);
        const width = window.innerWidth;

        webgl.setPixelRatio(window.devicePixelRatio);
        webgl.setSize(width, height);
        webgl.shadowMap.enabled = true;

        document.querySelector(el).appendChild(webgl.domElement);

        const scene = new Scene();
        const camera = new PerspectiveCamera(90, width / height, 0.1, 1000);

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

        const vrControl = new VRControl(camera);
        const effect = new VREffect(webgl);
        vrControl.standing = true;
        effect.setSize(width, height, false);

        VRManager.createButton(webgl);

        const animate = () => {
            cube.rotation.y += 0.01;
            vrControl.update();
            effect.render(scene, camera);
            
            effect.requestAnimationFrame(animate);
        };

        animate();
    }
}