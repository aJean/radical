import ResourceLoader from '../pano/loaders/resource.loader';
import Timeline from '../pano/animations/timeline.animation';
import Info from '../pano/plugins/info.plugin';
import Indicator from '../pano/plugins/indicator.plugin';
import Rotate from '../pano/plugins/rotate.plugin';
import Multiple from '../pano/plugins/multiple.plugin';
import Wormhole from '../pano/plugins/wormhole.plugin';
import Thru from '../pano/plugins/thru.plugin';
import Media from '../pano/plugins/media.plugin';
import Helper from '../pano/plugins/helper.plugin';
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
     * @param {string} ref dom 引用标识
     */
    static releaseInstance(ref) {
        const pano = this.instanceMap[ref];
        
        if (pano) {
            pano.dispose();
            EnvQueue.remove(pano);
        }

        if (!EnvQueue.len()) {
            window.removeEventListener(eventType, onEnvResize);
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
        el.setAttribute('ref', ref);

        return this.instanceMap[ref] = new Pano(el, source);
    }

    static async start(url, el, events?) {
        const source = typeof url === 'string' ? await myLoader.fetchUrl(url) : url;

        if (!(source && source['sceneGroup'])) {
            return Log.output('load source error');
        }

        try {
            const pano = this.createRef(el, source);

            // 用户订阅事件
            if (events) {
                for (let name in events) {
                    pano.subscribe(name, events[name]);
                }
            }

            if (source['animation']) {
                Timeline.install(source['animation'], pano);
            } else {
                pano.noTimeline();
            }

            if (source['thru']) {
                pano.addPlugin(Thru, source['thru']);
            }
    
            if (source['rotate']) {
                pano.addPlugin(Rotate, source['rotate']);
            }
    
            if (source['multiScene']) {
                pano.addPlugin(Multiple, source['sceneGroup']);
            }
    
            if (source['info'] !== false) {
                pano.addPlugin(Info);
            }

            if (source['indicator'] !== false) {
                pano.addPlugin(Indicator);
            }
    
            if (source['wormhole']) {
                pano.addPlugin(Wormhole, source['wormhole']);
            }

            if (source['media']) {
                pano.addPlugin(Media, source['media']);
            }

            if (source['helper']) {
                pano.addPlugin(Helper, source['helper']);
            }
    
            // add to env queue listeners
            EnvQueue.add(pano.onResize, pano);
            // load and render
            pano.run();
        } catch(e) {
            events && events.nosupport && events.nosupport(e) || console.error(e);
        }
    }
};

const pastLoad = window.onload;
window.onload = function() {
    pastLoad && pastLoad.call(this);

    const nodeList = document.querySelectorAll('pano');

    for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i];
        const auto = node.getAttribute('auto');

        if (auto) {
            Runtime.start(node.getAttribute('source'), node);
        }
    }  
};

const eventType = /webOS|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ? 'orientationchange' : 'resize';
const onEnvResize = event => {
    clearTimeout(Runtime.timeid);
    Runtime.timeid = setTimeout(function () {
        EnvQueue.excute();
    }, 200);
};

window.addEventListener(eventType, onEnvResize);

window.onbeforeunload = () => {
    for (let ref in Runtime.instanceMap) {
        Runtime.instanceMap[ref].dispose();
    }
};

export default Runtime;