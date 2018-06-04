import Pano from '../pano/pano';
import VrControl from './control.vr';
import VrEffect from './effect.vr';
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

        this.effectRender = new VrEffect(this.webgl);
        this.getDisplay().then(display => this.display = display);
    }

    animate() {
        this.updateControl();
        this.dispatch('render-process', this.currentData, this);

        this.effectRender.render(this.scene, this.camera);
        this.reqid = this.effectRender.requestAnimationFrame(this.animate.bind(this));
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

    /**
     * 获取左相机
     */
    getCameraL() {
        return this.effectRender.cameraL;
    }

    /**
     * 获取右相机
     */
    getCameraR() {
        return this.effectRender.cameraR;
    }

    dispose() {
        super.dispose();
        this.effectRender.cancelAnimationFrame(this.reqid);
    }

    /**
     * 进入 vr 模式
     */
    enter() {
        this.state = 1;
        this.dispatch('vr-enter', this);

        return this.display.requestPresent([{source: this.webgl.domElement}]);
    }

    /**
     * 退入 vr 模式
     */
    exit() {
        this.state = 0;
        this.dispatch('vr-exit', this);

        return this.display.exitPresent();
    }
}