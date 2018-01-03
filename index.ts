import './styles/panoram.style.less';
import './styles/multiple.style.less';
import './styles/overlay.style.less';
import Runtime from './src/runtime';

window['bxl'] = {
    start(source, el, events?) {
        Runtime.start(source, el, events);
    },

    getPanoram(ref: string) {
        return Runtime.getInstance(ref);
    }
};