import PubSubAble from '../../interface/pubsub.interface';
import {SphereGeometry, MeshBasicMaterial, Mesh, BackSide, Texture, BoxGeometry, Points, PointsMaterial} from 'three';
import ResourceLoader from '../../loaders/resource.loader';
import Util from '../../core/util';
import HDAnalyse from '../hdmap/analyse.hdmap';

/** 
 * @file 粒子渲染插件
 */

const loader = new ResourceLoader();
export default class Particle extends PubSubAble {
    data: any;
    pano: any;
    sphere: any;
    facesList: any;
    _subtoken: any;
    _animating = false;

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

        const particle = new Points(new SphereGeometry(100, 40, 40), new PointsMaterial({
            color: 'red',
            size: 5,
            transparent: true,
            depthTest: false
        }));
        particle.renderOrder = 2;
        particle.position.copy(pos);
        // pano.addSceneObject(particle);

        loader.loadArray(data.simg).then(imgs => {
            // texture.mapping = CubeRefractionMapping;

            const materials = [];

            imgs.forEach(img => {
                const t = new Texture(img);
                t.needsUpdate = true;

                materials.push(new MeshBasicMaterial({
                    map: t,
                    side: BackSide,
                    transparent: true,
                    depthTest: false
                }));
            });

            const geometry = new BoxGeometry(1000, 1000, 1000, 5, 5, 5);
            const sphere = this.sphere = new Mesh(geometry, materials);
            geometry.scale(1, 1, 1);

            sphere.renderOrder = 3;
            pano.addSceneObject(sphere);

            document.body.onclick = () => this.detect();
        });
    }

    /**
     * 修改 uv 贴图, 三角面
     */
    uv() {
        // change uv map
        this.sphere.geometry.uvsNeedUpdate = true;
        this.sphere.geometry.faceVertexUvs[0].forEach((arry, i) => {
            if (i % 2 == 0) {
                arry.forEach(vec => {
                    vec.x = vec.y = 255;
                });
            }
        });
    }

    makeArray(index, limit) {
        const arry = [];
        limit = index + limit;

        for (let i = index; i < limit; i++) {
            arry.push(i);
        }

        return arry;
    }

    detect() {
        if (this._animating) {
            return;
        }

        const pano = this.pano;
        const intersect = Util.intersect({x: 0, y: 0}, [pano.skyBox.getPlastic()], pano.getCamera());
        let facesList = this.facesList = this.makeArray(100, 50);

        if (intersect) {
            const point = intersect[0].point;
            const data = HDAnalyse.calcUV(point.x, point.y, point.z);

            switch (data.index) {
                case 0:
                    facesList = facesList.concat(this.makeArray(0, 50));
                    break;
                case 1:
                    facesList = facesList.concat(this.makeArray(50, 50));
                    break;
                case 4:
                    facesList = facesList.concat(this.makeArray(200, 50));
                    break;
                case 5:
                    facesList = facesList.concat(this.makeArray(250, 50));
                    break;
            }

            this.facesList = facesList.concat(this.makeArray(150, 50));
            this._subtoken = this.subscribe(this.Topic.RENDER.PROCESS, () => this.changeScene());         
        }
    }

    changeScene() {
        const list = this.facesList;
        const geometry = this.sphere.geometry;

        if (list && list.length) {
            const index = list.shift();
            this._animating = true;

            geometry.elementsNeedUpdate = true;
            geometry.faces[index].materialIndex = 10;
        } else {
            this.facesList = null;
            this._animating = false;
            this.unsubscribe(this._subtoken);
        }
    }
}