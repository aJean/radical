import ResourceLoader from '../pano/loaders/resource.loader';
import Light from '../pano/plugins/light.plugin';
import Info from '../pano/plugins/info.plugin';
import Rotate from '../pano/plugins/rotate.plugin';
import Multiple from '../pano/plugins/multiple.plugin';
import Wormhole from '../pano/plugins/wormhole.plugin';
import Timeline from '../pano/animations/timeline.animation';
import Pano from '../pano/pano';
import Log from '../core/log';

/**
 * @file vr pano runtime
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

abstract class Runtime {
    static timeid: any;
    static uid = 0;
    static instanceMap = {};

    /**
     * 获取全景对象, use after scene-init
     * @param {string} ref 
     */
    static getInstance(ref) {
        return this.instanceMap[ref];
    }

    /**
     * 释放一个全景对象
     * @param {string} ref 
     */
    static releaseInstance(ref) {
        const pano = this.instanceMap[ref];
        if (pano) {
            pano.dispose();
            EnvQueue.remove(pano);
        }

        if (!EnvQueue.len()) {
            window.removeEventListener('resize', onEnvResize);
        }
    }

    /**
     * 创建全景对象
     * @param {HTMLElement} el root 元素
     * @param {Object} source
     */
    static createRef(el, source) {
        el = (typeof el == 'string') ? document.querySelector(el) : el;

        if (!el || !el.parentNode) {
            el = document.body;
        }

        const ref = el.getAttribute('ref') || `pano_${this.uid++}`;
        const opts = {el, ...source['pano']};
        el.setAttribute('ref', ref);
        
        return this.instanceMap[ref] = new Pano(opts, source);
    }

    static async start(url, el, events?) {
        const source = typeof url === 'string' ? await myLoader.fetchUrl(url) : url;
        const data = source && source['sceneGroup'];

        if (!data) {
            return Log.output('load source error');
        }

        const pano = this.createRef(el, source);

        if (source['animation']) {
            Timeline.install(source['animation'], pano);
        } else {
            pano.noTimeline();
        }

        // 光照插件
        pano.addPlugin(Light);

        if (source['rotate']) {
            pano.addPlugin(Rotate, source['rotate']);
        }

        if (source['multiScene']) {
            pano.addPlugin(Multiple, source['sceneGroup']);
        }

        if (source['info']) {
            pano.addPlugin(Info, source['info']);
        }

        if (source['wormhole']) {
            pano.addPlugin(Wormhole, source['wormhole']);
        }

        // 用户订阅事件
        if (events) {
            for (let name in events) {
                pano.subscribe(name, events[name]);
            }
        }

        // add to env queue listeners
        EnvQueue.add(pano.onResize, pano);
        // load and render
        pano.run();
    }

    static async start3d() {}
};

const pastLoad = window.onload;
window.onload = function() {
    pastLoad && pastLoad.call(this);

    let uid = 0;
    const nodeList = document.querySelectorAll('pano');

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
window.addEventListener('resize', onEnvResize);

export default Runtime;