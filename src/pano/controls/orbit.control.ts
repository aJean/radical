import {Vector3, Vector2, MOUSE, Spherical, EventDispatcher, Quaternion, PerspectiveCamera, OrthographicCamera} from 'three';
import Util from '../../core/util';

/**
 * @file 全景相机控制器
 */

function OrbitControl(camera, domElement, pano) {
    this.pano = pano;
    // camera
    this.camera = camera;
    this.domElement = (domElement !== undefined) ? domElement : document;
    // Set to false to disable this control
    this.enabled = false;
    // look at panoram's front
    this.target = new Vector3(0, 0, 1);
    // How far you can dolly in and out ( PerspectiveCamera only )
    this.minDistance = 0;
    this.maxDistance = Infinity;
    this.minFov = 30;
    this.maxFov = 120;
    // How far you can zoom in and out ( OrthographicCamera only )
    this.minZoom = 0;
    this.maxZoom = Infinity;
    /* How far you can orbit vertically, upper and lower limits. */
    /* Range is 0 to Math.PI radians.*/
    this.minPolarAngle = 0;
    this.maxPolarAngle = Math.PI;
    /* How far you can orbit horizontally, upper and lower limits. */
    /* If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ]. */
    this.minAzimuthAngle = -Infinity;
    this.maxAzimuthAngle = Infinity;
    /* Set to true to enable damping (inertia) */
    /* If damping is enabled, you must call controls.update() in your animation loop */
    this.enableDamping = false;
    this.dampingFactor = 0.25;
    /* This option actually enables dollying in and out; left as "zoom" for backwards compatibility. */
    /* Set to false to disable zooming */
    this.enableZoom = true;
    this.zoomSpeed = 1.0;
    /* Set to false to disable rotating */
    this.enableRotate = true;
    this.rotateSpeed = -0.2;
    /* Set to false to disable panning */
    this.enablePan = false;
    this.keyPanSpeed = 7.0;
    /* pixels moved per arrow key push */
    /* Set to true to automatically rotate around the target */
    /* If auto-rotate is enabled, you must call controls.update() in your animation loop */
    this.autoRotate = false;
    this.autoRotateSpeed = 1.0;
    /* 30 seconds per round when fps is 60 */
    /* Set to false to disable use of the keys */
    this.enableKeys = false;
    // The four arrow keys
    this.keys = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        BOTTOM: 40
    };
    // Mouse buttons
    this.mouseButtons = {
        ORBIT: MOUSE.LEFT,
        ZOOM: MOUSE.MIDDLE,
        PAN: MOUSE.RIGHT
    };
    // for reset
    this.target0 = this.target.clone();
    this.position0 = this.camera.position.clone();
    this.zoom0 = this.camera.zoom;

    // current position in spherical coordinates
    var spherical = new Spherical();
    // var sphericalDelta = new THREE.Spherical(1, Math.PI/2, Math.PI );
    var sphericalDelta = new Spherical();
    var scope = this;
    var changeEvent = {
        type: 'change'
    };
    var startEvent = {
        type: 'start'
    };
    var endEvent = {
        type: 'end'
    };
    var STATE = {
        NONE: -1,
        ROTATE: 0,
        DOLLY: 1,
        PAN: 2,
        TOUCH_ROTATE: 3,
        TOUCH_DOLLY: 4,
        TOUCH_PAN: 5,
        SLIDER: 6
    };
    var state = STATE.NONE;
    var EPS = 0.000001;
    var scale = 1;
    var panOffset = new Vector3();
    var zoomChanged = false;
    var rotateStart = new Vector2();
    var rotateEnd = new Vector2();
    var rotateDelta = new Vector2();
    var panStart = new Vector2();
    var panEnd = new Vector2();
    var panDelta = new Vector2();
    var dollyStart = new Vector2();
    var dollyEnd = new Vector2();
    var dollyDelta = new Vector2();

    this.getPolarAngle = function () {
        return spherical.phi;
    };

    this.setPolarAngle = function (phi) {
        spherical.phi = phi;
    };

    this.getAzimuthalAngle = function () {
        return spherical.theta;
    };

    this.setAzimuthalAngle = function(theta) {
        spherical.theta = theta;
    }

    this.saveState = function () {
        scope.target0.copy(scope.target);
        scope.position0.copy(scope.camera.position);
        scope.zoom0 = scope.camera.zoom;
    };

    /* flag: 星际穿越到背面 */
    this.reset = function (flag = true) {
        scope.target.copy(flag ? scope.target0 : new Vector3(0, 0, -1));
        scope.camera.position.copy(scope.position0);
        scope.camera.zoom = scope.zoom0;
        scope.camera.updateProjectionMatrix();
        scope.dispatchEvent(changeEvent);
        scope.update();
        scope.enabled = true;
        state = STATE.NONE;
    };

    /* this method is exposed, but perhaps it would be better if we can make it private... */
    this.update = (function () {
        var offset = new Vector3();
        /* so camera.up is the orbit axis */
        var quat = new Quaternion().setFromUnitVectors(camera.up, new Vector3(0, 1, 0));
        var quatInverse = quat.clone().inverse();
        var lastPosition = new Vector3();
        var lastQuaternion = new Quaternion();
        return function update(gyroTheta, gyroPhi) {
            var position = scope.camera.position;
            offset.copy(position).sub(scope.target);
            /* rotate offset to "y-axis-is-up" space */
            offset.applyQuaternion(quat);
            /* angle from z-axis around y-axi */
            spherical.setFromVector3(offset);

            if (scope.autoRotate && state === STATE.NONE) {
                rotateLeft(getAutoRotationAngle());
            } else if (state === STATE.SLIDER) {
                if (rotateDelta.length() > 0.35) {
                    /* rotating across whole screen goes 360 degrees around */
                    var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
                    rotateDelta.setLength(rotateDelta.length() * 0.90);
                    rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);
                    /* rotating up and down along whole screen attempts to go 360, but limited to 180 */
                    /* constraint.rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * selfClass.rotateSpeed); */
                } else {
                    state = STATE.NONE;
                }
            }
            // 陀螺仪的增量
            if (gyroTheta || gyroPhi) {
                spherical.theta += gyroTheta;
                spherical.phi += gyroPhi;
            }

            spherical.theta += sphericalDelta.theta;
            spherical.phi += sphericalDelta.phi;
            /* restrict theta to be between desired limits */
            spherical.theta = Math.max(scope.minAzimuthAngle, Math.min(scope.maxAzimuthAngle, spherical.theta));
            /* restrict phi to be between desired limits */
            spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));
            spherical.makeSafe();
            // 缩放
            if (scale !== 1) {
                scope.camera.fov *= scale;
                if (scope.camera.fov > scope.maxFov) {
                    scope.camera.fov = scope.maxFov;
                } else if (scope.camera.fov < scope.minFov) {
                    scope.camera.fov = scope.minFov;
                }
                scope.camera.updateProjectionMatrix();
            }
            // move target to panned location
            scope.target.add(panOffset);
            offset.setFromSpherical(spherical);
            // rotate offset back to "camera-up-vector-is-up" space
            offset.applyQuaternion(quatInverse);
            position.copy(scope.target).add(offset);
            // camera lookat
            scope.camera.lookAt(scope.target);

            if (scope.enableDamping === true) {
                sphericalDelta.theta *= (1 - scope.dampingFactor);
                sphericalDelta.phi *= (1 - scope.dampingFactor);
            } else {
                sphericalDelta.set(0, 0, 0);
            }
            scale = 1;
            panOffset.set(0, 0, 0);
            /**
             * update condition is:
             * min(camera displacement, camera rotation in radians)^2 > EPS
             * using small-angle approximation cos(x/2) = 1 - x^2 / 8
             **/
            if (zoomChanged
                || lastPosition.distanceToSquared(scope.camera.position) > EPS
                || 8 * (1 - lastQuaternion.dot(scope.camera.quaternion)) > EPS) {
                scope.dispatchEvent(changeEvent);
                lastPosition.copy(scope.camera.position);
                lastQuaternion.copy(scope.camera.quaternion);
                zoomChanged = false;
                return true;
            }
            return false;
        };
    }());

    this.dispose = function () {
        scope.domElement.removeEventListener('contextmenu', onContextMenu, false);
        scope.domElement.removeEventListener('mousedown', onMouseDown, false);
        scope.domElement.removeEventListener('wheel', onMouseWheel, false);
        scope.domElement.removeEventListener('touchstart', onTouchStart, false);
        scope.domElement.removeEventListener('touchend', onTouchEnd, false);
        scope.domElement.removeEventListener('touchmove', onTouchMove, false);
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);
    };

    function getAutoRotationAngle() {
        return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
    }

    function getZoomScale() {
        return Math.pow(0.95, scope.zoomSpeed);
    }

    this.rotateLeft = function (angle) {
        rotateLeft(angle);
    };

    this.rotateUp = function (angle) {
        rotateUp(angle);
    };

    function rotateLeft(angle) {
        sphericalDelta.theta -= angle;
    }

    function rotateUp(angle) {
        sphericalDelta.phi -= angle;
    }

    var panLeft = (function () {
        var v = new Vector3();
        return function panLeft(distance, objectMatrix) {
            v.setFromMatrixColumn(objectMatrix, 0);
            // get X column of objectMatrix
            v.multiplyScalar(-distance);
            panOffset.add(v);
        };
    }());

    var panUp = (function () {
        var v = new Vector3();
        return function panUp(distance, objectMatrix) {
            v.setFromMatrixColumn(objectMatrix, 1);
            // get Y column of objectMatrix
            v.multiplyScalar(distance);
            panOffset.add(v);
        };
    }());

    // deltaX and deltaY are in pixels; right and down are positive
    var pan = (function () {
        var offset = new Vector3();
        return function pan(deltaX, deltaY) {
            var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
            if (scope.camera instanceof PerspectiveCamera) {
                // perspective
                var position = scope.camera.position;
                offset.copy(position).sub(scope.target);
                var targetDistance = offset.length();
                // half of the fov is center to top of screen
                targetDistance *= Math.tan((scope.camera.fov / 2) * Math.PI / 180.0);
                // we actually don't use screenWidth, since perspective camera is fixed to screen height
                panLeft(2 * deltaX * targetDistance / element.clientHeight, scope.camera.matrix);
                panUp(2 * deltaY * targetDistance / element.clientHeight, scope.camera.matrix);
            } else if (scope.camera instanceof OrthographicCamera) {
                // orthographic
                panLeft(deltaX * (scope.camera.right - scope.camera.left) / scope.camera.zoom / element.clientWidth,
                    scope.camera.matrix);
                panUp(deltaY * (scope.camera.top - scope.camera.bottom) / scope.camera.zoom / element.clientHeight,
                    scope.camera.matrix);
            } else {
                // camera neither orthographic nor perspective
                console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
                scope.enablePan = false;
            }
        };
    }());

    function dollyIn(dollyScale) {
        if (scope.camera instanceof PerspectiveCamera) {
            scale /= dollyScale;
        } else if (scope.camera instanceof OrthographicCamera) {
            scope.camera.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.camera.zoom * dollyScale));
            scope.camera.updateProjectionMatrix();
            zoomChanged = true;
        } else {
            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            scope.enableZoom = false;
        }
    }

    function dollyOut(dollyScale) {
        if (scope.camera instanceof PerspectiveCamera) {
            scale *= dollyScale;
        } else if (scope.camera instanceof OrthographicCamera) {
            scope.camera.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.camera.zoom / dollyScale));
            scope.camera.updateProjectionMatrix();
            zoomChanged = true;
        } else {
            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            scope.enableZoom = false;
        }
    }

    /*
     * event callbacks - update the object state
     */
    function handleMouseDownRotate(event) {
        rotateStart.set(event.clientX, event.clientY);    
    }

    function handleMouseDownDolly(event) {
        dollyStart.set(event.clientX, event.clientY);
    }

    function handleMouseDownPan(event) {
        panStart.set(event.clientX, event.clientY);
    }

    function handleMouseMoveRotate(event) {
        rotateEnd.set(event.clientX, event.clientY);
        rotateDelta.subVectors(rotateEnd, rotateStart);
        var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
        // rotating across whole screen goes 360 degrees around
        rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);
        // rotating up and down along whole screen attempts to go 360, but limited to 180
        rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);
        rotateStart.copy(rotateEnd);
        scope.update();

        if (!_rotatestart) {
            _rotatestart = Util.calcScreenToSphere({x: 0, y: 0}, scope.camera);
        }
    }

    function handleMouseMoveDolly(event) {
        dollyEnd.set(event.clientX, event.clientY);
        dollyDelta.subVectors(dollyEnd, dollyStart);
        if (dollyDelta.y > 0) {
            dollyIn(getZoomScale());
        } else if (dollyDelta.y < 0) {
            dollyOut(getZoomScale());
        }
        dollyStart.copy(dollyEnd);
        scope.update();
    }

    function handleMouseMovePan(event) {
        panEnd.set(event.clientX, event.clientY);
        panDelta.subVectors(panEnd, panStart);
        pan(panDelta.x, panDelta.y);
        panStart.copy(panEnd);
        scope.update();
    }

    function handleMouseUp(event) {
        if (_rotatestart) {
            //TODO: prevent to dispatch click
            const pano = scope.pano;
            const end = Util.calcScreenToSphere({x: 0, y: 0}, scope.camera);
            pano.publish(pano.Topic.UI.DRAG, {start: _rotatestart, end, pano});
        }
        _rotatestart = null;
    }

    function handleMouseWheel(event) {
        if (event.deltaY < 0) {
            dollyOut(getZoomScale());
        } else if (event.deltaY > 0) {
            dollyIn(getZoomScale());
        }
        scope.update();
    }

    function handleKeyDown(event) {
        switch (event.keyCode) {
            case scope.keys.UP:
                pan(0, scope.keyPanSpeed);
                scope.update();
                break;
            case scope.keys.BOTTOM:
                pan(0, -scope.keyPanSpeed);
                scope.update();
                break;
            case scope.keys.LEFT:
                pan(scope.keyPanSpeed, 0);
                scope.update();
                break;
            case scope.keys.RIGHT:
                pan(-scope.keyPanSpeed, 0);
                scope.update();
                break;
        }
    }

    let _rotatestart = null;
    function handleTouchStartRotate(event) {
        rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
    }

    function handleTouchStartDolly(event) {
        var dx = event.touches[0].pageX - event.touches[1].pageX;
        var dy = event.touches[0].pageY - event.touches[1].pageY;
        var distance = Math.sqrt(dx * dx + dy * dy);
        dollyStart.set(0, distance);

        const pano = scope.pano;
        const size = pano.getSize();
        const location = Util.calcScreenToSphere({
            x: (event.touches[0].pageX + dx / 2) / size.width * 2 - 1,
            y: -(event.touches[0].pageY + dy / 2) / size.height * 2 + 1
        }, scope.camera);
        // center of tow fingers
        pano.publish(pano.Topic.UI.ZOOM, {location, pano});
    }

    function handleTouchStartPan(event) {
        panStart.set(event.touches[0].pageX, event.touches[0].pageY);
    }

    function handleTouchMoveRotate(event) {
        rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
        rotateDelta.subVectors(rotateEnd, rotateStart);
        var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
        // rotating across whole screen goes 360 degrees around
        rotateLeft(2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed);
        // rotating up and down along whole screen attempts to go 360, but limited to 180
        rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed);
        rotateStart.copy(rotateEnd);
        scope.update();

        if (!_rotatestart) {
            _rotatestart = Util.calcScreenToSphere({x: 0, y: 0}, scope.camera);
        }
    }
    // 两指缩放
    function handleTouchMoveDolly(event) {
        var dx = event.touches[0].pageX - event.touches[1].pageX;
        var dy = event.touches[0].pageY - event.touches[1].pageY;
        var distance = Math.sqrt(dx * dx + dy * dy);
        dollyEnd.set(0, distance);
        dollyDelta.subVectors(dollyEnd, dollyStart);
        if (dollyDelta.y > 0) {
            dollyOut(getZoomScale());
        } else if (dollyDelta.y < 0) {
            dollyIn(getZoomScale());
        }
        dollyStart.copy(dollyEnd);
        scope.update();
    }

    function handleTouchMovePan(event) {
        panEnd.set(event.touches[0].pageX, event.touches[0].pageY);
        panDelta.subVectors(panEnd, panStart);
        pan(panDelta.x, panDelta.y);
        panStart.copy(panEnd);
        scope.update();
    }

    function handleTouchEnd(event) {
        if (_rotatestart) {
            const pano = scope.pano;
            const end = Util.calcScreenToSphere({x: 0, y: 0}, scope.camera);
            pano.publish(pano.Topic.UI.DRAG, {start: _rotatestart, end, pano});
        }
        _rotatestart = null;
    }

    /*
     * event handlers - FSM: listen for events and reset state
     */
    function onMouseDown(event) {
        if (scope.enabled === false) {
            return;
        }
        event.preventDefault();

        switch (event.button) {
            case scope.mouseButtons.ORBIT:
                if (scope.enableRotate === false) {
                    return;
                }
                
                handleMouseDownRotate(event);
                state = STATE.ROTATE;
                break;
            case scope.mouseButtons.ZOOM:
                if (scope.enableZoom === false) {
                    return;
                }
                handleMouseDownDolly(event);
                state = STATE.DOLLY;
                break;
            case scope.mouseButtons.PAN:
                if (scope.enablePan === false) {
                    return;
                }
                handleMouseDownPan(event);
                state = STATE.PAN;
                break;
        }

        if (state !== STATE.NONE) {
            document.addEventListener('mousemove', onMouseMove, false);
            document.addEventListener('mouseup', onMouseUp, false);
            scope.dispatchEvent(startEvent);
        }
    }

    function onMouseMove(event) {        
        if (scope.enabled === false) {
            return;
        }
        event.preventDefault();

        switch (state) {
            case STATE.ROTATE:
                if (scope.enableRotate === false) {
                    return;
                }
                handleMouseMoveRotate(event);
                break;
            case STATE.DOLLY:
                if (scope.enableZoom === false) {
                    return;
                }
                handleMouseMoveDolly(event);
                break;
            case STATE.PAN:
                if (scope.enablePan === false) {
                    return;
                }
                handleMouseMovePan(event);
                break;
        }
    }

    function onMouseUp(event) {
        if (scope.enabled === false) {
            return;
        }

        handleMouseUp(event);
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);
        scope.dispatchEvent(endEvent);
        state = STATE.SLIDER;
    }

    function onMouseWheel(event) {
        if (scope.enabled === false
            || scope.enableZoom === false
            || (!pano.gyro && state !== STATE.NONE && state !== STATE.ROTATE)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        handleMouseWheel(event);
        scope.dispatchEvent(startEvent);
        // not sure why these are here...
        scope.dispatchEvent(endEvent);
    }

    function onKeyDown(event) {
        if (scope.enabled === false || scope.enableKeys === false || scope.enablePan === false) {
            return;
        }
        handleKeyDown(event);
    }

    function onTouchStart(event) {
        if (scope.enabled === false) {
            return;
        }
        
        switch (event.touches.length) {
            case 1:
                // one-fingered touch: rotate
                if (scope.enableRotate === false) {
                    return;
                }
                handleTouchStartRotate(event);
                state = STATE.TOUCH_ROTATE;
                break;
            case 2:
                // two-fingered touch: dolly
                if (scope.enableZoom === false) {
                    return;
                }
                handleTouchStartDolly(event);
                state = STATE.TOUCH_DOLLY;
                break;
            case 3:
                // three-fingered touch: pan
                if (scope.enablePan === false) {
                    return;
                }
                handleTouchStartPan(event);
                state = STATE.TOUCH_PAN;
                break;
            default:
                state = STATE.NONE;
        }
        if (state !== STATE.NONE) {
            scope.dispatchEvent(startEvent);
        }
    }

    function onTouchMove(event) {
        if (scope.enabled === false) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();

        switch (event.touches.length) {
            case 1:
                // one-fingered touch: rotate
                if (scope.enableRotate === false) {
                    return;
                }
                if (state !== STATE.TOUCH_ROTATE) {
                    return;
                }
                handleTouchMoveRotate(event);
                break;
            case 2:            
                // two-fingered touch: dolly
                if (scope.enableZoom === false) {
                    return;
                }
                if (state !== STATE.TOUCH_DOLLY) {
                    return;
                }
                handleTouchMoveDolly(event);
                break;
            case 3:
                // three-fingered touch: pan
                if (scope.enablePan === false) {
                    return;
                }
                if (state !== STATE.TOUCH_PAN) {
                    return;
                }
                handleTouchMovePan(event);
                break;
            default:
                state = STATE.NONE;
        }
    }

    // update 中 设置 state = NONE
    function onTouchEnd(event) {
        if (scope.enabled === false) {
            return;
        }
        handleTouchEnd(event);
        scope.dispatchEvent(endEvent);
        state = STATE.SLIDER;
    }

    function onContextMenu(event) {
        if (scope.enabled === false) {
            return;
        }
        event.preventDefault();
    }

    scope.domElement.addEventListener('contextmenu', onContextMenu, false);
    scope.domElement.addEventListener('mousedown', onMouseDown, false);
    scope.domElement.addEventListener('wheel', onMouseWheel, false);
    scope.domElement.addEventListener('touchstart', onTouchStart, false);
    scope.domElement.addEventListener('touchend', onTouchEnd, false);
    scope.domElement.addEventListener('touchmove', onTouchMove, false);
    // force an update at start
    this.update();
};

OrbitControl.prototype = Object.create(EventDispatcher.prototype);
OrbitControl.prototype.constructor = OrbitControl;

export default OrbitControl;