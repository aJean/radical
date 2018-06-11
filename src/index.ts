import '../styles/pano.style.less';
import '../styles/multiple.style.less';
import '../styles/overlays.style.less';
import '../styles/ui.style.less';
import '../styles/vr.style.less';
import polyfill from './core/polyfill';
import PRuntime from './runtime/pano.runtime';
import VRuntime from './runtime/vr.runtime';
import PubSub from './core/pubsub';

/**
 * @file bxl lib
 */

polyfill();
export default {
    startPano(url, el, events?) {
        PRuntime.start(url, el, events);
    },

    getPano(ref: string) {
        return PRuntime.getInstance(ref);
    },

    disposePano(ref: string) {
        PRuntime.releaseInstance(ref);
    },

    startVR(url, el, events?) {
        VRuntime.start(url, el, events);
    },

    /**
     * 业务方发布事件
     * @param {string} topic 
     * @param {Object} data 
     */
    publish(topic, data) {
        PubSub.publish(topic, data);
    }
};