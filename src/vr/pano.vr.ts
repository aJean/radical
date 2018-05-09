import Pano from '../pano/pano';
import VRControl from '../pano/controls/vr.control';
import VREffect from './effect.vr';
import Util from '../core/util';

/**
 * @file vr pano
 */

export default class VPano extends Pano {
    type = 'vr-pano';
    effectRender: any;
    display: any;
    state = 0;

    constructor (el, source) {
        super(el, source);

        if (window['WebVRPolyfill']) {
            const polyfill = new window['WebVRPolyfill']({
                PROVIDE_MOBILE_VRDISPLAY: true,
                CARDBOARD_UI_DISABLED: true
            });
        }

        this.effectRender = new VREffect(this.webgl);
        this.getDisplay().then(display => this.display = display);
    }

    animate() {
        this.updateControl();
        this.dispatch('render-process', this.currentData, this);
        this.effectRender.render(this.scene, this.camera);

        this.effectRender.requestAnimationFrame(this.animate.bind(this));
    }

    onResize() {
        const camera = this.getCamera();
        const root = this.getRoot();
        const size = this.size = Util.calcRenderSize(root);

        camera.aspect = size.aspect;
        camera.updateProjectionMatrix();
        this.effectRender.setSize(size.width, size.height);
    }

    getDisplay() {
        return navigator.getVRDisplays().then(displays => displays.length > 0 ? displays[0] : null);
    }

    getCameraL() {
        return this.effectRender.cameraL;
    }

    getCameraR() {
        return this.effectRender.cameraR;
    }

    enter() {
        this.state = 1;
        return this.display.requestPresent([{
            source: this.webgl.domElement
        }]);
    }

    exit() {
        this.state = 0;
        return this.display.exitPresent();
    }
}