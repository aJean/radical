import {PerspectiveCamera, Vector3, Euler, Quaternion, Spherical, Math as TMath} from 'three';

/**
 * @file 陀螺仪控制器
 */

function DeviceControl(object, controls) {
    var scope = this;
    var lastSpherical;

    this.object = object;
    this.object.rotation.reorder('YXZ');

    this.enabled = false;

    this.deviceOrientation = {};
    this.screenOrientation = 0;

    this.alphaOffsetAngle = 0;

    this.camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 10000);


    var onDeviceOrientationChangeEvent = function (event) {
        scope.deviceOrientation = event;
    };

    var onScreenOrientationChangeEvent = function () {
        scope.screenOrientation = window.orientation || 0;
    };

    /* The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''*/
    var setObjectQuaternion = (function () {
        var zee = new Vector3(0, 0, 1);
        var euler = new Euler();
        var q0 = new Quaternion();
        // - PI/2 around the x-axis
        var q1 = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
        var lookAt;

        var spherical = new Spherical();
        var detaSpherical = new Spherical();

        var disMin = 0.002;
        var disMax = 0.008;
        var currentDisLevel = disMax;

        return function (quaternion, alpha, beta, gamma, orient) {
            // 'ZXY' for the device, but 'YXZ' for us
            euler.set(beta, alpha, -gamma, 'YXZ');
            // orient the device
            quaternion.setFromEuler(euler);
            // camera looks out the back of the device, not the top
            quaternion.multiply(q1);
            // adjust for screen orientation
            quaternion.multiply(q0.setFromAxisAngle(zee, -orient));

            lookAt = scope.camera.getWorldDirection();
            spherical.setFromVector3(lookAt);

            spherical.setFromVector3(lookAt);

            if (lastSpherical) {
                detaSpherical.theta = spherical.theta - lastSpherical.theta;
                detaSpherical.phi = -spherical.phi + lastSpherical.phi;
                // 将偏移角度传给 orbitControl 计算 camera
                controls.update(detaSpherical);
            } else {
                lastSpherical = new Spherical();
            }

            lastSpherical.theta = spherical.theta;
            lastSpherical.phi = spherical.phi;
        };

    }());

    this.connect = function () {
        // run once on load
        onScreenOrientationChangeEvent();

        window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);
        window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
        scope.enabled = true;
    };

    this.disconnect = function () {
        window.removeEventListener('orientationchange', onScreenOrientationChangeEvent, false);
        window.removeEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);

        scope.enabled = false;
        lastSpherical = null;
        scope.deviceOrientation = {};
        scope.screenOrientation = 0;
    };

    this.update = function () {
        if (scope.enabled === false) {
            return;
        }

        var alpha = scope.deviceOrientation.alpha ? TMath.degToRad(scope.deviceOrientation.alpha) : 0;
        var beta = scope.deviceOrientation.beta ? TMath.degToRad(scope.deviceOrientation.beta) : 0; // X'
        var gamma = scope.deviceOrientation.gamma ? TMath.degToRad(scope.deviceOrientation.gamma) : 0; // Y''
        var orient = scope.screenOrientation ? TMath.degToRad(scope.screenOrientation) : 0; // O

        if (alpha === 0 && beta === 0 && gamma === 0 && orient === 0) {
            return;
        }
        setObjectQuaternion(scope.camera.quaternion, alpha, beta, gamma, orient);
    };

    this.updateAlphaOffsetAngle = function (angle) {
        this.alphaOffsetAngle = angle;
        this.update();
    };

    this.dispose = function () {
        this.disconnect();
    };
}

export default DeviceControl;