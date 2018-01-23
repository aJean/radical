import {PerspectiveCamera, Vector3, Euler, Quaternion, Spherical, Math as TMath, Camera} from 'three';

/**
 * @file 陀螺仪控制器
 */

export default class DeviceControl {
    control: any;
    onDeviceOrientationChangeEvent: any;
    onScreenOrientationChangeEvent: any;
    camera: any;
    lastSpherical: any;
    enabled = false;
    deviceOrientation: any = {};
    screenOrientation = 0;
    alphaOffsetAngle = 0;
    zee = new Vector3(0, 0, 1);
    euler = new Euler();
    q0 = new Quaternion();
    // - PI/2 around the x-axis
    q1 = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
    spherical = new Spherical();
    detaSpherical = new Spherical();

    constructor(camera, control) {
        camera.rotation.reorder('YXZ');
        control.update();

        this.camera = camera.clone();
        this.control = control;
        this.onDeviceOrientationChangeEvent = event => {
            this.deviceOrientation = event;
        };

        this.onScreenOrientationChangeEvent = event => {
            this.screenOrientation = Number(window.orientation) || 0;
        };
    }

    /** 
     * The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X-Y
     */
    setObjectQuaternion(quaternion, alpha, beta, gamma, orient) {
        // 'ZXY' for the device, but 'YXZ' for us
        this.euler.set(beta, alpha, -gamma, 'YXZ');
        // orient the device
        quaternion.setFromEuler(this.euler);
        // camera looks out the back of the device, not the top
        quaternion.multiply(this.q1);
        // adjust for screen orientation
        quaternion.multiply(this.q0.setFromAxisAngle(this.zee, -orient));
        // 相机初始观看方向向量
        this.spherical.setFromVector3(this.camera.getWorldDirection());

        const spherical = this.spherical;
        const detaSpherical = this.detaSpherical;
        let lastSpherical = this.lastSpherical;

        // 计算设备方向的增量
        if (lastSpherical) {
            detaSpherical.theta = spherical.theta - lastSpherical.theta;
            detaSpherical.phi = -spherical.phi + lastSpherical.phi;
            // 将偏移角度传给 orbitControl 计算 camera
            this.control.update(detaSpherical);
        } else {
            lastSpherical = this.lastSpherical = new Spherical();
        }

        lastSpherical.theta = spherical.theta;
        lastSpherical.phi = spherical.phi;
    }

    connect() {
        // run once on load
        this.onScreenOrientationChangeEvent();
        this.enabled = true;

        window.addEventListener('orientationchange', this.onScreenOrientationChangeEvent, false);
        window.addEventListener('deviceorientation', this.onDeviceOrientationChangeEvent, false);
    }

    disconnect() {
        window.removeEventListener('orientationchange', this.onScreenOrientationChangeEvent, false);
        window.removeEventListener('deviceorientation', this.onDeviceOrientationChangeEvent, false);

        this.enabled = false;
        this.lastSpherical = null;
        this.deviceOrientation = {};
        this.screenOrientation = 0;
    }

    update() {
        // z
        const alpha = this.deviceOrientation.alpha ? TMath.degToRad(this.deviceOrientation.alpha) : 0;
        // x
        const beta = this.deviceOrientation.beta ? TMath.degToRad(this.deviceOrientation.beta) : 0;
        // y
        const gamma = this.deviceOrientation.gamma ? TMath.degToRad(this.deviceOrientation.gamma) : 0;
        const orient = this.screenOrientation ? TMath.degToRad(this.screenOrientation) : 0;

        if (alpha === 0 && beta === 0 && gamma === 0 && orient === 0) {
            return;
        }

        this.setObjectQuaternion(this.camera.quaternion, alpha, beta, gamma, orient);
    }

    updateAlphaOffsetAngle(angle) {
        this.alphaOffsetAngle = angle;
        this.update();
    }
}