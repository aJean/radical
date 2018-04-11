import '../styles/pano.style.less';
import '../styles/multiple.style.less';
import '../styles/overlays.style.less';
import '../styles/ui.style.less';
import Detect from './core/detect';
import polyfill from './core/polyfill';
import PRuntime from './runtime/pano.runtime';
import VRuntime from './runtime/vr.runtime';

/**
 * @file bxl lib
 */

polyfill();
export default {
    detect: Detect,

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
        VRuntime.start(url, el);
    }
};