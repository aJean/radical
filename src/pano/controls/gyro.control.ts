import {PerspectiveCamera, Vector3, Euler, Quaternion, Spherical, Math as TMath, Camera} from 'three';

/**
 * @file gyro control
 * 翻转到底部临界时会因为 orbit control 触发旋转
 */

export default class GyroControl {
    control: any;
    onDeviceOrientationChangeEvent: any;
    onScreenOrientationChangeEvent: any;
    camera: any;
    lastSpherical: any;
    enabled = false;
    deviceOrien: any = {};
    screenOrien = 0;
    alphaOffset = 0;
    zee = new Vector3(0, 0, 1);
    euler = new Euler();
    q0 = new Quaternion();
    // - PI/2 around the x-axis
    q1 = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
    spherical = new Spherical();
    diffSpherical = new Spherical();

    constructor(camera, control) {
        camera.rotation.reorder('YXZ');

        this.camera = camera.clone();
        this.control = control;
        this.onDeviceOrientationChangeEvent = event => this.deviceOrien = event;
        this.onScreenOrientationChangeEvent = event => this.screenOrien = Number(window.orientation) || 0;
    }

    /** 
     * The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''
     */
    calcQuaternion(alpha, beta, gamma, orient) {
        // 'ZXY' for the device, but 'YXZ' for us
        this.euler.set(beta, alpha, -gamma, 'YXZ');

        const camera = this.camera;
        const spherical = this.spherical;
        const diffSpherical = this.diffSpherical;
        const quaternion = this.camera.quaternion;

        // orient the device
        quaternion.setFromEuler(this.euler);
        // 设备初始为平放状态，这里将手机竖起来符合用户习惯
        quaternion.multiply(this.q1);
        // 竖屏 or 横屏
        quaternion.multiply(this.q0.setFromAxisAngle(this.zee, -orient));
        // imu 变化转为球面坐标
        spherical.setFromVector3(camera.getWorldDirection());

        let lastSpherical = this.lastSpherical;
        
        // 计算设备方向的增量
        if (lastSpherical) {
            diffSpherical.set(1, -spherical.phi + lastSpherical.phi, spherical.theta - lastSpherical.theta);
            this.control.update(diffSpherical);
        } else {
            lastSpherical = this.lastSpherical = new Spherical();
        }

        lastSpherical.set(1, spherical.phi, spherical.theta);
    }

    connect() {
        window.addEventListener('orientationchange', this.onScreenOrientationChangeEvent, false);
        window.addEventListener('deviceorientation', this.onDeviceOrientationChangeEvent, false);
        // run once on load
        this.onScreenOrientationChangeEvent();
        this.enabled = true;
    }

    disconnect() {
        window.removeEventListener('orientationchange', this.onScreenOrientationChangeEvent, false);
        window.removeEventListener('deviceorientation', this.onDeviceOrientationChangeEvent, false);

        this.enabled = false;
        this.lastSpherical = null;
        this.deviceOrien = {};
        this.screenOrien = 0;
    }

    update() {
        // z axis 0 ~ 360
        const alpha = this.deviceOrien.alpha ? TMath.degToRad(this.deviceOrien.alpha) : 0;
        // x axis -180 ~ 180
        const beta = this.deviceOrien.beta ? TMath.degToRad(this.deviceOrien.beta) : 0;
        // y axis -90 ~ 90
        const gamma = this.deviceOrien.gamma ? TMath.degToRad(this.deviceOrien.gamma) : 0;
        // landscape or vertical
        const orient = this.screenOrien ? TMath.degToRad(this.screenOrien) : 0;

        if (alpha === 0 && beta === 0 && gamma === 0 && orient === 0) {
            return;
        }

        this.calcQuaternion(alpha.toFixed(5), beta.toFixed(5), gamma.toFixed(5), orient);
    }

    /**
     * 初始 z 轴旋转角度
     * @param {number} angle 
     */
    updateAlphaOffset(angle) {
        this.alphaOffset = angle;
        this.update();
    }
}