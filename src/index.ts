import '../styles/pano.style.less';
import '../styles/multiple.style.less';
import '../styles/overlays.style.less';
import '../styles/ui.style.less';
import polyfill from './core/polyfill';
import PanoRuntime from './runtime/pano.runtime';
import VRuntime from './runtime/vr.runtime';

/**
 * @file bxl lib
 */

polyfill();
export default {
    startPano(url, el, events?) {
        PanoRuntime.start(url, el, events);
    },

    getPano(ref: string) {
        return PanoRuntime.getInstance(ref);
    },

    disposePano(ref: string) {
        return PanoRuntime.releaseInstance(ref);
    },

    startVR(url, el) {
        VRuntime.start(url, el);
    }
};