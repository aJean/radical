import '../styles/pano.style.less';
import '../styles/multiple.style.less';
import '../styles/overlays.style.less';
import '../styles/ui.style.less';
import VRuntime from './runtime/vr.runtime';

/**
 * @file bxl lib
 */

export default {
    start(source, el, events?) {
        VRuntime.start(source, el, events);
    },

    getPano(ref: string) {
        return VRuntime.getInstance(ref);
    },

    dispose(ref: string) {
        return VRuntime.releaseInstance(ref);
    }
};