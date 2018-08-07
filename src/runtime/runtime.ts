import PSPool from '../core/pspool';
import ResourceLoader from '../pano/loaders/resource.loader';
import Pano from '../pano/pano';
import VPano from '../vr/pano.vr';
import Log from '../core/log';

/**
 * @file create runtime
 */

class EnvQueue {
    list = [];

    add(fn, context) {
        this.list.push({
            context: context,
            fn: fn.bind(context)
        });
    }

    excute() {
        this.list.forEach(item => item.fn());
    }

    remove(context) {
        const list = this.list;
        const index = list.find(item => item.context == context);
        list.splice(index, 1);
    }

    len() {
        return this.list.length;
    }
};

const EVENTTYPE = /webOS|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'orientationchange' : 'resize';
const LOADER = new ResourceLoader();

/**
 * 创建运行环境
 * @param {string} mode 模式 vr | pano
 * @param {Function} register 注册函数
 */
export default function createRuntime(mode, register) {
    let runtimeId = null;
    const envQueue = new EnvQueue();

    const runtime = {
        uid: 0,
        instanceMap: {},

        createRef(el, source) {
            el = (typeof el == 'string') ? document.querySelector(el) : el;
    
            if (!el || !el.parentNode) {
                el = document.body;
            }
    
            const ref = el.getAttribute('ref') || `pano_${this.uid++}`;
            el.setAttribute('ref', ref);
            // make sure one instance one ps
            PSPool.createPSContext(ref);
            // create pano
            const pano = mode == 'vr' ? new VPano(el, source) : new Pano(el, source);
            pano['ref'] = ref;
            return this.instanceMap[ref] = pano;
        },

        async start(url, el, events?) {
            const source = typeof url === 'string' ? await LOADER.fetchUrl(url) : url;

            if (!(source && source['sceneGroup'])) {
                return Log.output('load source error');
            }

            try {
                const pano = this.createRef(el, source);

                // 用户订阅事件
                if (events) {
                    Object.keys(events).forEach(name => pano.subscribe(name, events[name]));
                }

                // plugin register
                register.call(null, pano, source);
                // add to env queue listeners
                envQueue.add(pano.onResize, pano);
                // load and render
                pano.run();
            } catch (e) {
                events && events.nosupport && events.nosupport(e) || Log.output(e);
            }
        },

        getInstance(ref) {
            return this.instanceMap[ref];
        },
    
        releaseInstance(ref) {
            const pano = this.instanceMap[ref];
    
            if (pano) {
                pano.dispose();
                envQueue.remove(pano);
            }
    
            if (envQueue.len()) {
                window.removeEventListener(EVENTTYPE, onEnvResize);
            }
        }
    };
   
    const onEnvResize = event => {
        clearTimeout(runtimeId);
        runtimeId = setTimeout(function () {
            envQueue.excute();
        }, 200);
    };

    window.addEventListener(EVENTTYPE, onEnvResize);

    return runtime;
}