import {TextureLoader, MeshBasicMaterial, PlaneGeometry, Mesh, FrontSide} from 'three';

/**
 * @file mesh overlay, static return three mesh object
 * @todo normalization object
 */

export default abstract class MeshOverlay {
    data: any;
    
    static create(data) {
        const loader = new TextureLoader();
        const texture = loader.load(data.img);

        const material = new MeshBasicMaterial({
            map: texture,
            side: FrontSide,
            transparent: true
        });

        const scale = 1;
        const plane = new PlaneGeometry(data.width * scale, data.height * scale);
        const planeMesh = new Mesh(plane, material);

        planeMesh.position.set(data.location.x, data.location.y, data.location.z);
        planeMesh.name = data.id;
        planeMesh['data'] = data;

        return planeMesh;
    }
}