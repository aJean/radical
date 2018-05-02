import {WebGLRenderer, PerspectiveCamera, Scene, CubeGeometry, MeshLambertMaterial, Mesh, SpotLight, PlaneGeometry, MeshPhongMaterial, DoubleSide, CameraHelper} from 'three';
import ResourceLoader from '../pano/loaders/resource.loader';
import Log from '../core/log';
import VPano from '../vr/pano.vr';
import Timeline from '../pano/animations/timeline.animation';

/**
 * @file wev vr runtime
 */

const myLoader = new ResourceLoader();

abstract class EnvQueue {
    static list = [];

    static add(fn, context) {
        this.list.push({
            context: context,
            fn: fn.bind(context)
        });
    }

    static excute() {
        this.list.forEach(item => item.fn());
    }

    static remove(context) {
        const list = this.list;
        const index = list.find(item => item.context == context);
        list.splice(index, 1);
    }

    static len() {
        return this.list.length;
    }
};

export default abstract class Runtime {
    static timeid: any;    
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
            const polyfill = new window['WebVRPolyfill']({
                BUFFER_SCALE: 0.75
            });
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
            // 动画
            if (source['animation']) {
                Timeline.install(source['animation'], pano);
            } else {
                pano.noTimeline();
            }

            EnvQueue.add(pano.onResize, pano);
            pano.run();
        } catch (e) {
            events && events.nosupport && events.nosupport();
            throw new Error(e);
        }
    }

    static getInstance(ref) {
        return this.instanceMap[ref];
    }

    static releaseInstance(ref) {
        const pano = this.instanceMap[ref];
        pano && pano.dispose();
        EnvQueue.remove(pano);
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

const onEnvResize = event => {
    clearTimeout(Runtime.timeid);
    Runtime.timeid = setTimeout(function () {
        EnvQueue.excute();
    }, 200);
};
const eventType = /Android|webOS|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'orientationchange' : 'resize';
window.addEventListener(eventType, onEnvResize);