import PluggableUI from '../../interface/ui.interface';
import Util from '../../core/util';
import Tween from '../animations/tween.animation';

/**
 * @file 旋转指示器
 */

export default class Indicator extends PluggableUI {
    pano: any;
    theta: any;
    azimuthal = Math.PI;
    polar = Math.PI / 2;
    lock = false;
    
    constructor(pano) {
        super();

        this.pano = pano;
        this.theta = pano.getLook().lng;

        const Topic = this.Topic;
        this.subscribe(pano.frozen ? Topic.SCENE.READY : Topic.SCENE.LOAD, this.createDom.bind(this));
    }

    createDom() {
        const element: any = this.element = Util.createElement('<div class="pano-indicator"></div>');
        this.setContainer();
        this.subscribe(this.Topic.RENDER.PROCESS, this.update.bind(this));
        element.addEventListener('click', this.reset.bind(this));
        element.addEventListener('webkitTransitionEnd', this.end.bind(this));
        this.setTheta(this.pano.getLook().lng); 
    }

    setContainer() {
        this.pano.getRoot().appendChild(this.element);
    }

    calcTheta(theta) {
        return theta > 0 ? 180 - theta : -(180 + theta);
    }

    /**
     * 设置方位角度
     */
    setTheta(theta) {
        this.theta = theta;
        theta = this.calcTheta(theta);
        Util.styleElement(this.element, {webkitTransform: `rotate(${theta}deg)`});
    }

    update() {
        const pano = this.pano;
        const theta = pano.getLook().lng;

        if (!this.lock && theta != this.theta) {
           this.setTheta(theta)
        }
    }

    /**
     * 将方位角恢复到 Math.PI
     */
    reset(event) {
        event.preventDefault();
        event.stopPropagation();

        this.lock = true;
        const pano = this.pano;
        const orbit = pano.getControl();
        const azimuthal = orbit.getAzimuthalAngle();
        const polar = orbit.getPolarAngle();
        const target = {azimuthal: (azimuthal > 0 ? this.azimuthal : -this.azimuthal)};
        
        pano.gyro && pano.gyro.makeEnable(false);
        new Tween({polar}).to({polar: this.polar}).effect('quadEaseOut', 400)
            .start(['polar']).process((newval, oldval) => {
                orbit.rotateUp(oldval - newval);
            });

        new Tween({azimuthal}).to(target).effect('quadEaseOut', 500)
            .start(['azimuthal']).process((newval, oldval) => {
                orbit.rotateLeft(oldval - newval);
                this.setTheta(newval * 180 / Math.PI);
            }).complete(() => this.end());
    }

    end() {
        const pano = this.pano;

        pano.gyro && pano.gyro.reset();
        this.lock = false;
        this.setTheta(this.theta = 180);
    }

    dispose() {
        super.dispose();
    }
}