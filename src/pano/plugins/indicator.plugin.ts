import {Math as TMath} from 'three';
import PluggableUI from '../../interface/ui.interface';
import Util from '../../core/util';
import Tween from '../animations/tween.animation';

/**
 * @file 陀螺仪指示器
 */

export default class Indicator extends PluggableUI {
    pano: any;
    canvas: any;
    degree: any;
    theta: any;
    azimuthal = Math.PI;
    polar = Math.PI / 2;
    animating = false;
    timeId = 0;
    
    constructor(pano) {
        super();

        this.pano = pano;
        this.subscribe(pano.frozen ? this.Topic.SCENE.READY : this.Topic.SCENE.LOAD, this.init.bind(this));
    }

    init() {
        this.createDom();
        this.bindEvents();
        this.gradualDark();
    }

    createDom() {
        const pano = this.pano;
        const element = this.element = Util.createElement(`<div class="pano-indicator"></div>`);
        const canvas = this.canvas = document.createElement('canvas');

        // High DPI Canvas
        canvas.width = 102;
        canvas.height = 102;
        canvas.style.width = '34px';
        canvas.style.height = '34px';
        element.appendChild(canvas);

        this.setContainer(pano.getRoot());
        this.setTheta(this.theta = pano.getLook().lng);
        this.drawIcon();
    }

    /**
     * bind after dom create
     */
    bindEvents() {
        const Topic = this.Topic;

        this.subscribe(Topic.RENDER.PROCESS, this.update.bind(this));
        this.subscribe(Topic.VR.ENTER, this.hide.bind(this));
        this.subscribe(Topic.VR.EXIT, this.show.bind(this));
        this.subscribe(Topic.UI.DRAG, this.cancelDark.bind(this));
        this.element.addEventListener('click', this.reset.bind(this));
    }

    /**
     * 根据 fov degree 绘制 icon
     */
    drawIcon() {
        const canvas = this.canvas;
        const ctx = canvas.getContext('2d');
        const rad = this.calcRad();

        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(0, 0, 0, .5)';
        ctx.shadowBlur = 10;

        ctx.clearRect(0, 0, 102, 102);
        ctx.beginPath();
        ctx.moveTo(51, 51);
        ctx.arc(51, 51, 27, -Math.PI / 2 - rad / 2, -Math.PI / 2 + rad / 2, 0);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * pano fov to rad
     */
    calcRad() {
        return TMath.degToRad(this.degree = this.pano.getFov());
    }

    /**
     * sphere theta
     */
    calcTheta(theta) {
        return theta > 0 ? 180 - theta : -(180 + theta);
    }

    /**
     * 设置指示器的方位角度
     */
    setTheta(theta) {
        this.theta = theta;
        
        const angel = this.calcTheta(theta);
        Util.styleElement(this.canvas, {webkitTransform: `rotate(${angel}deg)`});
    }

    /**
     * too thread:
     *  1. draw degree icon
     *  2. rotate icon
     */
    update() {
        const pano = this.pano;
        const theta = pano.getLook().lng;

        if (!this.animating && theta != this.theta) {
            this.setTheta(theta);
        }

        if (this.degree != pano.getFov()) {
            this.drawIcon();
            this.cancelDark();
        }
    }

    gradualDark() {
        this.timeId = setTimeout(() => this.setOpacity(0.5), 3000);
    }

    cancelDark() {
        clearTimeout(this.timeId);
        this.setOpacity(1);
        this.gradualDark();
    }

    /**
     * 恢复到初始值
     */
    reset(event) {
        event.preventDefault();
        event.stopPropagation();

        this.animating = true;
        this.publish(this.Topic.UI.INDICATORSTART, {pano: this.pano});
        this.cancelDark();

        const pano = this.pano;
        const orbit = pano.getControl();
        const azimuthal = orbit.getAzimuthalAngle();

        pano.makeControl(false);
        new Tween({polar: orbit.getPolarAngle(), azimuthal}, pano['ref'])
            .to({polar: this.polar, azimuthal: (azimuthal > 0 ? this.azimuthal : -this.azimuthal)})
            .effect('sineOut', 500)
            .start(['polar', 'azimuthal']).process((newval, oldval, key) => {
                if (key == 'polar') {
                    orbit.rotateUp(oldval - newval);
                } else {
                    orbit.rotateLeft(oldval - newval);
                    this.setTheta(newval * 180 / Math.PI);
                }
            }).complete(() => this.end());
    }

    /**
     * reset control
     */
    end() {
        this.pano.resetControl();
        this.animating = false;
        this.setTheta(this.theta = 180);
        this.publish(this.Topic.UI.INDICATOREND, {pano: this.pano});
    }

    dispose() {
        super.dispose();
    }
}