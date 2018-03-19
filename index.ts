import './styles/pano.style.less';
import './styles/multiple.style.less';
import './styles/overlays.style.less';
import './styles/ui.style.less';
import VR from './src/runtime/vr.runtime';
import AR from './src/runtime/ar.runtime';

/**
 * @file bxl lib
 */

export default {
    start(source, el, events?) {
        VR.start(source, el, events);
    },

    getPano(ref: string) {
        return VR.getInstance(ref);
    },

    dispose(ref: string) {
        return VR.releaseInstance(ref);
    },
    
    testAR() {
        new AR();
    }
};