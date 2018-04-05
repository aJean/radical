import {WebGLRenderer, PerspectiveCamera, Scene, CubeGeometry, MeshLambertMaterial, Mesh, SpotLight, PlaneGeometry, MeshPhongMaterial, DoubleSide, CameraHelper} from 'three';
import ResourceLoader from '../pano/loaders/resource.loader';
import Log from '../core/log';
import VPano from '../vr/pano.vr';
import Helper from '../vr/helper.vr';

/**
 * @file wev vr runtime
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
            const pano = new VPano(el, source).deco();
            
            // 用户订阅事件
            if (events) {
                for (let name in events) {
                    pano.subscribe(name, events[name]);
                }
            }

            pano.run();
            Helper.createButton(pano.webgl);
        } catch (e) {
            events && events.nosupport && events.nosupport();
            throw new Error('build error');
        }
    }
}