import Pano from '../pano/pano';
import VRControl from '../pano/controls/vr.control';
import VREffect from './effect.vr';

/**
 * @file vr pano decorator 
 */

export default class VPano {
    pano: Pano;
    type = 'vr-pano';

    constructor (el, source) {
        this.pano = new Pano(el, source);
    }
    
    deco() {
        const pano = this.pano;
        const effect = new VREffect(pano.webgl);

        pano.orbit = new VRControl(pano.camera);
        pano.animate = function() {
            this.updateControl();
            this.dispatch('render-process', this.currentData, this);
            effect.render(this.scene, this.camera);

            effect.requestAnimationFrame(this.animate.bind(this));
        };

        delete pano.gyro;

        return pano;
    }
}