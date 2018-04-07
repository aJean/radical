import {WebGLRenderer, PerspectiveCamera, Scene, CubeGeometry, MeshLambertMaterial, Mesh, SpotLight, PlaneGeometry, MeshPhongMaterial, DoubleSide, CameraHelper} from 'three';
import ResourceLoader from '../pano/loaders/resource.loader';
import Log from '../core/log';
import VPano from '../vr/pano.vr';
import Helper from '../vr/helper.vr';

/**
 * @file wev vr runtime
 */

const myLoader = new ResourceLoader();

export default abstract class Runtime {
    static uid = 0;
    static instanceMap = {};

    static async start(url, el, events?) {
        const source = typeof url === 'string' ? await myLoader.fetchUrl(url) : url;
        el = (typeof el == 'string') ? document.querySelector(el) : el;

        if (!el || !el.parentNode) {
            el = document.body;
        }

        if (!(source && source['sceneGroup'])) {
            return Log.output('load source error');
        }

        if (window['WebVRPolyfill']) {
            const polyfill = new window['WebVRPolyfill']();
        }

        try {
            const ref = el.getAttribute('ref') || `vpano_${this.uid++}`;
            const pano = this.instanceMap[ref] = new VPano(el, source).deco();
            el.setAttribute('ref', ref);            
            
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

    static getInstance(ref) {
        return this.instanceMap[ref];
    }

    static releaseInstance(ref) {
        const pano = this.instanceMap[ref];
        pano && pano.dispose();
    }
}

const pastLoad = window.onload;
window.onload = function() {
    pastLoad && pastLoad.call(this);

    const nodeList = document.querySelectorAll('vrpano');

    for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i];
        const auto = node.getAttribute('auto');

        if (auto) {
            Runtime.start(node.getAttribute('source'), node);
        }
    }  
};