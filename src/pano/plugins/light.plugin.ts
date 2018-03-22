import {AmbientLight, SpotLight, MeshLambertMaterial, CubeGeometry, Mesh, CameraHelper} from 'three';
import Pano from '../pano';

export default class Light {
    constructor(pano: Pano) {
        const geometry = new CubeGeometry(10, 10, 10);
        const material = new MeshLambertMaterial({color: 0xffaa00});
        const mesh = new Mesh(geometry, material);
        mesh.position.set(20, 20, 100);
        mesh.castShadow = true;

        const light = new AmbientLight(0x111111);
        const dlight = new SpotLight(0xffffff);
        dlight.position.set(30, 25, -2);
        dlight.target = mesh;
        dlight.castShadow = true;

        pano.addSceneObject(light);
        pano.addSceneObject(dlight);
        pano.addSceneObject(mesh);

        const helper = new CameraHelper(dlight.shadow.camera );
        pano.addSceneObject(helper);
    }
}