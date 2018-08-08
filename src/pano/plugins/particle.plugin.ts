import PubSubAble from '../../interface/pubsub.interface';
import {SphereGeometry, MeshBasicMaterial, Mesh, BackSide, CubeRefractionMapping, Vector2} from 'three';
import ResourceLoader from '../loaders/resource.loader';
import Util from '../../core/util';

/** 
 * @file 粒子渲染插件
 */

const myLoader = new ResourceLoader();
export default class Particle extends PubSubAble {
    data: any;
    pano: any;

    constructor(pano, data) {
        super();

        this.data = data;
        this.pano = pano;

        this.create();
    }

    create() {
        const data = this.data;
        const pos = Util.calcSphereToWorld(data.lng, data.lat);
        const pano = this.pano;

        myLoader.loadTexture(data.simg).then((texture: any) => {
            texture.mapping = CubeRefractionMapping;

            const geometry = new SphereGeometry(1000, 40, 40);
            const material = new MeshBasicMaterial({
                envMap: texture,
                side: BackSide,
                transparent: true,
                depthTest: false
            });

            const sphere = new Mesh(geometry, material);
            sphere.renderOrder = 2;
            // sphere.position.copy(pos);
            pano.addSceneObject(sphere);
            
            geometry.uvsNeedUpdate = true;
            geometry.faceVertexUvs[0].forEach((arry, i) => {
                if (i % 2 == 0) {
                    arry.splice(0, 3);
                }
            });
        });
        
    }
}