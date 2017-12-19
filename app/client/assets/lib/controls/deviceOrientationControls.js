/**
 * @file 陀螺仪控制器
 * @author liwenhui(liwenhui01@baidu.com)
 */
/* globals THREE WebVR*/
THREE.DeviceOrientationControls = function (object, controls) {
    
        var scope = this;
        var lastSpherical;
        this.object = object;
        this.object.rotation.reorder('YXZ');
    
        this.enabled = false;
    
        this.deviceOrientation = {};
        this.screenOrientation = 0;
    
        this.alphaOffsetAngle = 0;
    
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 10000);
    
    
        var onDeviceOrientationChangeEvent = function (event) {
    
            scope.deviceOrientation = event;
    
        };
    
        var onScreenOrientationChangeEvent = function () {
    
            scope.screenOrientation = window.orientation || 0;
    
        };
    
        /* The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''*/
    
        var setObjectQuaternion = (function () {
    
            var zee = new THREE.Vector3(0, 0, 1);
    
            var euler = new THREE.Euler();
    
            var q0 = new THREE.Quaternion();
    
            var q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis
    
            var lookAt;
    
            var spherical = new THREE.Spherical();
            var detaSpherical = new THREE.Spherical();
    
            var disMin = 0.002;
            var disMax = 0.008;
            var currentDisLevel = disMax;
    
            return function (quaternion, alpha, beta, gamma, orient) {
    
                euler.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us
    
                quaternion.setFromEuler(euler); // orient the device
    
                quaternion.multiply(q1); // camera looks out the back of the device, not the top
    
                quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation
    
                lookAt = scope.camera.getWorldDirection();
                spherical.setFromVector3(lookAt);
    
                spherical.setFromVector3(lookAt);
                if (lastSpherical) {
                    detaSpherical.theta = spherical.theta - lastSpherical.theta;
                    detaSpherical.phi = -spherical.phi + lastSpherical.phi;
                    // var dis = Math.sqrt(detaSpherical.theta * detaSpherical.theta + detaSpherical.phi * detaSpherical.phi);
                    // if(dis>currentDisLevel){
                    //     controls.update(detaSpherical);
                    //     currentDisLevel = disMin;
                    // }else if(dis<currentDisLevel){
                    //     currentDisLevel = disMax;
                    // }
                    controls.update(detaSpherical);
                }
                else {
                    lastSpherical = new THREE.Spherical();
                }
                lastSpherical.theta = spherical.theta;
                lastSpherical.phi = spherical.phi;
            };
    
        }());
    
        this.connect = function () {
    
            onScreenOrientationChangeEvent(); // run once on load
    
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
    
            var alpha = scope.deviceOrientation.alpha ? THREE.Math.degToRad(scope.deviceOrientation.alpha) : 0;
            var beta = scope.deviceOrientation.beta ? THREE.Math.degToRad(scope.deviceOrientation.beta) : 0; // X'
            var gamma = scope.deviceOrientation.gamma ? THREE.Math.degToRad(scope.deviceOrientation.gamma) : 0; // Y''
            var orient = scope.screenOrientation ? THREE.Math.degToRad(scope.screenOrientation) : 0; // O
    
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
    };