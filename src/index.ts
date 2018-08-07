import '../styles/pano.style.less';
import '../styles/multiple.style.less';
import '../styles/overlays.style.less';
import '../styles/ui.style.less';
import '../styles/vr.style.less';
import polyfill from './core/polyfill';
import PRuntime from './runtime/pano.runtime';
import VRuntime from './runtime/vr.runtime';

/**
 * @file bxl lib
 */

polyfill();

// auto render
const pastLoad = window.onload;
window.onload = function () {
    pastLoad && pastLoad.call(this);

    const pnodeList = Array.from(document.querySelectorAll('pano'));
    const vnodeList = Array.from(document.querySelectorAll('vpano'));

    pnodeList.forEach(node => {
        node.getAttribute('auto') && PRuntime.start(node.getAttribute('source'), node);
    });

    vnodeList.forEach(node => {
        node.getAttribute('auto') && VRuntime.start(node.getAttribute('source'), node);
    });
};

export default {
    startPano(url, el, events ? ) {
        PRuntime.start(url, el, events);
    },

    getPano(ref: string) {
        return PRuntime.getInstance(ref);
    },

    disposePano(ref: string) {
        PRuntime.releaseInstance(ref);
    },

    startVR(url, el, events ? ) {
        VRuntime.start(url, el, events);
    },

    getVPano(ref: string) {
        return VRuntime.getInstance(ref);
    },

    disposeVR(ref: string) {
        VRuntime.releaseInstance(ref);
    }
}