import Pano from '../pano/pano';
import VRControl from '../pano/controls/vr.control';
import VREffect from './effect.vr';
import Helper from '../vr/helper.vr';
import Util from '../core/util';

/**
 * @file vr pano
 */

export default class VPano extends Pano {
    type = 'vr-pano';
    effectRender: any;

    constructor (el, source) {
        super(el, source);

        this.effectRender = new VREffect(this.webgl);
        Helper.createButton(this.webgl);
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
        const size =  this.size = Util.calcRenderSize(root);

        camera.aspect = size.aspect;
        camera.updateProjectionMatrix();
        this.effectRender.setSize(size.width, size.height);
    }
}