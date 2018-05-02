/**
 * @license
 * webvr-polyfill
 * Copyright (c) 2015-2017 Google
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @license
 * cardboard-vr-display
 * Copyright (c) 2015-2017 Google
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @license
 * webvr-polyfill-dpdb 
 * Copyright (c) 2017 Google
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @license
 * wglu-preserve-state
 * Copyright (c) 2016, Brandon Jones.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @license
 * nosleep.js
 * Copyright (c) 2017, Rich Tibbett
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.WebVRPolyfill = factory());
}(this, (function () {
    'use strict';

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    var Util = window.Util || {};
    var myDisplay;
    Util.clamp = function (value, min, max) {
        return Math.min(Math.max(min, value), max);
    };
    Util.race = function (promises) {
        if (Promise.race) {
            return Promise.race(promises);
        }
        return new Promise(function (resolve, reject) {
            for (var i = 0; i < promises.length; i++) {
                promises[i].then(resolve, reject);
            }
        });
    };
    Util.isIOS = function () {
        return (/iPad|iPhone|iPod/.test(navigator.platform));
    };
    Util.isMobile = function () {
        return (/Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod/i.test(navigator.userAgent));
    };
    Util.copyArray = function (source, dest) {
        for (var i = 0, n = source.length; i < n; i++) {
            dest[i] = source[i];
        }
    };
    Util.extend = function (dest, src) {
        for (var key in src) {
            if (src.hasOwnProperty(key)) {
                dest[key] = src[key];
            }
        }
        return dest;
    };
    Util.isFullScreenAvailable = function () {
        return document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || false;
    };
    var util = Util;

    var Util$1 = window.Util || {};
    Util$1.MIN_TIMESTEP = 0.001;
    Util$1.MAX_TIMESTEP = 1;
    Util$1.base64 = function (mimeType, base64) {
        return 'data:' + mimeType + ';base64,' + base64;
    };
    Util$1.clamp = function (value, min, max) {
        return Math.min(Math.max(min, value), max);
    };
    Util$1.lerp = function (a, b, t) {
        return a + ((b - a) * t);
    };
    Util$1.race = function (promises) {
        if (Promise.race) {
            return Promise.race(promises);
        }
        return new Promise(function (resolve, reject) {
            for (var i = 0; i < promises.length; i++) {
                promises[i].then(resolve, reject);
            }
        });
    };
    Util$1.isIOS = (function () {
        var isIOS = /iPad|iPhone|iPod/.test(navigator.platform);
        return function () {
            return isIOS;
        };
    })();
    Util$1.isWebViewAndroid = (function () {
        var isWebViewAndroid = navigator.userAgent.indexOf('Version') !== -1 &&
            navigator.userAgent.indexOf('Android') !== -1 &&
            navigator.userAgent.indexOf('Chrome') !== -1;
        return function () {
            return isWebViewAndroid;
        };
    })();
    Util$1.isSafari = (function () {
        var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        return function () {
            return isSafari;
        };
    })();
    Util$1.isFirefoxAndroid = (function () {
        var isFirefoxAndroid = navigator.userAgent.indexOf('Firefox') !== -1 &&
            navigator.userAgent.indexOf('Android') !== -1;
        return function () {
            return isFirefoxAndroid;
        };
    })();
    Util$1.isR7 = (function () {
        var isR7 = navigator.userAgent.indexOf('R7 Build') !== -1;
        return function () {
            return isR7;
        };
    })();
    Util$1.isLandscapeMode = function () {
        var rtn = (window.orientation == 90 || window.orientation == -90);
        return Util$1.isR7() ? !rtn : rtn;
    };
    Util$1.isTimestampDeltaValid = function (timestampDeltaS) {
        if (isNaN(timestampDeltaS)) {
            return false;
        }
        if (timestampDeltaS <= Util$1.MIN_TIMESTEP) {
            return false;
        }
        if (timestampDeltaS > Util$1.MAX_TIMESTEP) {
            return false;
        }
        return true;
    };
    Util$1.getScreenWidth = function () {
        return Math.max(window.screen.width, window.screen.height) *
            window.devicePixelRatio;
    };
    Util$1.getScreenHeight = function () {
        return Math.min(window.screen.width, window.screen.height) *
            window.devicePixelRatio;
    };
    Util$1.requestFullscreen = function (element) {
        if (Util$1.isWebViewAndroid()) {
            return false;
        }
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else {
            return false;
        }
        return true;
    };
    Util$1.exitFullscreen = function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else {
            return false;
        }
        return true;
    };
    Util$1.getFullscreenElement = function () {
        return document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement;
    };
    Util$1.linkProgram = function (gl, vertexSource, fragmentSource, attribLocationMap) {
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        for (var attribName in attribLocationMap)
            gl.bindAttribLocation(program, attribLocationMap[attribName], attribName);
        gl.linkProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return program;
    };
    Util$1.getProgramUniforms = function (gl, program) {
        var uniforms = {};
        var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        var uniformName = '';
        for (var i = 0; i < uniformCount; i++) {
            var uniformInfo = gl.getActiveUniform(program, i);
            uniformName = uniformInfo.name.replace('[0]', '');
            uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
        }
        return uniforms;
    };
    Util$1.orthoMatrix = function (out, left, right, bottom, top, near, far) {
        var lr = 1 / (left - right),
            bt = 1 / (bottom - top),
            nf = 1 / (near - far);
        out[0] = -2 * lr;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = -2 * bt;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 2 * nf;
        out[11] = 0;
        out[12] = (left + right) * lr;
        out[13] = (top + bottom) * bt;
        out[14] = (far + near) * nf;
        out[15] = 1;
        return out;
    };
    Util$1.copyArray = function (source, dest) {
        for (var i = 0, n = source.length; i < n; i++) {
            dest[i] = source[i];
        }
    };
    Util$1.isMobile = function () {
        var check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };
    Util$1.extend = function (dest, src) {
        for (var key in src) {
            if (src.hasOwnProperty(key)) {
                dest[key] = src[key];
            }
        }
        return dest;
    };
    Util$1.safariCssSizeWorkaround = function (canvas) {
        if (Util$1.isIOS()) {
            var width = canvas.style.width;
            var height = canvas.style.height;
            canvas.style.width = (parseInt(width) + 1) + 'px';
            canvas.style.height = (parseInt(height)) + 'px';
            setTimeout(function () {
                canvas.style.width = width;
                canvas.style.height = height;
            }, 100);
        }
        window.Util = Util$1;
        window.canvas = canvas;
    };
    Util$1.frameDataFromPose = (function () {
        var piOver180 = Math.PI / 180.0;
        var rad45 = Math.PI * 0.25;

        function mat4_perspectiveFromFieldOfView(out, fov, near, far) {
            var upTan = Math.tan(fov ? (fov.upDegrees * piOver180) : rad45),
                downTan = Math.tan(fov ? (fov.downDegrees * piOver180) : rad45),
                leftTan = Math.tan(fov ? (fov.leftDegrees * piOver180) : rad45),
                rightTan = Math.tan(fov ? (fov.rightDegrees * piOver180) : rad45),
                xScale = 2.0 / (leftTan + rightTan),
                yScale = 2.0 / (upTan + downTan);
            out[0] = xScale;
            out[1] = 0.0;
            out[2] = 0.0;
            out[3] = 0.0;
            out[4] = 0.0;
            out[5] = yScale;
            out[6] = 0.0;
            out[7] = 0.0;
            out[8] = -((leftTan - rightTan) * xScale * 0.5);
            out[9] = ((upTan - downTan) * yScale * 0.5);
            out[10] = far / (near - far);
            out[11] = -1.0;
            out[12] = 0.0;
            out[13] = 0.0;
            out[14] = (far * near) / (near - far);
            out[15] = 0.0;
            return out;
        }

        function mat4_fromRotationTranslation(out, q, v) {
            var x = q[0],
                y = q[1],
                z = q[2],
                w = q[3],
                x2 = x + x,
                y2 = y + y,
                z2 = z + z,
                xx = x * x2,
                xy = x * y2,
                xz = x * z2,
                yy = y * y2,
                yz = y * z2,
                zz = z * z2,
                wx = w * x2,
                wy = w * y2,
                wz = w * z2;
            out[0] = 1 - (yy + zz);
            out[1] = xy + wz;
            out[2] = xz - wy;
            out[3] = 0;
            out[4] = xy - wz;
            out[5] = 1 - (xx + zz);
            out[6] = yz + wx;
            out[7] = 0;
            out[8] = xz + wy;
            out[9] = yz - wx;
            out[10] = 1 - (xx + yy);
            out[11] = 0;
            out[12] = v[0];
            out[13] = v[1];
            out[14] = v[2];
            out[15] = 1;
            return out;
        }

        function mat4_translate(out, a, v) {
            var x = v[0],
                y = v[1],
                z = v[2],
                a00, a01, a02, a03,
                a10, a11, a12, a13,
                a20, a21, a22, a23;
            if (a === out) {
                out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
                out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
                out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
                out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
            } else {
                a00 = a[0];
                a01 = a[1];
                a02 = a[2];
                a03 = a[3];
                a10 = a[4];
                a11 = a[5];
                a12 = a[6];
                a13 = a[7];
                a20 = a[8];
                a21 = a[9];
                a22 = a[10];
                a23 = a[11];
                out[0] = a00;
                out[1] = a01;
                out[2] = a02;
                out[3] = a03;
                out[4] = a10;
                out[5] = a11;
                out[6] = a12;
                out[7] = a13;
                out[8] = a20;
                out[9] = a21;
                out[10] = a22;
                out[11] = a23;
                out[12] = a00 * x + a10 * y + a20 * z + a[12];
                out[13] = a01 * x + a11 * y + a21 * z + a[13];
                out[14] = a02 * x + a12 * y + a22 * z + a[14];
                out[15] = a03 * x + a13 * y + a23 * z + a[15];
            }
            return out;
        }

        function mat4_invert(out, a) {
            var a00 = a[0],
                a01 = a[1],
                a02 = a[2],
                a03 = a[3],
                a10 = a[4],
                a11 = a[5],
                a12 = a[6],
                a13 = a[7],
                a20 = a[8],
                a21 = a[9],
                a22 = a[10],
                a23 = a[11],
                a30 = a[12],
                a31 = a[13],
                a32 = a[14],
                a33 = a[15],
                b00 = a00 * a11 - a01 * a10,
                b01 = a00 * a12 - a02 * a10,
                b02 = a00 * a13 - a03 * a10,
                b03 = a01 * a12 - a02 * a11,
                b04 = a01 * a13 - a03 * a11,
                b05 = a02 * a13 - a03 * a12,
                b06 = a20 * a31 - a21 * a30,
                b07 = a20 * a32 - a22 * a30,
                b08 = a20 * a33 - a23 * a30,
                b09 = a21 * a32 - a22 * a31,
                b10 = a21 * a33 - a23 * a31,
                b11 = a22 * a33 - a23 * a32,
                det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
            if (!det) {
                return null;
            }
            det = 1.0 / det;
            out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
            out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
            out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
            out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
            out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
            out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
            out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
            out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
            out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
            out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
            out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
            out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
            out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
            out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
            out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
            out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
            return out;
        }
        var defaultOrientation = new Float32Array([0, 0, 0, 1]);
        var defaultPosition = new Float32Array([0, 0, 0]);

        function updateEyeMatrices(projection, view, pose, parameters, vrDisplay) {
            mat4_perspectiveFromFieldOfView(projection, parameters ? parameters.fieldOfView : null, vrDisplay.depthNear, vrDisplay.depthFar);
            var orientation = pose.orientation || defaultOrientation;
            var position = pose.position || defaultPosition;
            mat4_fromRotationTranslation(view, orientation, position);
            if (parameters)
                mat4_translate(view, view, parameters.offset);
            mat4_invert(view, view);
        }
        return function (frameData, pose, vrDisplay) {
            if (!frameData || !pose)
                return false;
            frameData.pose = pose;
            frameData.timestamp = pose.timestamp;
            updateEyeMatrices(
                frameData.leftProjectionMatrix, frameData.leftViewMatrix,
                pose, vrDisplay.getEyeParameters("left"), vrDisplay);
            updateEyeMatrices(
                frameData.rightProjectionMatrix, frameData.rightViewMatrix,
                pose, vrDisplay.getEyeParameters("right"), vrDisplay);
            return true;
        };
    })();
    Util$1.isInsideCrossDomainIFrame = function () {
        var isFramed = (window.self !== window.top);
        var refDomain = Util$1.getDomainFromUrl(document.referrer);
        var thisDomain = Util$1.getDomainFromUrl(window.location.href);
        return isFramed && (refDomain !== thisDomain);
    };
    Util$1.getDomainFromUrl = function (url) {
        var domain;
        if (url.indexOf("://") > -1) {
            domain = url.split('/')[2];
        } else {
            domain = url.split('/')[0];
        }
        domain = domain.split(':')[0];
        return domain;
    };
    Util$1.getQuaternionAngle = function (quat) {
        if (quat.w > 1) {
            console.warn('getQuaternionAngle: w > 1');
            return 0;
        }
        var angle = 2 * Math.acos(quat.w);
        return angle;
    };
    var util$2 = Util$1;

    function WGLUPreserveGLState(gl, bindings, callback) {
        if (!bindings) {
            callback(gl);
            return;
        }
        var boundValues = [];
        var activeTexture = null;
        for (var i = 0; i < bindings.length; ++i) {
            var binding = bindings[i];
            switch (binding) {
                case gl.TEXTURE_BINDING_2D:
                case gl.TEXTURE_BINDING_CUBE_MAP:
                    var textureUnit = bindings[++i];
                    if (textureUnit < gl.TEXTURE0 || textureUnit > gl.TEXTURE31) {
                        console.error("TEXTURE_BINDING_2D or TEXTURE_BINDING_CUBE_MAP must be followed by a valid texture unit");
                        boundValues.push(null, null);
                        break;
                    }
                    if (!activeTexture) {
                        activeTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
                    }
                    gl.activeTexture(textureUnit);
                    boundValues.push(gl.getParameter(binding), null);
                    break;
                case gl.ACTIVE_TEXTURE:
                    activeTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
                    boundValues.push(null);
                    break;
                default:
                    boundValues.push(gl.getParameter(binding));
                    break;
            }
        }
        callback(gl);
        for (var i = 0; i < bindings.length; ++i) {
            var binding = bindings[i];
            var boundValue = boundValues[i];
            switch (binding) {
                case gl.ACTIVE_TEXTURE:
                    break;
                case gl.ARRAY_BUFFER_BINDING:
                    gl.bindBuffer(gl.ARRAY_BUFFER, boundValue);
                    break;
                case gl.COLOR_CLEAR_VALUE:
                    gl.clearColor(boundValue[0], boundValue[1], boundValue[2], boundValue[3]);
                    break;
                case gl.COLOR_WRITEMASK:
                    gl.colorMask(boundValue[0], boundValue[1], boundValue[2], boundValue[3]);
                    break;
                case gl.CURRENT_PROGRAM:
                    gl.useProgram(boundValue);
                    break;
                case gl.ELEMENT_ARRAY_BUFFER_BINDING:
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boundValue);
                    break;
                case gl.FRAMEBUFFER_BINDING:
                    gl.bindFramebuffer(gl.FRAMEBUFFER, boundValue);
                    break;
                case gl.RENDERBUFFER_BINDING:
                    gl.bindRenderbuffer(gl.RENDERBUFFER, boundValue);
                    break;
                case gl.TEXTURE_BINDING_2D:
                    var textureUnit = bindings[++i];
                    if (textureUnit < gl.TEXTURE0 || textureUnit > gl.TEXTURE31)
                        break;
                    gl.activeTexture(textureUnit);
                    gl.bindTexture(gl.TEXTURE_2D, boundValue);
                    break;
                case gl.TEXTURE_BINDING_CUBE_MAP:
                    var textureUnit = bindings[++i];
                    if (textureUnit < gl.TEXTURE0 || textureUnit > gl.TEXTURE31)
                        break;
                    gl.activeTexture(textureUnit);
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, boundValue);
                    break;
                case gl.VIEWPORT:
                    gl.viewport(boundValue[0], boundValue[1], boundValue[2], boundValue[3]);
                    break;
                case gl.BLEND:
                case gl.CULL_FACE:
                case gl.DEPTH_TEST:
                case gl.SCISSOR_TEST:
                case gl.STENCIL_TEST:
                    if (boundValue) {
                        gl.enable(binding);
                    } else {
                        gl.disable(binding);
                    }
                    break;
                default:
                    console.log("No GL restore behavior for 0x" + binding.toString(16));
                    break;
            }
            if (activeTexture) {
                gl.activeTexture(activeTexture);
            }
        }
    }
    var glPreserveState = WGLUPreserveGLState;

    var distortionVS = [
        'attribute vec2 position;',
        'attribute vec3 texCoord;',
        'varying vec2 vTexCoord;',
        'uniform vec4 viewportOffsetScale[2];',
        'void main() {',
        '  vec4 viewport = viewportOffsetScale[int(texCoord.z)];',
        '  vTexCoord = (texCoord.xy * viewport.zw) + viewport.xy;',
        '  gl_Position = vec4( position, 1.0, 1.0 );',
        '}',
    ].join('\n');
    var distortionFS = [
        'precision mediump float;',
        'uniform sampler2D diffuse;',
        'varying vec2 vTexCoord;',
        'void main() {',
        '  gl_FragColor = texture2D(diffuse, vTexCoord);',
        '}',
    ].join('\n');

    function CardboardDistorter(gl, cardboardUI, bufferScale, dirtySubmitFrameBindings) {
        this.gl = gl;
        this.cardboardUI = cardboardUI;
        this.bufferScale = bufferScale;
        this.dirtySubmitFrameBindings = dirtySubmitFrameBindings;
        this.ctxAttribs = gl.getContextAttributes();
        this.meshWidth = 20;
        this.meshHeight = 20;
        this.bufferWidth = gl.drawingBufferWidth;
        this.bufferHeight = gl.drawingBufferHeight;
        this.realBindFramebuffer = gl.bindFramebuffer;
        this.realEnable = gl.enable;
        this.realDisable = gl.disable;
        this.realColorMask = gl.colorMask;
        this.realClearColor = gl.clearColor;
        this.realViewport = gl.viewport;
        if (!util$2.isIOS()) {
            this.realCanvasWidth = Object.getOwnPropertyDescriptor(gl.canvas.__proto__, 'width');
            this.realCanvasHeight = Object.getOwnPropertyDescriptor(gl.canvas.__proto__, 'height');
        }
        this.isPatched = false;
        this.lastBoundFramebuffer = null;
        this.cullFace = false;
        this.depthTest = false;
        this.blend = false;
        this.scissorTest = false;
        this.stencilTest = false;
        this.viewport = [0, 0, 0, 0];
        this.colorMask = [true, true, true, true];
        this.clearColor = [0, 0, 0, 0];
        this.attribs = {
            position: 0,
            texCoord: 1
        };
        this.program = util$2.linkProgram(gl, distortionVS, distortionFS, this.attribs);
        this.uniforms = util$2.getProgramUniforms(gl, this.program);
        this.viewportOffsetScale = new Float32Array(8);
        this.setTextureBounds();
        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.indexCount = 0;
        this.renderTarget = gl.createTexture();
        this.framebuffer = gl.createFramebuffer();
        this.depthStencilBuffer = null;
        this.depthBuffer = null;
        this.stencilBuffer = null;
        if (this.ctxAttribs.depth && this.ctxAttribs.stencil) {
            this.depthStencilBuffer = gl.createRenderbuffer();
        } else if (this.ctxAttribs.depth) {
            this.depthBuffer = gl.createRenderbuffer();
        } else if (this.ctxAttribs.stencil) {
            this.stencilBuffer = gl.createRenderbuffer();
        }
        this.patch();
        this.onResize();
    }
    CardboardDistorter.prototype.destroy = function () {
        var gl = this.gl;
        this.unpatch();
        gl.deleteProgram(this.program);
        gl.deleteBuffer(this.vertexBuffer);
        gl.deleteBuffer(this.indexBuffer);
        gl.deleteTexture(this.renderTarget);
        gl.deleteFramebuffer(this.framebuffer);
        if (this.depthStencilBuffer) {
            gl.deleteRenderbuffer(this.depthStencilBuffer);
        }
        if (this.depthBuffer) {
            gl.deleteRenderbuffer(this.depthBuffer);
        }
        if (this.stencilBuffer) {
            gl.deleteRenderbuffer(this.stencilBuffer);
        }
        if (this.cardboardUI) {
            this.cardboardUI.destroy();
        }
    };
    CardboardDistorter.prototype.onResize = function () {
        var gl = this.gl;
        var self = this;
        var glState = [
            gl.RENDERBUFFER_BINDING,
            gl.TEXTURE_BINDING_2D, gl.TEXTURE0
        ];
        glPreserveState(gl, glState, function (gl) {
            self.realBindFramebuffer.call(gl, gl.FRAMEBUFFER, null);
            if (self.scissorTest) {
                self.realDisable.call(gl, gl.SCISSOR_TEST);
            }
            self.realColorMask.call(gl, true, true, true, true);
            self.realViewport.call(gl, 0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            self.realClearColor.call(gl, 0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            self.realBindFramebuffer.call(gl, gl.FRAMEBUFFER, self.framebuffer);
            gl.bindTexture(gl.TEXTURE_2D, self.renderTarget);
            gl.texImage2D(gl.TEXTURE_2D, 0, self.ctxAttribs.alpha ? gl.RGBA : gl.RGB,
                self.bufferWidth, self.bufferHeight, 0,
                self.ctxAttribs.alpha ? gl.RGBA : gl.RGB, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, self.renderTarget, 0);
            if (self.ctxAttribs.depth && self.ctxAttribs.stencil) {
                gl.bindRenderbuffer(gl.RENDERBUFFER, self.depthStencilBuffer);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL,
                    self.bufferWidth, self.bufferHeight);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT,
                    gl.RENDERBUFFER, self.depthStencilBuffer);
            } else if (self.ctxAttribs.depth) {
                gl.bindRenderbuffer(gl.RENDERBUFFER, self.depthBuffer);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16,
                    self.bufferWidth, self.bufferHeight);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
                    gl.RENDERBUFFER, self.depthBuffer);
            } else if (self.ctxAttribs.stencil) {
                gl.bindRenderbuffer(gl.RENDERBUFFER, self.stencilBuffer);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.STENCIL_INDEX8,
                    self.bufferWidth, self.bufferHeight);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT,
                    gl.RENDERBUFFER, self.stencilBuffer);
            }
            if (!gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
                console.error('Framebuffer incomplete!');
            }
            self.realBindFramebuffer.call(gl, gl.FRAMEBUFFER, self.lastBoundFramebuffer);
            if (self.scissorTest) {
                self.realEnable.call(gl, gl.SCISSOR_TEST);
            }
            self.realColorMask.apply(gl, self.colorMask);
            self.realViewport.apply(gl, self.viewport);
            self.realClearColor.apply(gl, self.clearColor);
        });
        if (this.cardboardUI) {
            this.cardboardUI.onResize();
        }
    };
    CardboardDistorter.prototype.patch = function () {
        if (this.isPatched) {
            return;
        }
        var self = this;
        var canvas = this.gl.canvas;
        var gl = this.gl;
        if (!util$2.isIOS()) {
            canvas.width = util$2.getScreenWidth() * this.bufferScale;
            canvas.height = util$2.getScreenHeight() * this.bufferScale;
            Object.defineProperty(canvas, 'width', {
                configurable: true,
                enumerable: true,
                get: function () {
                    return self.bufferWidth;
                },
                set: function (value) {
                    self.bufferWidth = value;
                    self.realCanvasWidth.set.call(canvas, value);
                    self.onResize();
                }
            });
            Object.defineProperty(canvas, 'height', {
                configurable: true,
                enumerable: true,
                get: function () {
                    return self.bufferHeight;
                },
                set: function (value) {
                    self.bufferHeight = value;
                    self.realCanvasHeight.set.call(canvas, value);
                    self.onResize();
                }
            });
        }
        this.lastBoundFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        if (this.lastBoundFramebuffer == null) {
            this.lastBoundFramebuffer = this.framebuffer;
            this.gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        }
        this.gl.bindFramebuffer = function (target, framebuffer) {
            self.lastBoundFramebuffer = framebuffer ? framebuffer : self.framebuffer;
            self.realBindFramebuffer.call(gl, target, self.lastBoundFramebuffer);
        };
        this.cullFace = gl.getParameter(gl.CULL_FACE);
        this.depthTest = gl.getParameter(gl.DEPTH_TEST);
        this.blend = gl.getParameter(gl.BLEND);
        this.scissorTest = gl.getParameter(gl.SCISSOR_TEST);
        this.stencilTest = gl.getParameter(gl.STENCIL_TEST);
        gl.enable = function (pname) {
            switch (pname) {
                case gl.CULL_FACE:
                    self.cullFace = true;
                    break;
                case gl.DEPTH_TEST:
                    self.depthTest = true;
                    break;
                case gl.BLEND:
                    self.blend = true;
                    break;
                case gl.SCISSOR_TEST:
                    self.scissorTest = true;
                    break;
                case gl.STENCIL_TEST:
                    self.stencilTest = true;
                    break;
            }
            self.realEnable.call(gl, pname);
        };
        gl.disable = function (pname) {
            switch (pname) {
                case gl.CULL_FACE:
                    self.cullFace = false;
                    break;
                case gl.DEPTH_TEST:
                    self.depthTest = false;
                    break;
                case gl.BLEND:
                    self.blend = false;
                    break;
                case gl.SCISSOR_TEST:
                    self.scissorTest = false;
                    break;
                case gl.STENCIL_TEST:
                    self.stencilTest = false;
                    break;
            }
            self.realDisable.call(gl, pname);
        };
        this.colorMask = gl.getParameter(gl.COLOR_WRITEMASK);
        gl.colorMask = function (r, g, b, a) {
            self.colorMask[0] = r;
            self.colorMask[1] = g;
            self.colorMask[2] = b;
            self.colorMask[3] = a;
            self.realColorMask.call(gl, r, g, b, a);
        };
        this.clearColor = gl.getParameter(gl.COLOR_CLEAR_VALUE);
        gl.clearColor = function (r, g, b, a) {
            self.clearColor[0] = r;
            self.clearColor[1] = g;
            self.clearColor[2] = b;
            self.clearColor[3] = a;
            self.realClearColor.call(gl, r, g, b, a);
        };
        this.viewport = gl.getParameter(gl.VIEWPORT);
        gl.viewport = function (x, y, w, h) {
            self.viewport[0] = x;
            self.viewport[1] = y;
            self.viewport[2] = w;
            self.viewport[3] = h;
            self.realViewport.call(gl, x, y, w, h);
        };
        this.isPatched = true;
        util$2.safariCssSizeWorkaround(canvas);
    };
    CardboardDistorter.prototype.unpatch = function () {
        if (!this.isPatched) {
            return;
        }
        var gl = this.gl;
        var canvas = this.gl.canvas;
        if (!util$2.isIOS()) {
            Object.defineProperty(canvas, 'width', this.realCanvasWidth);
            Object.defineProperty(canvas, 'height', this.realCanvasHeight);
        }
        canvas.width = this.bufferWidth;
        canvas.height = this.bufferHeight;
        gl.bindFramebuffer = this.realBindFramebuffer;
        gl.enable = this.realEnable;
        gl.disable = this.realDisable;
        gl.colorMask = this.realColorMask;
        gl.clearColor = this.realClearColor;
        gl.viewport = this.realViewport;
        if (this.lastBoundFramebuffer == this.framebuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
        this.isPatched = false;
        setTimeout(function () {
            util$2.safariCssSizeWorkaround(canvas);
        }, 1);
    };
    CardboardDistorter.prototype.setTextureBounds = function (leftBounds, rightBounds) {
        if (!leftBounds) {
            leftBounds = [0, 0, 0.5, 1];
        }
        if (!rightBounds) {
            rightBounds = [0.5, 0, 0.5, 1];
        }
        this.viewportOffsetScale[0] = leftBounds[0];
        this.viewportOffsetScale[1] = leftBounds[1];
        this.viewportOffsetScale[2] = leftBounds[2];
        this.viewportOffsetScale[3] = leftBounds[3];
        this.viewportOffsetScale[4] = rightBounds[0];
        this.viewportOffsetScale[5] = rightBounds[1];
        this.viewportOffsetScale[6] = rightBounds[2];
        this.viewportOffsetScale[7] = rightBounds[3];
    };
    CardboardDistorter.prototype.submitFrame = function () {
        var gl = this.gl;
        var self = this;
        var glState = [];
        if (!this.dirtySubmitFrameBindings) {
            glState.push(
                gl.CURRENT_PROGRAM,
                gl.ARRAY_BUFFER_BINDING,
                gl.ELEMENT_ARRAY_BUFFER_BINDING,
                gl.TEXTURE_BINDING_2D, gl.TEXTURE0
            );
        }
        glPreserveState(gl, glState, function (gl) {
            self.realBindFramebuffer.call(gl, gl.FRAMEBUFFER, null);
            if (self.cullFace) {
                self.realDisable.call(gl, gl.CULL_FACE);
            }
            if (self.depthTest) {
                self.realDisable.call(gl, gl.DEPTH_TEST);
            }
            if (self.blend) {
                self.realDisable.call(gl, gl.BLEND);
            }
            if (self.scissorTest) {
                self.realDisable.call(gl, gl.SCISSOR_TEST);
            }
            if (self.stencilTest) {
                self.realDisable.call(gl, gl.STENCIL_TEST);
            }
            self.realColorMask.call(gl, true, true, true, true);
            self.realViewport.call(gl, 0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            if (self.ctxAttribs.alpha || util$2.isIOS()) {
                self.realClearColor.call(gl, 0, 0, 0, 1);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            gl.useProgram(self.program);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, self.indexBuffer);
            gl.bindBuffer(gl.ARRAY_BUFFER, self.vertexBuffer);
            gl.enableVertexAttribArray(self.attribs.position);
            gl.enableVertexAttribArray(self.attribs.texCoord);
            gl.vertexAttribPointer(self.attribs.position, 2, gl.FLOAT, false, 20, 0);
            gl.vertexAttribPointer(self.attribs.texCoord, 3, gl.FLOAT, false, 20, 8);
            gl.activeTexture(gl.TEXTURE0);
            gl.uniform1i(self.uniforms.diffuse, 0);
            gl.bindTexture(gl.TEXTURE_2D, self.renderTarget);
            gl.uniform4fv(self.uniforms.viewportOffsetScale, self.viewportOffsetScale);
            gl.drawElements(gl.TRIANGLES, self.indexCount, gl.UNSIGNED_SHORT, 0);
            if (self.cardboardUI) {
                self.cardboardUI.renderNoState();
            }
            self.realBindFramebuffer.call(self.gl, gl.FRAMEBUFFER, self.framebuffer);
            if (!self.ctxAttribs.preserveDrawingBuffer) {
                self.realClearColor.call(gl, 0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            if (!self.dirtySubmitFrameBindings) {
                self.realBindFramebuffer.call(gl, gl.FRAMEBUFFER, self.lastBoundFramebuffer);
            }
            if (self.cullFace) {
                self.realEnable.call(gl, gl.CULL_FACE);
            }
            if (self.depthTest) {
                self.realEnable.call(gl, gl.DEPTH_TEST);
            }
            if (self.blend) {
                self.realEnable.call(gl, gl.BLEND);
            }
            if (self.scissorTest) {
                self.realEnable.call(gl, gl.SCISSOR_TEST);
            }
            if (self.stencilTest) {
                self.realEnable.call(gl, gl.STENCIL_TEST);
            }
            self.realColorMask.apply(gl, self.colorMask);
            self.realViewport.apply(gl, self.viewport);
            if (self.ctxAttribs.alpha || !self.ctxAttribs.preserveDrawingBuffer) {
                self.realClearColor.apply(gl, self.clearColor);
            }
        });
        if (util$2.isIOS()) {
            var canvas = gl.canvas;
            if (canvas.width != self.bufferWidth || canvas.height != self.bufferHeight) {
                self.bufferWidth = canvas.width;
                self.bufferHeight = canvas.height;
                self.onResize();
            }
        }
    };
    CardboardDistorter.prototype.updateDeviceInfo = function (deviceInfo) {
        var gl = this.gl;
        var self = this;
        var glState = [gl.ARRAY_BUFFER_BINDING, gl.ELEMENT_ARRAY_BUFFER_BINDING];
        glPreserveState(gl, glState, function (gl) {
            var vertices = self.computeMeshVertices_(self.meshWidth, self.meshHeight, deviceInfo);
            gl.bindBuffer(gl.ARRAY_BUFFER, self.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            if (!self.indexCount) {
                var indices = self.computeMeshIndices_(self.meshWidth, self.meshHeight);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, self.indexBuffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
                self.indexCount = indices.length;
            }
        });
    };
    CardboardDistorter.prototype.computeMeshVertices_ = function (width, height, deviceInfo) {
        var vertices = new Float32Array(2 * width * height * 5);
        var lensFrustum = deviceInfo.getLeftEyeVisibleTanAngles();
        var noLensFrustum = deviceInfo.getLeftEyeNoLensTanAngles();
        var viewport = deviceInfo.getLeftEyeVisibleScreenRect(noLensFrustum);
        var vidx = 0;
        for (var e = 0; e < 2; e++) {
            for (var j = 0; j < height; j++) {
                for (var i = 0; i < width; i++, vidx++) {
                    var u = i / (width - 1);
                    var v = j / (height - 1);
                    var s = u;
                    var t = v;
                    var x = util$2.lerp(lensFrustum[0], lensFrustum[2], u);
                    var y = util$2.lerp(lensFrustum[3], lensFrustum[1], v);
                    var d = Math.sqrt(x * x + y * y);
                    var r = deviceInfo.distortion.distortInverse(d);
                    var p = x * r / d;
                    var q = y * r / d;
                    u = (p - noLensFrustum[0]) / (noLensFrustum[2] - noLensFrustum[0]);
                    v = (q - noLensFrustum[3]) / (noLensFrustum[1] - noLensFrustum[3]);
                    var aspect = deviceInfo.device.widthMeters / deviceInfo.device.heightMeters;
                    u = (viewport.x + u * viewport.width - 0.5) * 2.0;
                    v = (viewport.y + v * viewport.height - 0.5) * 2.0;
                    vertices[(vidx * 5) + 0] = u;
                    vertices[(vidx * 5) + 1] = v;
                    vertices[(vidx * 5) + 2] = s;
                    vertices[(vidx * 5) + 3] = t;
                    vertices[(vidx * 5) + 4] = e;
                }
            }
            var w = lensFrustum[2] - lensFrustum[0];
            lensFrustum[0] = -(w + lensFrustum[0]);
            lensFrustum[2] = w - lensFrustum[2];
            w = noLensFrustum[2] - noLensFrustum[0];
            noLensFrustum[0] = -(w + noLensFrustum[0]);
            noLensFrustum[2] = w - noLensFrustum[2];
            viewport.x = 1 - (viewport.x + viewport.width);
        }
        return vertices;
    };
    CardboardDistorter.prototype.computeMeshIndices_ = function (width, height) {
        var indices = new Uint16Array(2 * (width - 1) * (height - 1) * 6);
        var halfwidth = width / 2;
        var halfheight = height / 2;
        var vidx = 0;
        var iidx = 0;
        for (var e = 0; e < 2; e++) {
            for (var j = 0; j < height; j++) {
                for (var i = 0; i < width; i++, vidx++) {
                    if (i == 0 || j == 0)
                        continue;
                    if ((i <= halfwidth) == (j <= halfheight)) {
                        indices[iidx++] = vidx;
                        indices[iidx++] = vidx - width - 1;
                        indices[iidx++] = vidx - width;
                        indices[iidx++] = vidx - width - 1;
                        indices[iidx++] = vidx;
                        indices[iidx++] = vidx - 1;
                    } else {
                        indices[iidx++] = vidx - 1;
                        indices[iidx++] = vidx - width;
                        indices[iidx++] = vidx;
                        indices[iidx++] = vidx - width;
                        indices[iidx++] = vidx - 1;
                        indices[iidx++] = vidx - width - 1;
                    }
                }
            }
        }
        return indices;
    };
    CardboardDistorter.prototype.getOwnPropertyDescriptor_ = function (proto, attrName) {
        var descriptor = Object.getOwnPropertyDescriptor(proto, attrName);
        if (descriptor.get === undefined || descriptor.set === undefined) {
            descriptor.configurable = true;
            descriptor.enumerable = true;
            descriptor.get = function () {
                return this.getAttribute(attrName);
            };
            descriptor.set = function (val) {
                this.setAttribute(attrName, val);
            };
        }
        return descriptor;
    };
    var cardboardDistorter = CardboardDistorter;

    var uiVS = [
        'attribute vec2 position;',
        'uniform mat4 projectionMat;',
        'void main() {',
        '  gl_Position = projectionMat * vec4( position, -1.0, 1.0 );',
        '}',
    ].join('\n');
    var uiFS = [
        'precision mediump float;',
        'uniform vec4 color;',
        'void main() {',
        '  gl_FragColor = color;',
        '}',
    ].join('\n');
    var DEG2RAD = Math.PI / 180.0;
    var kAnglePerGearSection = 60;
    var kOuterRimEndAngle = 12;
    var kInnerRimBeginAngle = 20;
    var kOuterRadius = 1;
    var kMiddleRadius = 0.75;
    var kInnerRadius = 0.3125;
    var kCenterLineThicknessDp = 4;
    var kButtonWidthDp = 28;
    var kTouchSlopFactor = 1.5;

    function CardboardUI(gl) {
        this.gl = gl;
        this.attribs = {
            position: 0
        };
        this.program = util$2.linkProgram(gl, uiVS, uiFS, this.attribs);
        this.uniforms = util$2.getProgramUniforms(gl, this.program);
        this.vertexBuffer = gl.createBuffer();
        this.gearOffset = 0;
        this.gearVertexCount = 0;
        this.arrowOffset = 0;
        this.arrowVertexCount = 0;
        this.projMat = new Float32Array(16);
        this.listener = null;
        this.onResize();
    }
    CardboardUI.prototype.destroy = function () {
        var gl = this.gl;
        if (this.listener) {
            gl.canvas.removeEventListener('click', this.listener, false);
        }
        gl.deleteProgram(this.program);
        gl.deleteBuffer(this.vertexBuffer);
    };
    CardboardUI.prototype.listen = function (optionsCallback, backCallback) {
        var canvas = this.gl.canvas;
        this.listener = function (event) {
            var midline = canvas.clientWidth / 2;
            var buttonSize = kButtonWidthDp * kTouchSlopFactor;
            if (event.clientX > midline - buttonSize &&
                event.clientX < midline + buttonSize &&
                event.clientY > canvas.clientHeight - buttonSize) {
                optionsCallback(event);
            } else if (event.clientX < buttonSize && event.clientY < buttonSize) {
                backCallback(event);
            }
        };
        canvas.addEventListener('click', this.listener, false);
    };
    CardboardUI.prototype.onResize = function () {
        var gl = this.gl;
        var self = this;
        var glState = [
            gl.ARRAY_BUFFER_BINDING
        ];
        glPreserveState(gl, glState, function (gl) {
            var vertices = [];
            var midline = gl.drawingBufferWidth / 2;
            var physicalPixels = Math.max(screen.width, screen.height) * window.devicePixelRatio;
            var scalingRatio = gl.drawingBufferWidth / physicalPixels;
            var dps = scalingRatio * window.devicePixelRatio;
            var lineWidth = kCenterLineThicknessDp * dps / 2;
            var buttonSize = kButtonWidthDp * kTouchSlopFactor * dps;
            var buttonScale = kButtonWidthDp * dps / 2;
            var buttonBorder = ((kButtonWidthDp * kTouchSlopFactor) - kButtonWidthDp) * dps;
            vertices.push(midline - lineWidth, buttonSize - 100);
            vertices.push(midline - lineWidth, gl.drawingBufferHeight);
            vertices.push(midline + lineWidth, buttonSize - 100);
            vertices.push(midline + lineWidth, gl.drawingBufferHeight);
            //    self.gearOffset = (vertices.length / 2);
            function addGearSegment(theta, r) {
                //      var angle = (90 - theta) * DEG2RAD;
                //      var x = Math.cos(angle);
                //      var y = Math.sin(angle);
                //      vertices.push(kInnerRadius * x * buttonScale + midline, kInnerRadius * y * buttonScale + buttonScale);
                //      vertices.push(r * x * buttonScale + midline, r * y * buttonScale + buttonScale);
            }
            for (var i = 0; i <= 6; i++) {
                var segmentTheta = i * kAnglePerGearSection;
                addGearSegment(segmentTheta, kOuterRadius);
                addGearSegment(segmentTheta + kOuterRimEndAngle, kOuterRadius);
                addGearSegment(segmentTheta + kInnerRimBeginAngle, kMiddleRadius);
                addGearSegment(segmentTheta + (kAnglePerGearSection - kInnerRimBeginAngle), kMiddleRadius);
                addGearSegment(segmentTheta + (kAnglePerGearSection - kOuterRimEndAngle), kOuterRadius);
            }
            self.gearVertexCount = (vertices.length / 2) - self.gearOffset;
            self.arrowOffset = (vertices.length / 2);

            function addArrowVertex(x, y) {
                //      vertices.push(buttonBorder + x, gl.drawingBufferHeight - buttonBorder - y);
            }
            var angledLineWidth = lineWidth / Math.sin(45 * DEG2RAD);
            addArrowVertex(0, buttonScale);
            addArrowVertex(buttonScale, 0);
            addArrowVertex(buttonScale + angledLineWidth, angledLineWidth);
            addArrowVertex(angledLineWidth, buttonScale + angledLineWidth);
            addArrowVertex(angledLineWidth, buttonScale - angledLineWidth);
            addArrowVertex(0, buttonScale);
            addArrowVertex(buttonScale, buttonScale * 2);
            addArrowVertex(buttonScale + angledLineWidth, (buttonScale * 2) - angledLineWidth);
            addArrowVertex(angledLineWidth, buttonScale - angledLineWidth);
            addArrowVertex(0, buttonScale);
            addArrowVertex(angledLineWidth, buttonScale - lineWidth);
            addArrowVertex(kButtonWidthDp * dps, buttonScale - lineWidth);
            addArrowVertex(angledLineWidth, buttonScale + lineWidth);
            addArrowVertex(kButtonWidthDp * dps, buttonScale + lineWidth);
            self.arrowVertexCount = (vertices.length / 2) - self.arrowOffset;
            gl.bindBuffer(gl.ARRAY_BUFFER, self.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        });
    };
    CardboardUI.prototype.render = function () {
        var gl = this.gl;
        var self = this;
        var glState = [
            gl.CULL_FACE,
            gl.DEPTH_TEST,
            gl.BLEND,
            gl.SCISSOR_TEST,
            gl.STENCIL_TEST,
            gl.COLOR_WRITEMASK,
            gl.VIEWPORT,
            gl.CURRENT_PROGRAM,
            gl.ARRAY_BUFFER_BINDING
        ];
        glPreserveState(gl, glState, function (gl) {
            gl.disable(gl.CULL_FACE);
            gl.disable(gl.DEPTH_TEST);
            gl.disable(gl.BLEND);
            gl.disable(gl.SCISSOR_TEST);
            gl.disable(gl.STENCIL_TEST);
            gl.colorMask(true, true, true, true);
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            self.renderNoState();
        });
    };
    CardboardUI.prototype.renderNoState = function () {
        var gl = this.gl;
        gl.useProgram(this.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(this.attribs.position);
        gl.vertexAttribPointer(this.attribs.position, 2, gl.FLOAT, false, 8, 0);
        gl.uniform4f(this.uniforms.color, 1.0, 1.0, 1.0, 1.0);
        util$2.orthoMatrix(this.projMat, 0, gl.drawingBufferWidth, 0, gl.drawingBufferHeight, 0.1, 1024.0);
        gl.uniformMatrix4fv(this.uniforms.projectionMat, false, this.projMat);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.drawArrays(gl.TRIANGLE_STRIP, this.gearOffset, this.gearVertexCount);
        gl.drawArrays(gl.TRIANGLE_STRIP, this.arrowOffset, this.arrowVertexCount);
    };
    var cardboardUi = CardboardUI;

    function Distortion(coefficients) {
        this.coefficients = coefficients;
    }
    Distortion.prototype.distortInverse = function (radius) {
        var r0 = 0;
        var r1 = 1;
        var dr0 = radius - this.distort(r0);
        while (Math.abs(r1 - r0) > 0.0001) {
            var dr1 = radius - this.distort(r1);
            var r2 = r1 - dr1 * ((r1 - r0) / (dr1 - dr0));
            r0 = r1;
            r1 = r2;
            dr0 = dr1;
        }
        return r1;
    };
    Distortion.prototype.distort = function (radius) {
        var r2 = radius * radius;
        var ret = 0;
        for (var i = 0; i < this.coefficients.length; i++) {
            ret = r2 * (ret + this.coefficients[i]);
        }
        return (ret + 1) * radius;
    };
    var distortion = Distortion;

    var MathUtil = window.MathUtil || {};
    MathUtil.degToRad = Math.PI / 180;
    MathUtil.radToDeg = 180 / Math.PI;
    MathUtil.Vector2 = function (x, y) {
        this.x = x || 0;
        this.y = y || 0;
    };
    MathUtil.Vector2.prototype = {
        constructor: MathUtil.Vector2,
        set: function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        },
        copy: function (v) {
            this.x = v.x;
            this.y = v.y;
            return this;
        },
        subVectors: function (a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            return this;
        },
    };
    MathUtil.Vector3 = function (x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    };
    MathUtil.Vector3.prototype = {
        constructor: MathUtil.Vector3,
        set: function (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        },
        copy: function (v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return this;
        },
        length: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        },
        normalize: function () {
            var scalar = this.length();
            if (scalar !== 0) {
                var invScalar = 1 / scalar;
                this.multiplyScalar(invScalar);
            } else {
                this.x = 0;
                this.y = 0;
                this.z = 0;
            }
            return this;
        },
        multiplyScalar: function (scalar) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
        },
        applyQuaternion: function (q) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var qx = q.x;
            var qy = q.y;
            var qz = q.z;
            var qw = q.w;
            var ix = qw * x + qy * z - qz * y;
            var iy = qw * y + qz * x - qx * z;
            var iz = qw * z + qx * y - qy * x;
            var iw = -qx * x - qy * y - qz * z;
            this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
            return this;
        },
        dot: function (v) {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        },
        crossVectors: function (a, b) {
            var ax = a.x,
                ay = a.y,
                az = a.z;
            var bx = b.x,
                by = b.y,
                bz = b.z;
            this.x = ay * bz - az * by;
            this.y = az * bx - ax * bz;
            this.z = ax * by - ay * bx;
            return this;
        },
    };
    MathUtil.Quaternion = function (x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = (w !== undefined) ? w : 1;
    };
    MathUtil.Quaternion.prototype = {
        constructor: MathUtil.Quaternion,
        set: function (x, y, z, w) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
            return this;
        },
        copy: function (quaternion) {
            this.x = quaternion.x;
            this.y = quaternion.y;
            this.z = quaternion.z;
            this.w = quaternion.w;
            return this;
        },
        setFromEulerXYZ: function (x, y, z) {
            var c1 = Math.cos(x / 2);
            var c2 = Math.cos(y / 2);
            var c3 = Math.cos(z / 2);
            var s1 = Math.sin(x / 2);
            var s2 = Math.sin(y / 2);
            var s3 = Math.sin(z / 2);
            this.x = s1 * c2 * c3 + c1 * s2 * s3;
            this.y = c1 * s2 * c3 - s1 * c2 * s3;
            this.z = c1 * c2 * s3 + s1 * s2 * c3;
            this.w = c1 * c2 * c3 - s1 * s2 * s3;
            return this;
        },
        setFromEulerYXZ: function (x, y, z) {
            var c1 = Math.cos(x / 2);
            var c2 = Math.cos(y / 2);
            var c3 = Math.cos(z / 2);
            var s1 = Math.sin(x / 2);
            var s2 = Math.sin(y / 2);
            var s3 = Math.sin(z / 2);
            this.x = s1 * c2 * c3 + c1 * s2 * s3;
            this.y = c1 * s2 * c3 - s1 * c2 * s3;
            this.z = c1 * c2 * s3 - s1 * s2 * c3;
            this.w = c1 * c2 * c3 + s1 * s2 * s3;
            return this;
        },
        setFromAxisAngle: function (axis, angle) {
            var halfAngle = angle / 2,
                s = Math.sin(halfAngle);
            this.x = axis.x * s;
            this.y = axis.y * s;
            this.z = axis.z * s;
            this.w = Math.cos(halfAngle);
            return this;
        },
        multiply: function (q) {
            return this.multiplyQuaternions(this, q);
        },
        multiplyQuaternions: function (a, b) {
            var qax = a.x,
                qay = a.y,
                qaz = a.z,
                qaw = a.w;
            var qbx = b.x,
                qby = b.y,
                qbz = b.z,
                qbw = b.w;
            this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
            this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
            this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
            this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
            return this;
        },
        inverse: function () {
            this.x *= -1;
            this.y *= -1;
            this.z *= -1;
            this.normalize();
            return this;
        },
        normalize: function () {
            var l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
            if (l === 0) {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.w = 1;
            } else {
                l = 1 / l;
                this.x = this.x * l;
                this.y = this.y * l;
                this.z = this.z * l;
                this.w = this.w * l;
            }
            return this;
        },
        slerp: function (qb, t) {
            if (t === 0) return this;
            if (t === 1) return this.copy(qb);
            var x = this.x,
                y = this.y,
                z = this.z,
                w = this.w;
            var cosHalfTheta = w * qb.w + x * qb.x + y * qb.y + z * qb.z;
            if (cosHalfTheta < 0) {
                this.w = -qb.w;
                this.x = -qb.x;
                this.y = -qb.y;
                this.z = -qb.z;
                cosHalfTheta = -cosHalfTheta;
            } else {
                this.copy(qb);
            }
            if (cosHalfTheta >= 1.0) {
                this.w = w;
                this.x = x;
                this.y = y;
                this.z = z;
                return this;
            }
            var halfTheta = Math.acos(cosHalfTheta);
            var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
            if (Math.abs(sinHalfTheta) < 0.001) {
                this.w = 0.5 * (w + this.w);
                this.x = 0.5 * (x + this.x);
                this.y = 0.5 * (y + this.y);
                this.z = 0.5 * (z + this.z);
                return this;
            }
            var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
                ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
            this.w = (w * ratioA + this.w * ratioB);
            this.x = (x * ratioA + this.x * ratioB);
            this.y = (y * ratioA + this.y * ratioB);
            this.z = (z * ratioA + this.z * ratioB);
            return this;
        },
        setFromUnitVectors: function () {
            var v1, r;
            var EPS = 0.000001;
            return function (vFrom, vTo) {
                if (v1 === undefined) v1 = new MathUtil.Vector3();
                r = vFrom.dot(vTo) + 1;
                if (r < EPS) {
                    r = 0;
                    if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
                        v1.set(-vFrom.y, vFrom.x, 0);
                    } else {
                        v1.set(0, -vFrom.z, vFrom.y);
                    }
                } else {
                    v1.crossVectors(vFrom, vTo);
                }
                this.x = v1.x;
                this.y = v1.y;
                this.z = v1.z;
                this.w = r;
                this.normalize();
                return this;
            }
        }(),
    };
    var mathUtil = MathUtil;

    function Device(params) {
        this.width = params.width || util$2.getScreenWidth();
        this.height = params.height || util$2.getScreenHeight();
        this.widthMeters = params.widthMeters;
        this.heightMeters = params.heightMeters;
        this.bevelMeters = params.bevelMeters;
    }
    var DEFAULT_ANDROID = new Device({
        widthMeters: 0.110,
        heightMeters: 0.062,
        bevelMeters: 0.004
    });
    var DEFAULT_IOS = new Device({
        widthMeters: 0.1038,
        heightMeters: 0.0584,
        bevelMeters: 0.004
    });
    var Viewers = {
        CardboardV1: new CardboardViewer({
            id: 'CardboardV1',
            label: 'Cardboard I/O 2014',
            fov: 40,
            interLensDistance: 0.060,
            baselineLensDistance: 0.035,
            screenLensDistance: 0.042,
            distortionCoefficients: [0.441, 0.156],
            inverseCoefficients: [-0.4410035, 0.42756155, -0.4804439, 0.5460139, -0.58821183, 0.5733938, -0.48303202, 0.33299083, -0.17573841,
                0.0651772, -0.01488963, 0.001559834
            ]
        }),
        CardboardV2: new CardboardViewer({
            id: 'CardboardV2',
            label: 'Cardboard I/O 2015',
            fov: 60,
            interLensDistance: 0.064,
            baselineLensDistance: 0.035,
            screenLensDistance: 0.039,
            distortionCoefficients: [0.34, 0.55],
            inverseCoefficients: [-0.33836704, -0.18162185, 0.862655, -1.2462051,
                1.0560602, -0.58208317, 0.21609078, -0.05444823, 0.009177956, -9.904169E-4, 6.183535E-5, -1.6981803E-6
            ]
        })
    };

    function DeviceInfo(deviceParams) {
        this.viewer = Viewers.CardboardV2;
        this.updateDeviceParams(deviceParams);
        this.distortion = new distortion(this.viewer.distortionCoefficients);
    }
    DeviceInfo.prototype.updateDeviceParams = function (deviceParams) {
        this.device = this.determineDevice_(deviceParams) || this.device;
    };
    DeviceInfo.prototype.getDevice = function () {
        return this.device;
    };
    DeviceInfo.prototype.setViewer = function (viewer) {
        this.viewer = viewer;
        this.distortion = new distortion(this.viewer.distortionCoefficients);
    };
    DeviceInfo.prototype.determineDevice_ = function (deviceParams) {
        if (!deviceParams) {
            if (util$2.isIOS()) {
                console.warn('Using fallback iOS device measurements.');
                return DEFAULT_IOS;
            } else {
                console.warn('Using fallback Android device measurements.');
                return DEFAULT_ANDROID;
            }
        }
        var METERS_PER_INCH = 0.0254;
        var metersPerPixelX = METERS_PER_INCH / deviceParams.xdpi;
        var metersPerPixelY = METERS_PER_INCH / deviceParams.ydpi;
        var width = util$2.getScreenWidth();
        var height = util$2.getScreenHeight();
        return new Device({
            widthMeters: metersPerPixelX * width,
            heightMeters: metersPerPixelY * height,
            bevelMeters: deviceParams.bevelMm * 0.001,
        });
    };
    DeviceInfo.prototype.getDistortedFieldOfViewLeftEye = function () {
        var viewer = this.viewer;
        var device = this.device;
        var distortion$$1 = this.distortion;
        var eyeToScreenDistance = viewer.screenLensDistance;
        var outerDist = (device.widthMeters - viewer.interLensDistance) / 2;
        var innerDist = viewer.interLensDistance / 2;
        var bottomDist = viewer.baselineLensDistance - device.bevelMeters;
        var topDist = device.heightMeters - bottomDist;
        var outerAngle = mathUtil.radToDeg * Math.atan(
            distortion$$1.distort(outerDist / eyeToScreenDistance));
        var innerAngle = mathUtil.radToDeg * Math.atan(
            distortion$$1.distort(innerDist / eyeToScreenDistance));
        var bottomAngle = mathUtil.radToDeg * Math.atan(
            distortion$$1.distort(bottomDist / eyeToScreenDistance));
        var topAngle = mathUtil.radToDeg * Math.atan(
            distortion$$1.distort(topDist / eyeToScreenDistance));
        return {
            leftDegrees: Math.min(outerAngle, viewer.fov),
            rightDegrees: Math.min(innerAngle, viewer.fov),
            downDegrees: Math.min(bottomAngle, viewer.fov),
            upDegrees: Math.min(topAngle, viewer.fov)
        };
    };
    DeviceInfo.prototype.getLeftEyeVisibleTanAngles = function () {
        var viewer = this.viewer;
        var device = this.device;
        var distortion$$1 = this.distortion;
        var fovLeft = Math.tan(-mathUtil.degToRad * viewer.fov);
        var fovTop = Math.tan(mathUtil.degToRad * viewer.fov);
        var fovRight = Math.tan(mathUtil.degToRad * viewer.fov);
        var fovBottom = Math.tan(-mathUtil.degToRad * viewer.fov);
        var halfWidth = device.widthMeters / 4;
        var halfHeight = device.heightMeters / 2;
        var verticalLensOffset = (viewer.baselineLensDistance - device.bevelMeters - halfHeight);
        var centerX = viewer.interLensDistance / 2 - halfWidth;
        var centerY = -verticalLensOffset;
        var centerZ = viewer.screenLensDistance;
        var screenLeft = distortion$$1.distort((centerX - halfWidth) / centerZ);
        var screenTop = distortion$$1.distort((centerY + halfHeight) / centerZ);
        var screenRight = distortion$$1.distort((centerX + halfWidth) / centerZ);
        var screenBottom = distortion$$1.distort((centerY - halfHeight) / centerZ);
        var result = new Float32Array(4);
        result[0] = Math.max(fovLeft, screenLeft);
        result[1] = Math.min(fovTop, screenTop);
        result[2] = Math.min(fovRight, screenRight);
        result[3] = Math.max(fovBottom, screenBottom);
        return result;
    };
    DeviceInfo.prototype.getLeftEyeNoLensTanAngles = function () {
        var viewer = this.viewer;
        var device = this.device;
        var distortion$$1 = this.distortion;
        var result = new Float32Array(4);
        var fovLeft = distortion$$1.distortInverse(Math.tan(-mathUtil.degToRad * viewer.fov));
        var fovTop = distortion$$1.distortInverse(Math.tan(mathUtil.degToRad * viewer.fov));
        var fovRight = distortion$$1.distortInverse(Math.tan(mathUtil.degToRad * viewer.fov));
        var fovBottom = distortion$$1.distortInverse(Math.tan(-mathUtil.degToRad * viewer.fov));
        var halfWidth = device.widthMeters / 4;
        var halfHeight = device.heightMeters / 2;
        var verticalLensOffset = (viewer.baselineLensDistance - device.bevelMeters - halfHeight);
        var centerX = viewer.interLensDistance / 2 - halfWidth;
        var centerY = -verticalLensOffset;
        var centerZ = viewer.screenLensDistance;
        var screenLeft = (centerX - halfWidth) / centerZ;
        var screenTop = (centerY + halfHeight) / centerZ;
        var screenRight = (centerX + halfWidth) / centerZ;
        var screenBottom = (centerY - halfHeight) / centerZ;
        result[0] = Math.max(fovLeft, screenLeft);
        result[1] = Math.min(fovTop, screenTop);
        result[2] = Math.min(fovRight, screenRight);
        result[3] = Math.max(fovBottom, screenBottom);
        return result;
    };
    DeviceInfo.prototype.getLeftEyeVisibleScreenRect = function (undistortedFrustum) {
        var viewer = this.viewer;
        var device = this.device;
        var dist = viewer.screenLensDistance;
        var eyeX = (device.widthMeters - viewer.interLensDistance) / 2;
        var eyeY = viewer.baselineLensDistance - device.bevelMeters;
        var left = (undistortedFrustum[0] * dist + eyeX) / device.widthMeters;
        var top = (undistortedFrustum[1] * dist + eyeY) / device.heightMeters;
        var right = (undistortedFrustum[2] * dist + eyeX) / device.widthMeters;
        var bottom = (undistortedFrustum[3] * dist + eyeY) / device.heightMeters;
        return {
            x: left,
            y: bottom,
            width: right - left,
            height: top - bottom
        };
    };
    DeviceInfo.prototype.getFieldOfViewLeftEye = function (opt_isUndistorted) {
        return opt_isUndistorted ? this.getUndistortedFieldOfViewLeftEye() :
            this.getDistortedFieldOfViewLeftEye();
    };
    DeviceInfo.prototype.getFieldOfViewRightEye = function (opt_isUndistorted) {
        var fov = this.getFieldOfViewLeftEye(opt_isUndistorted);
        return {
            leftDegrees: fov.rightDegrees,
            rightDegrees: fov.leftDegrees,
            upDegrees: fov.upDegrees,
            downDegrees: fov.downDegrees
        };
    };
    DeviceInfo.prototype.getUndistortedFieldOfViewLeftEye = function () {
        var p = this.getUndistortedParams_();
        return {
            leftDegrees: mathUtil.radToDeg * Math.atan(p.outerDist),
            rightDegrees: mathUtil.radToDeg * Math.atan(p.innerDist),
            downDegrees: mathUtil.radToDeg * Math.atan(p.bottomDist),
            upDegrees: mathUtil.radToDeg * Math.atan(p.topDist)
        };
    };
    DeviceInfo.prototype.getUndistortedViewportLeftEye = function () {
        var p = this.getUndistortedParams_();
        var viewer = this.viewer;
        var device = this.device;
        var eyeToScreenDistance = viewer.screenLensDistance;
        var screenWidth = device.widthMeters / eyeToScreenDistance;
        var screenHeight = device.heightMeters / eyeToScreenDistance;
        var xPxPerTanAngle = device.width / screenWidth;
        var yPxPerTanAngle = device.height / screenHeight;
        var x = Math.round((p.eyePosX - p.outerDist) * xPxPerTanAngle);
        var y = Math.round((p.eyePosY - p.bottomDist) * yPxPerTanAngle);
        return {
            x: x,
            y: y,
            width: Math.round((p.eyePosX + p.innerDist) * xPxPerTanAngle) - x,
            height: Math.round((p.eyePosY + p.topDist) * yPxPerTanAngle) - y
        };
    };
    DeviceInfo.prototype.getUndistortedParams_ = function () {
        var viewer = this.viewer;
        var device = this.device;
        var distortion$$1 = this.distortion;
        var eyeToScreenDistance = viewer.screenLensDistance;
        var halfLensDistance = viewer.interLensDistance / 2 / eyeToScreenDistance;
        var screenWidth = device.widthMeters / eyeToScreenDistance;
        var screenHeight = device.heightMeters / eyeToScreenDistance;
        var eyePosX = screenWidth / 2 - halfLensDistance;
        var eyePosY = (viewer.baselineLensDistance - device.bevelMeters) / eyeToScreenDistance;
        var maxFov = viewer.fov;
        var viewerMax = distortion$$1.distortInverse(Math.tan(mathUtil.degToRad * maxFov));
        var outerDist = Math.min(eyePosX, viewerMax);
        var innerDist = Math.min(halfLensDistance, viewerMax);
        var bottomDist = Math.min(eyePosY, viewerMax);
        var topDist = Math.min(screenHeight - eyePosY, viewerMax);
        return {
            outerDist: outerDist,
            innerDist: innerDist,
            topDist: topDist,
            bottomDist: bottomDist,
            eyePosX: eyePosX,
            eyePosY: eyePosY
        };
    };

    function CardboardViewer(params) {
        this.id = params.id;
        this.label = params.label;
        this.fov = params.fov;
        this.interLensDistance = params.interLensDistance;
        this.baselineLensDistance = params.baselineLensDistance;
        this.screenLensDistance = params.screenLensDistance;
        this.distortionCoefficients = params.distortionCoefficients;
        this.inverseCoefficients = params.inverseCoefficients;
    }
    DeviceInfo.Viewers = Viewers;
    var deviceInfo = DeviceInfo;

    var format = 1;
    var last_updated = "2017-10-12T17:44:41Z";
    var devices = [{
        "type": "android",
        "rules": [{
            "mdmh": "asus/*/Nexus 7/*"
        }, {
            "ua": "Nexus 7"
        }],
        "dpi": [320.8, 323],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "asus/*/ASUS_Z00AD/*"
        }, {
            "ua": "ASUS_Z00AD"
        }],
        "dpi": [403, 404.6],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "Google/*/Pixel XL/*"
        }, {
            "ua": "Pixel XL"
        }],
        "dpi": [537.9, 533],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "Google/*/Pixel/*"
        }, {
            "ua": "Pixel"
        }],
        "dpi": [432.6, 436.7],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "HTC/*/HTC6435LVW/*"
        }, {
            "ua": "HTC6435LVW"
        }],
        "dpi": [449.7, 443.3],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "HTC/*/HTC One XL/*"
        }, {
            "ua": "HTC One XL"
        }],
        "dpi": [315.3, 314.6],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "htc/*/Nexus 9/*"
        }, {
            "ua": "Nexus 9"
        }],
        "dpi": 289,
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "HTC/*/HTC One M9/*"
        }, {
            "ua": "HTC One M9"
        }],
        "dpi": [442.5, 443.3],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "HTC/*/HTC One_M8/*"
        }, {
            "ua": "HTC One_M8"
        }],
        "dpi": [449.7, 447.4],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "HTC/*/HTC One/*"
        }, {
            "ua": "HTC One"
        }],
        "dpi": 472.8,
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "Huawei/*/Nexus 6P/*"
        }, {
            "ua": "Nexus 6P"
        }],
        "dpi": [515.1, 518],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "LENOVO/*/Lenovo PB2-690Y/*"
        }, {
            "ua": "Lenovo PB2-690Y"
        }],
        "dpi": [457.2, 454.713],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "LGE/*/Nexus 5X/*"
        }, {
            "ua": "Nexus 5X"
        }],
        "dpi": [422, 419.9],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "LGE/*/LGMS345/*"
        }, {
            "ua": "LGMS345"
        }],
        "dpi": [221.7, 219.1],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "LGE/*/LG-D800/*"
        }, {
            "ua": "LG-D800"
        }],
        "dpi": [422, 424.1],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "LGE/*/LG-D850/*"
        }, {
            "ua": "LG-D850"
        }],
        "dpi": [537.9, 541.9],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "LGE/*/VS985 4G/*"
        }, {
            "ua": "VS985 4G"
        }],
        "dpi": [537.9, 535.6],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "LGE/*/Nexus 5/*"
        }, {
            "ua": "Nexus 5 B"
        }],
        "dpi": [442.4, 444.8],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "LGE/*/Nexus 4/*"
        }, {
            "ua": "Nexus 4"
        }],
        "dpi": [319.8, 318.4],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "LGE/*/LG-P769/*"
        }, {
            "ua": "LG-P769"
        }],
        "dpi": [240.6, 247.5],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "LGE/*/LGMS323/*"
        }, {
            "ua": "LGMS323"
        }],
        "dpi": [206.6, 204.6],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "LGE/*/LGLS996/*"
        }, {
            "ua": "LGLS996"
        }],
        "dpi": [403.4, 401.5],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "Micromax/*/4560MMX/*"
        }, {
            "ua": "4560MMX"
        }],
        "dpi": [240, 219.4],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "Micromax/*/A250/*"
        }, {
            "ua": "Micromax A250"
        }],
        "dpi": [480, 446.4],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "Micromax/*/Micromax AQ4501/*"
        }, {
            "ua": "Micromax AQ4501"
        }],
        "dpi": 240,
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "motorola/*/G5/*"
        }, {
            "ua": "Moto G (5) Plus"
        }],
        "dpi": [403.4, 403],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "motorola/*/DROID RAZR/*"
        }, {
            "ua": "DROID RAZR"
        }],
        "dpi": [368.1, 256.7],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "motorola/*/XT830C/*"
        }, {
            "ua": "XT830C"
        }],
        "dpi": [254, 255.9],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "motorola/*/XT1021/*"
        }, {
            "ua": "XT1021"
        }],
        "dpi": [254, 256.7],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "motorola/*/XT1023/*"
        }, {
            "ua": "XT1023"
        }],
        "dpi": [254, 256.7],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "motorola/*/XT1028/*"
        }, {
            "ua": "XT1028"
        }],
        "dpi": [326.6, 327.6],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "motorola/*/XT1034/*"
        }, {
            "ua": "XT1034"
        }],
        "dpi": [326.6, 328.4],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "motorola/*/XT1053/*"
        }, {
            "ua": "XT1053"
        }],
        "dpi": [315.3, 316.1],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "motorola/*/XT1562/*"
        }, {
            "ua": "XT1562"
        }],
        "dpi": [403.4, 402.7],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "motorola/*/Nexus 6/*"
        }, {
            "ua": "Nexus 6 B"
        }],
        "dpi": [494.3, 489.7],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "motorola/*/XT1063/*"
        }, {
            "ua": "XT1063"
        }],
        "dpi": [295, 296.6],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "motorola/*/XT1064/*"
        }, {
            "ua": "XT1064"
        }],
        "dpi": [295, 295.6],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "motorola/*/XT1092/*"
        }, {
            "ua": "XT1092"
        }],
        "dpi": [422, 424.1],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "motorola/*/XT1095/*"
        }, {
            "ua": "XT1095"
        }],
        "dpi": [422, 423.4],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "motorola/*/G4/*"
        }, {
            "ua": "Moto G (4)"
        }],
        "dpi": 401,
        "bw": 4,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "OnePlus/*/A0001/*"
        }, {
            "ua": "A0001"
        }],
        "dpi": [403.4, 401],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "OnePlus/*/ONE E1005/*"
        }, {
            "ua": "ONE E1005"
        }],
        "dpi": [442.4, 441.4],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "OnePlus/*/ONE A2005/*"
        }, {
            "ua": "ONE A2005"
        }],
        "dpi": [391.9, 405.4],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "OPPO/*/X909/*"
        }, {
            "ua": "X909"
        }],
        "dpi": [442.4, 444.1],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/GT-I9082/*"
        }, {
            "ua": "GT-I9082"
        }],
        "dpi": [184.7, 185.4],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-G360P/*"
        }, {
            "ua": "SM-G360P"
        }],
        "dpi": [196.7, 205.4],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/Nexus S/*"
        }, {
            "ua": "Nexus S"
        }],
        "dpi": [234.5, 229.8],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/GT-I9300/*"
        }, {
            "ua": "GT-I9300"
        }],
        "dpi": [304.8, 303.9],
        "bw": 5,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-T230NU/*"
        }, {
            "ua": "SM-T230NU"
        }],
        "dpi": 216,
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SGH-T399/*"
        }, {
            "ua": "SGH-T399"
        }],
        "dpi": [217.7, 231.4],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SGH-M919/*"
        }, {
            "ua": "SGH-M919"
        }],
        "dpi": [440.8, 437.7],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-N9005/*"
        }, {
            "ua": "SM-N9005"
        }],
        "dpi": [386.4, 387],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SAMSUNG-SM-N900A/*"
        }, {
            "ua": "SAMSUNG-SM-N900A"
        }],
        "dpi": [386.4, 387.7],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/GT-I9500/*"
        }, {
            "ua": "GT-I9500"
        }],
        "dpi": [442.5, 443.3],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/GT-I9505/*"
        }, {
            "ua": "GT-I9505"
        }],
        "dpi": 439.4,
        "bw": 4,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-G900F/*"
        }, {
            "ua": "SM-G900F"
        }],
        "dpi": [415.6, 431.6],
        "bw": 5,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-G900M/*"
        }, {
            "ua": "SM-G900M"
        }],
        "dpi": [415.6, 431.6],
        "bw": 5,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-G800F/*"
        }, {
            "ua": "SM-G800F"
        }],
        "dpi": 326.8,
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-G906S/*"
        }, {
            "ua": "SM-G906S"
        }],
        "dpi": [562.7, 572.4],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/GT-I9300/*"
        }, {
            "ua": "GT-I9300"
        }],
        "dpi": [306.7, 304.8],
        "bw": 5,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-T535/*"
        }, {
            "ua": "SM-T535"
        }],
        "dpi": [142.6, 136.4],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-N920C/*"
        }, {
            "ua": "SM-N920C"
        }],
        "dpi": [515.1, 518.4],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-N920P/*"
        }, {
            "ua": "SM-N920P"
        }],
        "dpi": [386.3655, 390.144],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-N920W8/*"
        }, {
            "ua": "SM-N920W8"
        }],
        "dpi": [515.1, 518.4],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/GT-I9300I/*"
        }, {
            "ua": "GT-I9300I"
        }],
        "dpi": [304.8, 305.8],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/GT-I9195/*"
        }, {
            "ua": "GT-I9195"
        }],
        "dpi": [249.4, 256.7],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SPH-L520/*"
        }, {
            "ua": "SPH-L520"
        }],
        "dpi": [249.4, 255.9],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SAMSUNG-SGH-I717/*"
        }, {
            "ua": "SAMSUNG-SGH-I717"
        }],
        "dpi": 285.8,
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SPH-D710/*"
        }, {
            "ua": "SPH-D710"
        }],
        "dpi": [217.7, 204.2],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/GT-N7100/*"
        }, {
            "ua": "GT-N7100"
        }],
        "dpi": 265.1,
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SCH-I605/*"
        }, {
            "ua": "SCH-I605"
        }],
        "dpi": 265.1,
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/Galaxy Nexus/*"
        }, {
            "ua": "Galaxy Nexus"
        }],
        "dpi": [315.3, 314.2],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-N910H/*"
        }, {
            "ua": "SM-N910H"
        }],
        "dpi": [515.1, 518],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-N910C/*"
        }, {
            "ua": "SM-N910C"
        }],
        "dpi": [515.2, 520.2],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-G130M/*"
        }, {
            "ua": "SM-G130M"
        }],
        "dpi": [165.9, 164.8],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-G928I/*"
        }, {
            "ua": "SM-G928I"
        }],
        "dpi": [515.1, 518.4],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-G920F/*"
        }, {
            "ua": "SM-G920F"
        }],
        "dpi": 580.6,
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-G920P/*"
        }, {
            "ua": "SM-G920P"
        }],
        "dpi": [522.5, 577],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-G925F/*"
        }, {
            "ua": "SM-G925F"
        }],
        "dpi": 580.6,
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-G925V/*"
        }, {
            "ua": "SM-G925V"
        }],
        "dpi": [522.5, 576.6],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-G930F/*"
        }, {
            "ua": "SM-G930F"
        }],
        "dpi": 576.6,
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-G935F/*"
        }, {
            "ua": "SM-G935F"
        }],
        "dpi": 533,
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-G950F/*"
        }, {
            "ua": "SM-G950F"
        }],
        "dpi": [562.707, 565.293],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "samsung/*/SM-G955U/*"
        }, {
            "ua": "SM-G955U"
        }],
        "dpi": [522.514, 525.762],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "Sony/*/C6903/*"
        }, {
            "ua": "C6903"
        }],
        "dpi": [442.5, 443.3],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "Sony/*/D6653/*"
        }, {
            "ua": "D6653"
        }],
        "dpi": [428.6, 427.6],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "Sony/*/E6653/*"
        }, {
            "ua": "E6653"
        }],
        "dpi": [428.6, 425.7],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "Sony/*/E6853/*"
        }, {
            "ua": "E6853"
        }],
        "dpi": [403.4, 401.9],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "Sony/*/SGP321/*"
        }, {
            "ua": "SGP321"
        }],
        "dpi": [224.7, 224.1],
        "bw": 3,
        "ac": 500
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "TCT/*/ALCATEL ONE TOUCH Fierce/*"
        }, {
            "ua": "ALCATEL ONE TOUCH Fierce"
        }],
        "dpi": [240, 247.5],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "THL/*/thl 5000/*"
        }, {
            "ua": "thl 5000"
        }],
        "dpi": [480, 443.3],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "Fly/*/IQ4412/*"
        }, {
            "ua": "IQ4412"
        }],
        "dpi": 307.9,
        "bw": 3,
        "ac": 1000
    }, {
        "type": "android",
        "rules": [{
            "mdmh": "ZTE/*/ZTE Blade L2/*"
        }, {
            "ua": "ZTE Blade L2"
        }],
        "dpi": 240,
        "bw": 3,
        "ac": 500
    }, {
        "type": "ios",
        "rules": [{
            "res": [640, 960]
        }],
        "dpi": [325.1, 328.4],
        "bw": 4,
        "ac": 1000
    }, {
        "type": "ios",
        "rules": [{
            "res": [640, 1136]
        }],
        "dpi": [317.1, 320.2],
        "bw": 3,
        "ac": 1000
    }, {
        "type": "ios",
        "rules": [{
            "res": [750, 1334]
        }],
        "dpi": 326.4,
        "bw": 4,
        "ac": 1000
    }, {
        "type": "ios",
        "rules": [{
            "res": [1242, 2208]
        }],
        "dpi": [453.6, 458.4],
        "bw": 4,
        "ac": 1000
    }, {
        "type": "ios",
        "rules": [{
            "res": [1125, 2001]
        }],
        "dpi": [410.9, 415.4],
        "bw": 4,
        "ac": 1000
    }];
    var dpdb$2 = {
        format: format,
        last_updated: last_updated,
        devices: devices
    };

    var dpdb$3 = Object.freeze({
        format: format,
        last_updated: last_updated,
        devices: devices,
        default: dpdb$2
    });

    var DPDB_CACHE = (dpdb$3 && dpdb$2) || dpdb$3;

    function Dpdb(url, onDeviceParamsUpdated) {
        this.dpdb = DPDB_CACHE;
        this.recalculateDeviceParams_();
        //  if (url) {
        //    this.onDeviceParamsUpdated = onDeviceParamsUpdated;
        //    var xhr = new XMLHttpRequest();
        //    var obj = this;
        //    xhr.open('GET', url, true);
        //    xhr.addEventListener('load', function() {
        //      obj.loading = false;
        //      if (xhr.status >= 200 && xhr.status <= 299) {
        //        obj.dpdb = JSON.parse(xhr.response);
        //        obj.recalculateDeviceParams_();
        //      } else {
        //        console.error('Error loading online DPDB!');
        //      }
        //    });
        //    xhr.send();
        //  }
    }
    Dpdb.prototype.getDeviceParams = function () {
        return this.deviceParams;
    };
    Dpdb.prototype.recalculateDeviceParams_ = function () {
        var newDeviceParams = this.calcDeviceParams_();
        //  if (newDeviceParams) {
        //    this.deviceParams = newDeviceParams;
        //    if (this.onDeviceParamsUpdated) {
        //      this.onDeviceParamsUpdated(this.deviceParams);
        //    }
        //  } else {
        //    console.error('Failed to recalculate device parameters.');
        //  }
    };
    Dpdb.prototype.calcDeviceParams_ = function () {
        //  var db = this.dpdb;
        //  if (!db) {
        //    console.error('DPDB not available.');
        //    return null;
        //  }
        //  if (db.format != 1) {
        //    console.error('DPDB has unexpected format version.');
        //    return null;
        //  }
        //  if (!db.devices || !db.devices.length) {
        //    console.error('DPDB does not have a devices section.');
        //    return null;
        //  }
        //  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        //  var width = util$2.getScreenWidth();
        //  var height = util$2.getScreenHeight();
        //  if (!db.devices) {
        //    console.error('DPDB has no devices section.');
        //    return null;
        //  }
        //  for (var i = 0; i < db.devices.length; i++) {
        //    var device = db.devices[i];
        //    if (!device.rules) {
        //      console.warn('Device[' + i + '] has no rules section.');
        //      continue;
        //    }
        //    if (device.type != 'ios' && device.type != 'android') {
        //      console.warn('Device[' + i + '] has invalid type.');
        //      continue;
        //    }
        //    if (util$2.isIOS() != (device.type == 'ios')) continue;
        //    var matched = false;
        //    for (var j = 0; j < device.rules.length; j++) {
        //      var rule = device.rules[j];
        //      if (this.matchRule_(rule, userAgent, width, height)) {
        //        matched = true;
        //        break;
        //      }
        //    }
        //    if (!matched) continue;
        //    var xdpi = device.dpi[0] || device.dpi;
        //    var ydpi = device.dpi[1] || device.dpi;
        //    return new DeviceParams({ xdpi: xdpi, ydpi: ydpi, bevelMm: device.bw });
        //  }
        //  console.warn('No DPDB device match.');
        return null;
    };
    Dpdb.prototype.matchRule_ = function (rule, ua, screenWidth, screenHeight) {
        if (!rule.ua && !rule.res) return false;
        if (rule.ua && ua.indexOf(rule.ua) < 0) return false;
        if (rule.res) {
            if (!rule.res[0] || !rule.res[1]) return false;
            var resX = rule.res[0];
            var resY = rule.res[1];
            if (Math.min(screenWidth, screenHeight) != Math.min(resX, resY) ||
                (Math.max(screenWidth, screenHeight) != Math.max(resX, resY))) {
                return false;
            }
        }
        return true;
    };

    function DeviceParams(params) {
        this.xdpi = params.xdpi;
        this.ydpi = params.ydpi;
        this.bevelMm = params.bevelMm;
    }
    var dpdb = Dpdb;

    function SensorSample(sample, timestampS) {
        this.set(sample, timestampS);
    }
    SensorSample.prototype.set = function (sample, timestampS) {
        this.sample = sample;
        this.timestampS = timestampS;
    };
    SensorSample.prototype.copy = function (sensorSample) {
        this.set(sensorSample.sample, sensorSample.timestampS);
    };
    var sensorSample = SensorSample;

    function ComplementaryFilter(kFilter, isDebug) {
        this.kFilter = kFilter;
        this.isDebug = isDebug;
        this.currentAccelMeasurement = new sensorSample();
        this.currentGyroMeasurement = new sensorSample();
        this.previousGyroMeasurement = new sensorSample();
        if (util$2.isIOS()) {
            this.filterQ = new mathUtil.Quaternion(-1, 0, 0, 1);
        } else {
            this.filterQ = new mathUtil.Quaternion(1, 0, 0, 1);
        }
        this.previousFilterQ = new mathUtil.Quaternion();
        this.previousFilterQ.copy(this.filterQ);
        this.accelQ = new mathUtil.Quaternion();
        this.isOrientationInitialized = false;
        this.estimatedGravity = new mathUtil.Vector3();
        this.measuredGravity = new mathUtil.Vector3();
        this.gyroIntegralQ = new mathUtil.Quaternion();
    }
    ComplementaryFilter.prototype.addAccelMeasurement = function (vector, timestampS) {
        this.currentAccelMeasurement.set(vector, timestampS);
    };
    ComplementaryFilter.prototype.addGyroMeasurement = function (vector, timestampS) {
        this.currentGyroMeasurement.set(vector, timestampS);
        var deltaT = timestampS - this.previousGyroMeasurement.timestampS;
        if (util$2.isTimestampDeltaValid(deltaT)) {
            this.run_();
        }
        this.previousGyroMeasurement.copy(this.currentGyroMeasurement);
    };
    ComplementaryFilter.prototype.run_ = function () {
        if (!this.isOrientationInitialized) {
            this.accelQ = this.accelToQuaternion_(this.currentAccelMeasurement.sample);
            this.previousFilterQ.copy(this.accelQ);
            this.isOrientationInitialized = true;
            return;
        }
        var deltaT = this.currentGyroMeasurement.timestampS -
            this.previousGyroMeasurement.timestampS;
        var gyroDeltaQ = this.gyroToQuaternionDelta_(this.currentGyroMeasurement.sample, deltaT);
        this.gyroIntegralQ.multiply(gyroDeltaQ);
        this.filterQ.copy(this.previousFilterQ);
        this.filterQ.multiply(gyroDeltaQ);
        var invFilterQ = new mathUtil.Quaternion();
        invFilterQ.copy(this.filterQ);
        invFilterQ.inverse();
        this.estimatedGravity.set(0, 0, -1);
        this.estimatedGravity.applyQuaternion(invFilterQ);
        this.estimatedGravity.normalize();
        this.measuredGravity.copy(this.currentAccelMeasurement.sample);
        this.measuredGravity.normalize();
        var deltaQ = new mathUtil.Quaternion();
        deltaQ.setFromUnitVectors(this.estimatedGravity, this.measuredGravity);
        deltaQ.inverse();
        if (this.isDebug) {
            console.log('Delta: %d deg, G_est: (%s, %s, %s), G_meas: (%s, %s, %s)',
                mathUtil.radToDeg * util$2.getQuaternionAngle(deltaQ),
                (this.estimatedGravity.x).toFixed(1),
                (this.estimatedGravity.y).toFixed(1),
                (this.estimatedGravity.z).toFixed(1),
                (this.measuredGravity.x).toFixed(1),
                (this.measuredGravity.y).toFixed(1),
                (this.measuredGravity.z).toFixed(1));
        }
        var targetQ = new mathUtil.Quaternion();
        targetQ.copy(this.filterQ);
        targetQ.multiply(deltaQ);
        this.filterQ.slerp(targetQ, 1 - this.kFilter);
        this.previousFilterQ.copy(this.filterQ);
    };
    ComplementaryFilter.prototype.getOrientation = function () {
        return this.filterQ;
    };
    ComplementaryFilter.prototype.accelToQuaternion_ = function (accel) {
        var normAccel = new mathUtil.Vector3();
        normAccel.copy(accel);
        normAccel.normalize();
        var quat = new mathUtil.Quaternion();
        quat.setFromUnitVectors(new mathUtil.Vector3(0, 0, -1), normAccel);
        quat.inverse();
        return quat;
    };
    ComplementaryFilter.prototype.gyroToQuaternionDelta_ = function (gyro, dt) {
        var quat = new mathUtil.Quaternion();
        var axis = new mathUtil.Vector3();
        axis.copy(gyro);
        axis.normalize();
        quat.setFromAxisAngle(axis, gyro.length() * dt);
        return quat;
    };
    var complementaryFilter = ComplementaryFilter;

    function PosePredictor(predictionTimeS, isDebug) {
        this.predictionTimeS = predictionTimeS;
        this.isDebug = isDebug;
        this.previousQ = new mathUtil.Quaternion();
        this.previousTimestampS = null;
        this.deltaQ = new mathUtil.Quaternion();
        this.outQ = new mathUtil.Quaternion();
    }
    PosePredictor.prototype.getPrediction = function (currentQ, gyro, timestampS) {
        if (!this.previousTimestampS) {
            this.previousQ.copy(currentQ);
            this.previousTimestampS = timestampS;
            return currentQ;
        }
        var axis = new mathUtil.Vector3();
        axis.copy(gyro);
        axis.normalize();
        var angularSpeed = gyro.length();
        if (angularSpeed < mathUtil.degToRad * 20) {
            if (this.isDebug) {
                console.log('Moving slowly, at %s deg/s: no prediction',
                    (mathUtil.radToDeg * angularSpeed).toFixed(1));
            }
            this.outQ.copy(currentQ);
            this.previousQ.copy(currentQ);
            return this.outQ;
        }
        var deltaT = timestampS - this.previousTimestampS;
        var predictAngle = angularSpeed * this.predictionTimeS;
        this.deltaQ.setFromAxisAngle(axis, predictAngle);
        this.outQ.copy(this.previousQ);
        this.outQ.multiply(this.deltaQ);
        this.previousQ.copy(currentQ);
        this.previousTimestampS = timestampS;
        return this.outQ;
    };
    var posePredictor = PosePredictor;

    var ROTATE_SPEED = 0.5;

    function TouchPanner() {
        window.addEventListener('touchstart', this.onTouchStart_.bind(this));
        window.addEventListener('touchmove', this.onTouchMove_.bind(this));
        window.addEventListener('touchend', this.onTouchEnd_.bind(this));
        this.isTouching = false;
        this.rotateStart = new mathUtil.Vector2();
        this.rotateEnd = new mathUtil.Vector2();
        this.rotateDelta = new mathUtil.Vector2();
        this.theta = 0;
        this.orientation = new mathUtil.Quaternion();
    }
    TouchPanner.prototype.getOrientation = function () {
        this.orientation.setFromEulerXYZ(0, 0, this.theta);
        return this.orientation;
    };
    TouchPanner.prototype.resetSensor = function () {
        this.theta = 0;
    };
    TouchPanner.prototype.onTouchStart_ = function (e) {
        if (!e.touches || e.touches.length != 1) {
            return;
        }
        this.rotateStart.set(e.touches[0].pageX, e.touches[0].pageY);
        this.isTouching = true;
    };
    TouchPanner.prototype.onTouchMove_ = function (e) {
        if (!this.isTouching) {
            return;
        }
        this.rotateEnd.set(e.touches[0].pageX, e.touches[0].pageY);
        this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
        this.rotateStart.copy(this.rotateEnd);
        if (util$2.isIOS()) {
            this.rotateDelta.x *= -1;
        }
        var element = document.body;
        this.theta += 2 * Math.PI * this.rotateDelta.x / element.clientWidth * ROTATE_SPEED;
    };
    TouchPanner.prototype.onTouchEnd_ = function (e) {
        this.isTouching = false;
    };
    var touchPanner = TouchPanner;

    function FusionPoseSensor(kFilter, predictionTime, touchPannerDisabled, yawOnly, isDebug) {
        this.deviceId = 'webvr-polyfill:fused';
        this.deviceName = 'VR Position Device (webvr-polyfill:fused)';
        this.touchPannerDisabled = touchPannerDisabled;
        this.yawOnly = yawOnly;
        this.accelerometer = new mathUtil.Vector3();
        this.gyroscope = new mathUtil.Vector3();
        this.start();
        this.filter = new complementaryFilter(kFilter, isDebug);
        this.posePredictor = new posePredictor(predictionTime, isDebug);
        this.touchPanner = new touchPanner();
        this.filterToWorldQ = new mathUtil.Quaternion();
        if (util$2.isIOS()) {
            this.filterToWorldQ.setFromAxisAngle(new mathUtil.Vector3(1, 0, 0), Math.PI / 2);
        } else {
            this.filterToWorldQ.setFromAxisAngle(new mathUtil.Vector3(1, 0, 0), -Math.PI / 2);
        }
        this.inverseWorldToScreenQ = new mathUtil.Quaternion();
        this.worldToScreenQ = new mathUtil.Quaternion();
        this.originalPoseAdjustQ = new mathUtil.Quaternion();
        this.originalPoseAdjustQ.setFromAxisAngle(new mathUtil.Vector3(0, 0, 1), -window.orientation * Math.PI / 180);
        this.setScreenTransform_();
        if (util$2.isLandscapeMode()) {
            this.filterToWorldQ.multiply(this.inverseWorldToScreenQ);
        }
        this.resetQ = new mathUtil.Quaternion();
        this.isFirefoxAndroid = util$2.isFirefoxAndroid();
        this.isIOS = util$2.isIOS();
        this.orientationOut_ = new Float32Array(4);
    }
    FusionPoseSensor.prototype.getPosition = function () {
        return null;
    };
    FusionPoseSensor.prototype.getOrientation = function () {
        var orientation = this.filter.getOrientation();
        this.predictedQ = this.posePredictor.getPrediction(orientation, this.gyroscope, this.previousTimestampS);
        var out = new mathUtil.Quaternion();
        out.copy(this.filterToWorldQ);
        out.multiply(this.resetQ);
        if (!this.touchPannerDisabled) {
            out.multiply(this.touchPanner.getOrientation());
        }
        out.multiply(this.predictedQ);
        out.multiply(this.worldToScreenQ);
        if (this.yawOnly) {
            out.x = 0;
            out.z = 0;
            out.normalize();
        }
        this.orientationOut_[0] = out.x;
        this.orientationOut_[1] = out.y;
        this.orientationOut_[2] = out.z;
        this.orientationOut_[3] = out.w;
        return this.orientationOut_;
    };
    FusionPoseSensor.prototype.resetPose = function () {
        this.resetQ.copy(this.filter.getOrientation());
        this.resetQ.x = 0;
        this.resetQ.y = 0;
        this.resetQ.z *= -1;
        this.resetQ.normalize();
        if (util$2.isLandscapeMode()) {
            this.resetQ.multiply(this.inverseWorldToScreenQ);
        }
        this.resetQ.multiply(this.originalPoseAdjustQ);
        if (!this.touchPannerDisabled) {
            this.touchPanner.resetSensor();
        }
    };
    FusionPoseSensor.prototype.onDeviceMotion_ = function (deviceMotion) {
        this.updateDeviceMotion_(deviceMotion);
    };
    FusionPoseSensor.prototype.updateDeviceMotion_ = function (deviceMotion) {
        var accGravity = deviceMotion.accelerationIncludingGravity;
        var rotRate = deviceMotion.rotationRate;
        var timestampS = deviceMotion.timeStamp / 1000;
        var deltaS = timestampS - this.previousTimestampS;
        if (deltaS <= util$2.MIN_TIMESTEP || deltaS > util$2.MAX_TIMESTEP) {
            console.warn('Invalid timestamps detected. Time step between successive ' +
                'gyroscope sensor samples is very small or not monotonic');
            this.previousTimestampS = timestampS;
            return;
        }
        this.accelerometer.set(-accGravity.x, -accGravity.y, -accGravity.z);
        if (util$2.isR7()) {
            this.gyroscope.set(-rotRate.beta, rotRate.alpha, rotRate.gamma);
        } else {
            this.gyroscope.set(rotRate.alpha, rotRate.beta, rotRate.gamma);
        }
        if (this.isIOS || this.isFirefoxAndroid) {
            this.gyroscope.multiplyScalar(Math.PI / 180);
        }
        this.filter.addAccelMeasurement(this.accelerometer, timestampS);
        this.filter.addGyroMeasurement(this.gyroscope, timestampS);
        this.previousTimestampS = timestampS;
    };
    FusionPoseSensor.prototype.onOrientationChange_ = function (screenOrientation) {
        this.setScreenTransform_();
    };
    FusionPoseSensor.prototype.onMessage_ = function (event) {
        var message = event.data;
        if (!message || !message.type) {
            return;
        }
        var type = message.type.toLowerCase();
        if (type !== 'devicemotion') {
            return;
        }
        this.updateDeviceMotion_(message.deviceMotionEvent);
    };
    FusionPoseSensor.prototype.setScreenTransform_ = function () {
        this.worldToScreenQ.set(0, 0, 0, 1);
        switch (window.orientation) {
            case 0:
                break;
            case 90:
                this.worldToScreenQ.setFromAxisAngle(new mathUtil.Vector3(0, 0, 1), -Math.PI / 2);
                break;
            case -90:
                this.worldToScreenQ.setFromAxisAngle(new mathUtil.Vector3(0, 0, 1), Math.PI / 2);
                break;
            case 180:
                break;
        }
        this.inverseWorldToScreenQ.copy(this.worldToScreenQ);
        this.inverseWorldToScreenQ.inverse();
    };
    FusionPoseSensor.prototype.start = function () {
        this.onDeviceMotionCallback_ = this.onDeviceMotion_.bind(this);
        this.onOrientationChangeCallback_ = this.onOrientationChange_.bind(this);
        this.onMessageCallback_ = this.onMessage_.bind(this);
        if (util$2.isIOS() && util$2.isInsideCrossDomainIFrame()) {
            window.addEventListener('message', this.onMessageCallback_);
        }
        window.addEventListener('orientationchange', this.onOrientationChangeCallback_);
        window.addEventListener('devicemotion', this.onDeviceMotionCallback_);
    };
    FusionPoseSensor.prototype.stop = function () {
        window.removeEventListener('devicemotion', this.onDeviceMotionCallback_);
        window.removeEventListener('orientationchange', this.onOrientationChangeCallback_);
        window.removeEventListener('message', this.onMessageCallback_);
    };
    var fusionPoseSensor = FusionPoseSensor;

    function RotateInstructions() {
        this.loadIcon_();
        var overlay = document.createElement('div');
        var s = overlay.style;
        s.position = 'fixed';
        s.top = 0;
        s.right = 0;
        s.bottom = 0;
        s.left = 0;
        s.background = 'linear-gradient(to bottom, #2b323c, #4a5461)';
        s.fontFamily = 'sans-serif';
        s.zIndex = 1000001;
        var img = document.createElement('img');
        img.src = this.icon;
        img.src = 'data:image/gif;base64,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';
        var s = img.style;
        s.marginLeft = '25%';
        s.marginTop = '25%';
        s.width = '50%';
        overlay.appendChild(img);
        var text = document.createElement('div');
        var s = text.style;
        s.textAlign = 'center';
        s.fontSize = '17px';
        s.color = '#fff';
        s.lineHeight = '25px';
        s.margin = '36px 25% 0 25%';
        s.width = '50%';
        text.innerHTML = '请解除手机锁屏，再将手机向左横放入眼镜中';
        overlay.appendChild(text);
        /*var tip = document.createElement('div');
        tip.style.marginTop = '12px';
        tip.style.height = '22px';
        tip.style.lineHeight = '22px';
        tip.style.color = '#fff';
        tip.style.textAlign = 'center';
        tip.innerHTML = '<span style="color: #98f8d6;">10秒</span>后自动进入VR模式';
        overlay.appendChild(tip);*/
        var snackbar = document.createElement('div');
        var s = snackbar.style;
        s.backgroundColor = '#000';
        s.position = 'fixed';
        s.bottom = 0;
        s.width = '100%';
        s.height = '57px';
        s.padding = '17px 17px';
        s.boxSizing = 'border-box';
        s.color = '#fff';
        s.fontSize = '14px';
        overlay.appendChild(snackbar);
        var snackbarText = document.createElement('div');
        snackbarText.style.float = 'left';
        snackbarText.style.height = '22px';
        snackbarText.style.lineHeight = '22px';
        snackbarText.innerHTML = '还没有VR设备?';
        var snackbarButton = document.createElement('a');
        snackbarButton.href = 'https://so.m.jd.com/ware/search.action?keyword=cardboard';
        snackbarButton.innerHTML = '去购买';
        var s = snackbarButton.style;
        s.float = 'right';
        s.borderLeft = '1px solid #4d5156';
        s.paddingLeft = '22px';
        s.textDecoration = 'none';
        s.color = '#98f8d6';
        s.height = '22px';
        s.lineHeight = '22px';
        snackbar.appendChild(snackbarText);
        snackbar.appendChild(snackbarButton);
        var backButton = document.createElement('a');
        var s = backButton.style;
        s.position = 'absolute';
        s.left = '17px';
        s.top = '17px';
        s.width = '25px';
        s.height = '25px';
        s.zIndex = '1000003';
        s.backgroundImage = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAA5CAYAAAC4YUKZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQzNUUwNTdBMURGQTExRTg4OUUzQTcyOUEwREREOUY0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQzNUUwNTdCMURGQTExRTg4OUUzQTcyOUEwREREOUY0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDM1RTA1NzgxREZBMTFFODg5RTNBNzI5QTBEREQ5RjQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDM1RTA1NzkxREZBMTFFODg5RTNBNzI5QTBEREQ5RjQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7CbplNAAABqklEQVRYw82ZsS8EQRSH9yI5yTUSolPQUOloKKlo0dGRq0Slo/IP0KpFRUuDkoaKiobQICEkihP5NHsJ583t3ezM+r1kuzc7397NfjvzXgIk/3CtAu/AIzBX9OQlYJPf8VwkQBnY4W+8FgVQAQ6wY7EIgG7g1Jj8E1gAktgAfcClAfABTNfzYgIMArfWGgDGf+bGAhgBngyAB2C4MT8GwATwZgDcAAPWmNAAM0DNALgAel3jQgIsAV8GwAnQ1WxsKIA1hwP2gc6s8TE0XI9toKOV+8TQMMBGCpjEhKgAhw6AlXbv5wPQA5wZk9eAeZ+H8tHwlUPDU75/bTvJQ8CdAfACjOVZ4K0mjjo0fG9pOAbEZLoVa4xroD+EZ7ISZh0aPm+m4ZAQVYeGj7M0HApi3eGAvVRSSUyIErCVV8N5IMrAbggN+0IE1bAPRHAN+0AchdawD4TlgeUij4cyv4TEmpB4O2Q8IWNMmW+H1FdUZj8hs7OS2WPK7LZlzh0yJzCZs6jMqVymPiFTqZGqWclU72TqmDIVXZnatkyVX6bfIdP5kemByXQDnX3Rb04NSXfsF/DVAAAAAElFTkSuQmCC")';
        s.backgroundPosition = 'left top';
        s.backgroundSize = 'auto 100%';
        s.backgroundRepeat = 'no-repeat';
        backButton.className = 'pano-vr-back';
        backButton.href = 'javascipt: void(0)';
        backButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            myDisplay.exitPresent();
            // myDisplay = null;
        }, false);
        overlay.appendChild(backButton);
        this.overlay = overlay;
        this.text = text;
        this.hide();
    }
    RotateInstructions.prototype.show = function (parent) {
        if (!parent && !this.overlay.parentElement) {
            document.body.appendChild(this.overlay);
        } else if (parent) {
            if (this.overlay.parentElement && this.overlay.parentElement != parent)
                this.overlay.parentElement.removeChild(this.overlay);
            parent.appendChild(this.overlay);
            var back = this.overlay.querySelector('.pano-vr-back');
            if (back) {
                parent.appendChild(back);
            }
        }
        this.overlay.style.display = 'block';
        var img = this.overlay.querySelector('img');
        var s = img.style;
        if (util$2.isLandscapeMode()) {
            s.width = '20%';
            s.marginLeft = '40%';
            s.marginTop = '3%';
        } else {
            s.width = '50%';
            s.marginLeft = '25%';
            s.marginTop = '25%';
        }
    };
    RotateInstructions.prototype.hide = function (parent) {
        var back = this.overlay.querySelector('.pano-vr-back');
        if (back && parent) {
            parent.appendChild(back);
        }
        this.overlay.style.display = 'none';
    };
    RotateInstructions.prototype.showTemporarily = function (ms, parent) {
        this.show(parent);
        // this.timer = setTimeout(this.hide.bind(this), ms);
    };
    RotateInstructions.prototype.disableShowTemporarily = function () {
        clearTimeout(this.timer);
    };
    RotateInstructions.prototype.update = function (parent) {
        this.disableShowTemporarily();
        if (!util$2.isLandscapeMode() && util$2.isMobile()) {
            this.show();
        } else {
            this.hide(parent);
        }
    };
    RotateInstructions.prototype.loadIcon_ = function () {
        this.icon = util$2.base64('image/svg+xml', 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE5OHB4IiBoZWlnaHQ9IjI0MHB4IiB2aWV3Qm94PSIwIDAgMTk4IDI0MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuMy4zICgxMjA4MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+dHJhbnNpdGlvbjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPgogICAgICAgIDxnIGlkPSJ0cmFuc2l0aW9uIiBza2V0Y2g6dHlwZT0iTVNBcnRib2FyZEdyb3VwIj4KICAgICAgICAgICAgPGcgaWQ9IkltcG9ydGVkLUxheWVycy1Db3B5LTQtKy1JbXBvcnRlZC1MYXllcnMtQ29weS0rLUltcG9ydGVkLUxheWVycy1Db3B5LTItQ29weSIgc2tldGNoOnR5cGU9Ik1TTGF5ZXJHcm91cCI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iSW1wb3J0ZWQtTGF5ZXJzLUNvcHktNCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDEwNy4wMDAwMDApIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTQ5LjYyNSwyLjUyNyBDMTQ5LjYyNSwyLjUyNyAxNTUuODA1LDYuMDk2IDE1Ni4zNjIsNi40MTggTDE1Ni4zNjIsNy4zMDQgQzE1Ni4zNjIsNy40ODEgMTU2LjM3NSw3LjY2NCAxNTYuNCw3Ljg1MyBDMTU2LjQxLDcuOTM0IDE1Ni40Miw4LjAxNSAxNTYuNDI3LDguMDk1IEMxNTYuNTY3LDkuNTEgMTU3LjQwMSwxMS4wOTMgMTU4LjUzMiwxMi4wOTQgTDE2NC4yNTIsMTcuMTU2IEwxNjQuMzMzLDE3LjA2NiBDMTY0LjMzMywxNy4wNjYgMTY4LjcxNSwxNC41MzYgMTY5LjU2OCwxNC4wNDIgQzE3MS4wMjUsMTQuODgzIDE5NS41MzgsMjkuMDM1IDE5NS41MzgsMjkuMDM1IEwxOTUuNTM4LDgzLjAzNiBDMTk1LjUzOCw4My44MDcgMTk1LjE1Miw4NC4yNTMgMTk0LjU5LDg0LjI1MyBDMTk0LjM1Nyw4NC4yNTMgMTk0LjA5NSw4NC4xNzcgMTkzLjgxOCw4NC4wMTcgTDE2OS44NTEsNzAuMTc5IEwxNjkuODM3LDcwLjIwMyBMMTQyLjUxNSw4NS45NzggTDE0MS42NjUsODQuNjU1IEMxMzYuOTM0LDgzLjEyNiAxMzEuOTE3LDgxLjkxNSAxMjYuNzE0LDgxLjA0NSBDMTI2LjcwOSw4MS4wNiAxMjYuNzA3LDgxLjA2OSAxMjYuNzA3LDgxLjA2OSBMMTIxLjY0LDk4LjAzIEwxMTMuNzQ5LDEwMi41ODYgTDExMy43MTIsMTAyLjUyMyBMMTEzLjcxMiwxMzAuMTEzIEMxMTMuNzEyLDEzMC44ODUgMTEzLjMyNiwxMzEuMzMgMTEyLjc2NCwxMzEuMzMgQzExMi41MzIsMTMxLjMzIDExMi4yNjksMTMxLjI1NCAxMTEuOTkyLDEzMS4wOTQgTDY5LjUxOSwxMDYuNTcyIEM2OC41NjksMTA2LjAyMyA2Ny43OTksMTA0LjY5NSA2Ny43OTksMTAzLjYwNSBMNjcuNzk5LDEwMi41NyBMNjcuNzc4LDEwMi42MTcgQzY3LjI3LDEwMi4zOTMgNjYuNjQ4LDEwMi4yNDkgNjUuOTYyLDEwMi4yMTggQzY1Ljg3NSwxMDIuMjE0IDY1Ljc4OCwxMDIuMjEyIDY1LjcwMSwxMDIuMjEyIEM2NS42MDYsMTAyLjIxMiA2NS41MTEsMTAyLjIxNSA2NS40MTYsMTAyLjIxOSBDNjUuMTk1LDEwMi4yMjkgNjQuOTc0LDEwMi4yMzUgNjQuNzU0LDEwMi4yMzUgQzY0LjMzMSwxMDIuMjM1IDYzLjkxMSwxMDIuMjE2IDYzLjQ5OCwxMDIuMTc4IEM2MS44NDMsMTAyLjAyNSA2MC4yOTgsMTAxLjU3OCA1OS4wOTQsMTAwLjg4MiBMMTIuNTE4LDczLjk5MiBMMTIuNTIzLDc0LjAwNCBMMi4yNDUsNTUuMjU0IEMxLjI0NCw1My40MjcgMi4wMDQsNTEuMDM4IDMuOTQzLDQ5LjkxOCBMNTkuOTU0LDE3LjU3MyBDNjAuNjI2LDE3LjE4NSA2MS4zNSwxNy4wMDEgNjIuMDUzLDE3LjAwMSBDNjMuMzc5LDE3LjAwMSA2NC42MjUsMTcuNjYgNjUuMjgsMTguODU0IEw2NS4yODUsMTguODUxIEw2NS41MTIsMTkuMjY0IEw2NS41MDYsMTkuMjY4IEM2NS45MDksMjAuMDAzIDY2LjQwNSwyMC42OCA2Ni45ODMsMjEuMjg2IEw2Ny4yNiwyMS41NTYgQzY5LjE3NCwyMy40MDYgNzEuNzI4LDI0LjM1NyA3NC4zNzMsMjQuMzU3IEM3Ni4zMjIsMjQuMzU3IDc4LjMyMSwyMy44NCA4MC4xNDgsMjIuNzg1IEM4MC4xNjEsMjIuNzg1IDg3LjQ2NywxOC41NjYgODcuNDY3LDE4LjU2NiBDODguMTM5LDE4LjE3OCA4OC44NjMsMTcuOTk0IDg5LjU2NiwxNy45OTQgQzkwLjg5MiwxNy45OTQgOTIuMTM4LDE4LjY1MiA5Mi43OTIsMTkuODQ3IEw5Ni4wNDIsMjUuNzc1IEw5Ni4wNjQsMjUuNzU3IEwxMDIuODQ5LDI5LjY3NCBMMTAyLjc0NCwyOS40OTIgTDE0OS42MjUsMi41MjcgTTE0OS42MjUsMC44OTIgQzE0OS4zNDMsMC44OTIgMTQ5LjA2MiwwLjk2NSAxNDguODEsMS4xMSBMMTAyLjY0MSwyNy42NjYgTDk3LjIzMSwyNC41NDIgTDk0LjIyNiwxOS4wNjEgQzkzLjMxMywxNy4zOTQgOTEuNTI3LDE2LjM1OSA4OS41NjYsMTYuMzU4IEM4OC41NTUsMTYuMzU4IDg3LjU0NiwxNi42MzIgODYuNjQ5LDE3LjE1IEM4My44NzgsMTguNzUgNzkuNjg3LDIxLjE2OSA3OS4zNzQsMjEuMzQ1IEM3OS4zNTksMjEuMzUzIDc5LjM0NSwyMS4zNjEgNzkuMzMsMjEuMzY5IEM3Ny43OTgsMjIuMjU0IDc2LjA4NCwyMi43MjIgNzQuMzczLDIyLjcyMiBDNzIuMDgxLDIyLjcyMiA2OS45NTksMjEuODkgNjguMzk3LDIwLjM4IEw2OC4xNDUsMjAuMTM1IEM2Ny43MDYsMTkuNjcyIDY3LjMyMywxOS4xNTYgNjcuMDA2LDE4LjYwMSBDNjYuOTg4LDE4LjU1OSA2Ni45NjgsMTguNTE5IDY2Ljk0NiwxOC40NzkgTDY2LjcxOSwxOC4wNjUgQzY2LjY5LDE4LjAxMiA2Ni42NTgsMTcuOTYgNjYuNjI0LDE3LjkxMSBDNjUuNjg2LDE2LjMzNyA2My45NTEsMTUuMzY2IDYyLjA1MywxNS4zNjYgQzYxLjA0MiwxNS4zNjYgNjAuMDMzLDE1LjY0IDU5LjEzNiwxNi4xNTggTDMuMTI1LDQ4LjUwMiBDMC40MjYsNTAuMDYxIC0wLjYxMyw1My40NDIgMC44MTEsNTYuMDQgTDExLjA4OSw3NC43OSBDMTEuMjY2LDc1LjExMyAxMS41MzcsNzUuMzUzIDExLjg1LDc1LjQ5NCBMNTguMjc2LDEwMi4yOTggQzU5LjY3OSwxMDMuMTA4IDYxLjQzMywxMDMuNjMgNjMuMzQ4LDEwMy44MDYgQzYzLjgxMiwxMDMuODQ4IDY0LjI4NSwxMDMuODcgNjQuNzU0LDEwMy44NyBDNjUsMTAzLjg3IDY1LjI0OSwxMDMuODY0IDY1LjQ5NCwxMDMuODUyIEM2NS41NjMsMTAzLjg0OSA2NS42MzIsMTAzLjg0NyA2NS43MDEsMTAzLjg0NyBDNjUuNzY0LDEwMy44NDcgNjUuODI4LDEwMy44NDkgNjUuODksMTAzLjg1MiBDNjUuOTg2LDEwMy44NTYgNjYuMDgsMTAzLjg2MyA2Ni4xNzMsMTAzLjg3NCBDNjYuMjgyLDEwNS40NjcgNjcuMzMyLDEwNy4xOTcgNjguNzAyLDEwNy45ODggTDExMS4xNzQsMTMyLjUxIEMxMTEuNjk4LDEzMi44MTIgMTEyLjIzMiwxMzIuOTY1IDExMi43NjQsMTMyLjk2NSBDMTE0LjI2MSwxMzIuOTY1IDExNS4zNDcsMTMxLjc2NSAxMTUuMzQ3LDEzMC4xMTMgTDExNS4zNDcsMTAzLjU1MSBMMTIyLjQ1OCw5OS40NDYgQzEyMi44MTksOTkuMjM3IDEyMy4wODcsOTguODk4IDEyMy4yMDcsOTguNDk4IEwxMjcuODY1LDgyLjkwNSBDMTMyLjI3OSw4My43MDIgMTM2LjU1Nyw4NC43NTMgMTQwLjYwNyw4Ni4wMzMgTDE0MS4xNCw4Ni44NjIgQzE0MS40NTEsODcuMzQ2IDE0MS45NzcsODcuNjEzIDE0Mi41MTYsODcuNjEzIEMxNDIuNzk0LDg3LjYxMyAxNDMuMDc2LDg3LjU0MiAxNDMuMzMzLDg3LjM5MyBMMTY5Ljg2NSw3Mi4wNzYgTDE5Myw4NS40MzMgQzE5My41MjMsODUuNzM1IDE5NC4wNTgsODUuODg4IDE5NC41OSw4NS44ODggQzE5Ni4wODcsODUuODg4IDE5Ny4xNzMsODQuNjg5IDE5Ny4xNzMsODMuMDM2IEwxOTcuMTczLDI5LjAzNSBDMTk3LjE3MywyOC40NTEgMTk2Ljg2MSwyNy45MTEgMTk2LjM1NSwyNy42MTkgQzE5Ni4zNTUsMjcuNjE5IDE3MS44NDMsMTMuNDY3IDE3MC4zODUsMTIuNjI2IEMxNzAuMTMyLDEyLjQ4IDE2OS44NSwxMi40MDcgMTY5LjU2OCwxMi40MDcgQzE2OS4yODUsMTIuNDA3IDE2OS4wMDIsMTIuNDgxIDE2OC43NDksMTIuNjI3IEMxNjguMTQzLDEyLjk3OCAxNjUuNzU2LDE0LjM1NyAxNjQuNDI0LDE1LjEyNSBMMTU5LjYxNSwxMC44NyBDMTU4Ljc5NiwxMC4xNDUgMTU4LjE1NCw4LjkzNyAxNTguMDU0LDcuOTM0IEMxNTguMDQ1LDcuODM3IDE1OC4wMzQsNy43MzkgMTU4LjAyMSw3LjY0IEMxNTguMDA1LDcuNTIzIDE1Ny45OTgsNy40MSAxNTcuOTk4LDcuMzA0IEwxNTcuOTk4LDYuNDE4IEMxNTcuOTk4LDUuODM0IDE1Ny42ODYsNS4yOTUgMTU3LjE4MSw1LjAwMiBDMTU2LjYyNCw0LjY4IDE1MC40NDIsMS4xMTEgMTUwLjQ0MiwxLjExMSBDMTUwLjE4OSwwLjk2NSAxNDkuOTA3LDAuODkyIDE0OS42MjUsMC44OTIiIGlkPSJGaWxsLTEiIGZpbGw9IiM0NTVBNjQiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOTYuMDI3LDI1LjYzNiBMMTQyLjYwMyw1Mi41MjcgQzE0My44MDcsNTMuMjIyIDE0NC41ODIsNTQuMTE0IDE0NC44NDUsNTUuMDY4IEwxNDQuODM1LDU1LjA3NSBMNjMuNDYxLDEwMi4wNTcgTDYzLjQ2LDEwMi4wNTcgQzYxLjgwNiwxMDEuOTA1IDYwLjI2MSwxMDEuNDU3IDU5LjA1NywxMDAuNzYyIEwxMi40ODEsNzMuODcxIEw5Ni4wMjcsMjUuNjM2IiBpZD0iRmlsbC0yIiBmaWxsPSIjRkFGQUZBIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTYzLjQ2MSwxMDIuMTc0IEM2My40NTMsMTAyLjE3NCA2My40NDYsMTAyLjE3NCA2My40MzksMTAyLjE3MiBDNjEuNzQ2LDEwMi4wMTYgNjAuMjExLDEwMS41NjMgNTguOTk4LDEwMC44NjMgTDEyLjQyMiw3My45NzMgQzEyLjM4Niw3My45NTIgMTIuMzY0LDczLjkxNCAxMi4zNjQsNzMuODcxIEMxMi4zNjQsNzMuODMgMTIuMzg2LDczLjc5MSAxMi40MjIsNzMuNzcgTDk1Ljk2OCwyNS41MzUgQzk2LjAwNCwyNS41MTQgOTYuMDQ5LDI1LjUxNCA5Ni4wODUsMjUuNTM1IEwxNDIuNjYxLDUyLjQyNiBDMTQzLjg4OCw1My4xMzQgMTQ0LjY4Miw1NC4wMzggMTQ0Ljk1Nyw1NS4wMzcgQzE0NC45Nyw1NS4wODMgMTQ0Ljk1Myw1NS4xMzMgMTQ0LjkxNSw1NS4xNjEgQzE0NC45MTEsNTUuMTY1IDE0NC44OTgsNTUuMTc0IDE0NC44OTQsNTUuMTc3IEw2My41MTksMTAyLjE1OCBDNjMuNTAxLDEwMi4xNjkgNjMuNDgxLDEwMi4xNzQgNjMuNDYxLDEwMi4xNzQgTDYzLjQ2MSwxMDIuMTc0IFogTTEyLjcxNCw3My44NzEgTDU5LjExNSwxMDAuNjYxIEM2MC4yOTMsMTAxLjM0MSA2MS43ODYsMTAxLjc4MiA2My40MzUsMTAxLjkzNyBMMTQ0LjcwNyw1NS4wMTUgQzE0NC40MjgsNTQuMTA4IDE0My42ODIsNTMuMjg1IDE0Mi41NDQsNTIuNjI4IEw5Ni4wMjcsMjUuNzcxIEwxMi43MTQsNzMuODcxIEwxMi43MTQsNzMuODcxIFoiIGlkPSJGaWxsLTMiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTQ4LjMyNyw1OC40NzEgQzE0OC4xNDUsNTguNDggMTQ3Ljk2Miw1OC40OCAxNDcuNzgxLDU4LjQ3MiBDMTQ1Ljg4Nyw1OC4zODkgMTQ0LjQ3OSw1Ny40MzQgMTQ0LjYzNiw1Ni4zNCBDMTQ0LjY4OSw1NS45NjcgMTQ0LjY2NCw1NS41OTcgMTQ0LjU2NCw1NS4yMzUgTDYzLjQ2MSwxMDIuMDU3IEM2NC4wODksMTAyLjExNSA2NC43MzMsMTAyLjEzIDY1LjM3OSwxMDIuMDk5IEM2NS41NjEsMTAyLjA5IDY1Ljc0MywxMDIuMDkgNjUuOTI1LDEwMi4wOTggQzY3LjgxOSwxMDIuMTgxIDY5LjIyNywxMDMuMTM2IDY5LjA3LDEwNC4yMyBMMTQ4LjMyNyw1OC40NzEiIGlkPSJGaWxsLTQiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNjkuMDcsMTA0LjM0NyBDNjkuMDQ4LDEwNC4zNDcgNjkuMDI1LDEwNC4zNCA2OS4wMDUsMTA0LjMyNyBDNjguOTY4LDEwNC4zMDEgNjguOTQ4LDEwNC4yNTcgNjguOTU1LDEwNC4yMTMgQzY5LDEwMy44OTYgNjguODk4LDEwMy41NzYgNjguNjU4LDEwMy4yODggQzY4LjE1MywxMDIuNjc4IDY3LjEwMywxMDIuMjY2IDY1LjkyLDEwMi4yMTQgQzY1Ljc0MiwxMDIuMjA2IDY1LjU2MywxMDIuMjA3IDY1LjM4NSwxMDIuMjE1IEM2NC43NDIsMTAyLjI0NiA2NC4wODcsMTAyLjIzMiA2My40NSwxMDIuMTc0IEM2My4zOTksMTAyLjE2OSA2My4zNTgsMTAyLjEzMiA2My4zNDcsMTAyLjA4MiBDNjMuMzM2LDEwMi4wMzMgNjMuMzU4LDEwMS45ODEgNjMuNDAyLDEwMS45NTYgTDE0NC41MDYsNTUuMTM0IEMxNDQuNTM3LDU1LjExNiAxNDQuNTc1LDU1LjExMyAxNDQuNjA5LDU1LjEyNyBDMTQ0LjY0Miw1NS4xNDEgMTQ0LjY2OCw1NS4xNyAxNDQuNjc3LDU1LjIwNCBDMTQ0Ljc4MSw1NS41ODUgMTQ0LjgwNiw1NS45NzIgMTQ0Ljc1MSw1Ni4zNTcgQzE0NC43MDYsNTYuNjczIDE0NC44MDgsNTYuOTk0IDE0NS4wNDcsNTcuMjgyIEMxNDUuNTUzLDU3Ljg5MiAxNDYuNjAyLDU4LjMwMyAxNDcuNzg2LDU4LjM1NSBDMTQ3Ljk2NCw1OC4zNjMgMTQ4LjE0Myw1OC4zNjMgMTQ4LjMyMSw1OC4zNTQgQzE0OC4zNzcsNTguMzUyIDE0OC40MjQsNTguMzg3IDE0OC40MzksNTguNDM4IEMxNDguNDU0LDU4LjQ5IDE0OC40MzIsNTguNTQ1IDE0OC4zODUsNTguNTcyIEw2OS4xMjksMTA0LjMzMSBDNjkuMTExLDEwNC4zNDIgNjkuMDksMTA0LjM0NyA2OS4wNywxMDQuMzQ3IEw2OS4wNywxMDQuMzQ3IFogTTY1LjY2NSwxMDEuOTc1IEM2NS43NTQsMTAxLjk3NSA2NS44NDIsMTAxLjk3NyA2NS45MywxMDEuOTgxIEM2Ny4xOTYsMTAyLjAzNyA2OC4yODMsMTAyLjQ2OSA2OC44MzgsMTAzLjEzOSBDNjkuMDY1LDEwMy40MTMgNjkuMTg4LDEwMy43MTQgNjkuMTk4LDEwNC4wMjEgTDE0Ny44ODMsNTguNTkyIEMxNDcuODQ3LDU4LjU5MiAxNDcuODExLDU4LjU5MSAxNDcuNzc2LDU4LjU4OSBDMTQ2LjUwOSw1OC41MzMgMTQ1LjQyMiw1OC4xIDE0NC44NjcsNTcuNDMxIEMxNDQuNTg1LDU3LjA5MSAxNDQuNDY1LDU2LjcwNyAxNDQuNTIsNTYuMzI0IEMxNDQuNTYzLDU2LjAyMSAxNDQuNTUyLDU1LjcxNiAxNDQuNDg4LDU1LjQxNCBMNjMuODQ2LDEwMS45NyBDNjQuMzUzLDEwMi4wMDIgNjQuODY3LDEwMi4wMDYgNjUuMzc0LDEwMS45ODIgQzY1LjQ3MSwxMDEuOTc3IDY1LjU2OCwxMDEuOTc1IDY1LjY2NSwxMDEuOTc1IEw2NS42NjUsMTAxLjk3NSBaIiBpZD0iRmlsbC01IiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTIuMjA4LDU1LjEzNCBDMS4yMDcsNTMuMzA3IDEuOTY3LDUwLjkxNyAzLjkwNiw0OS43OTcgTDU5LjkxNywxNy40NTMgQzYxLjg1NiwxNi4zMzMgNjQuMjQxLDE2LjkwNyA2NS4yNDMsMTguNzM0IEw2NS40NzUsMTkuMTQ0IEM2NS44NzIsMTkuODgyIDY2LjM2OCwyMC41NiA2Ni45NDUsMjEuMTY1IEw2Ny4yMjMsMjEuNDM1IEM3MC41NDgsMjQuNjQ5IDc1LjgwNiwyNS4xNTEgODAuMTExLDIyLjY2NSBMODcuNDMsMTguNDQ1IEM4OS4zNywxNy4zMjYgOTEuNzU0LDE3Ljg5OSA5Mi43NTUsMTkuNzI3IEw5Ni4wMDUsMjUuNjU1IEwxMi40ODYsNzMuODg0IEwyLjIwOCw1NS4xMzQgWiIgaWQ9IkZpbGwtNiIgZmlsbD0iI0ZBRkFGQSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMi40ODYsNzQuMDAxIEMxMi40NzYsNzQuMDAxIDEyLjQ2NSw3My45OTkgMTIuNDU1LDczLjk5NiBDMTIuNDI0LDczLjk4OCAxMi4zOTksNzMuOTY3IDEyLjM4NCw3My45NCBMMi4xMDYsNTUuMTkgQzEuMDc1LDUzLjMxIDEuODU3LDUwLjg0NSAzLjg0OCw0OS42OTYgTDU5Ljg1OCwxNy4zNTIgQzYwLjUyNSwxNi45NjcgNjEuMjcxLDE2Ljc2NCA2Mi4wMTYsMTYuNzY0IEM2My40MzEsMTYuNzY0IDY0LjY2NiwxNy40NjYgNjUuMzI3LDE4LjY0NiBDNjUuMzM3LDE4LjY1NCA2NS4zNDUsMTguNjYzIDY1LjM1MSwxOC42NzQgTDY1LjU3OCwxOS4wODggQzY1LjU4NCwxOS4xIDY1LjU4OSwxOS4xMTIgNjUuNTkxLDE5LjEyNiBDNjUuOTg1LDE5LjgzOCA2Ni40NjksMjAuNDk3IDY3LjAzLDIxLjA4NSBMNjcuMzA1LDIxLjM1MSBDNjkuMTUxLDIzLjEzNyA3MS42NDksMjQuMTIgNzQuMzM2LDI0LjEyIEM3Ni4zMTMsMjQuMTIgNzguMjksMjMuNTgyIDgwLjA1MywyMi41NjMgQzgwLjA2NCwyMi41NTcgODAuMDc2LDIyLjU1MyA4MC4wODgsMjIuNTUgTDg3LjM3MiwxOC4zNDQgQzg4LjAzOCwxNy45NTkgODguNzg0LDE3Ljc1NiA4OS41MjksMTcuNzU2IEM5MC45NTYsMTcuNzU2IDkyLjIwMSwxOC40NzIgOTIuODU4LDE5LjY3IEw5Ni4xMDcsMjUuNTk5IEM5Ni4xMzgsMjUuNjU0IDk2LjExOCwyNS43MjQgOTYuMDYzLDI1Ljc1NiBMMTIuNTQ1LDczLjk4NSBDMTIuNTI2LDczLjk5NiAxMi41MDYsNzQuMDAxIDEyLjQ4Niw3NC4wMDEgTDEyLjQ4Niw3NC4wMDEgWiBNNjIuMDE2LDE2Ljk5NyBDNjEuMzEyLDE2Ljk5NyA2MC42MDYsMTcuMTkgNTkuOTc1LDE3LjU1NCBMMy45NjUsNDkuODk5IEMyLjA4Myw1MC45ODUgMS4zNDEsNTMuMzA4IDIuMzEsNTUuMDc4IEwxMi41MzEsNzMuNzIzIEw5NS44NDgsMjUuNjExIEw5Mi42NTMsMTkuNzgyIEM5Mi4wMzgsMTguNjYgOTAuODcsMTcuOTkgODkuNTI5LDE3Ljk5IEM4OC44MjUsMTcuOTkgODguMTE5LDE4LjE4MiA4Ny40ODksMTguNTQ3IEw4MC4xNzIsMjIuNzcyIEM4MC4xNjEsMjIuNzc4IDgwLjE0OSwyMi43ODIgODAuMTM3LDIyLjc4NSBDNzguMzQ2LDIzLjgxMSA3Ni4zNDEsMjQuMzU0IDc0LjMzNiwyNC4zNTQgQzcxLjU4OCwyNC4zNTQgNjkuMDMzLDIzLjM0NyA2Ny4xNDIsMjEuNTE5IEw2Ni44NjQsMjEuMjQ5IEM2Ni4yNzcsMjAuNjM0IDY1Ljc3NCwxOS45NDcgNjUuMzY3LDE5LjIwMyBDNjUuMzYsMTkuMTkyIDY1LjM1NiwxOS4xNzkgNjUuMzU0LDE5LjE2NiBMNjUuMTYzLDE4LjgxOSBDNjUuMTU0LDE4LjgxMSA2NS4xNDYsMTguODAxIDY1LjE0LDE4Ljc5IEM2NC41MjUsMTcuNjY3IDYzLjM1NywxNi45OTcgNjIuMDE2LDE2Ljk5NyBMNjIuMDE2LDE2Ljk5NyBaIiBpZD0iRmlsbC03IiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTQyLjQzNCw0OC44MDggTDQyLjQzNCw0OC44MDggQzM5LjkyNCw0OC44MDcgMzcuNzM3LDQ3LjU1IDM2LjU4Miw0NS40NDMgQzM0Ljc3MSw0Mi4xMzkgMzYuMTQ0LDM3LjgwOSAzOS42NDEsMzUuNzg5IEw1MS45MzIsMjguNjkxIEM1My4xMDMsMjguMDE1IDU0LjQxMywyNy42NTggNTUuNzIxLDI3LjY1OCBDNTguMjMxLDI3LjY1OCA2MC40MTgsMjguOTE2IDYxLjU3MywzMS4wMjMgQzYzLjM4NCwzNC4zMjcgNjIuMDEyLDM4LjY1NyA1OC41MTQsNDAuNjc3IEw0Ni4yMjMsNDcuNzc1IEM0NS4wNTMsNDguNDUgNDMuNzQyLDQ4LjgwOCA0Mi40MzQsNDguODA4IEw0Mi40MzQsNDguODA4IFogTTU1LjcyMSwyOC4xMjUgQzU0LjQ5NSwyOC4xMjUgNTMuMjY1LDI4LjQ2MSA1Mi4xNjYsMjkuMDk2IEwzOS44NzUsMzYuMTk0IEMzNi41OTYsMzguMDg3IDM1LjMwMiw0Mi4xMzYgMzYuOTkyLDQ1LjIxOCBDMzguMDYzLDQ3LjE3MyA0MC4wOTgsNDguMzQgNDIuNDM0LDQ4LjM0IEM0My42NjEsNDguMzQgNDQuODksNDguMDA1IDQ1Ljk5LDQ3LjM3IEw1OC4yODEsNDAuMjcyIEM2MS41NiwzOC4zNzkgNjIuODUzLDM0LjMzIDYxLjE2NCwzMS4yNDggQzYwLjA5MiwyOS4yOTMgNTguMDU4LDI4LjEyNSA1NS43MjEsMjguMTI1IEw1NS43MjEsMjguMTI1IFoiIGlkPSJGaWxsLTgiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTQ5LjU4OCwyLjQwNyBDMTQ5LjU4OCwyLjQwNyAxNTUuNzY4LDUuOTc1IDE1Ni4zMjUsNi4yOTcgTDE1Ni4zMjUsNy4xODQgQzE1Ni4zMjUsNy4zNiAxNTYuMzM4LDcuNTQ0IDE1Ni4zNjIsNy43MzMgQzE1Ni4zNzMsNy44MTQgMTU2LjM4Miw3Ljg5NCAxNTYuMzksNy45NzUgQzE1Ni41Myw5LjM5IDE1Ny4zNjMsMTAuOTczIDE1OC40OTUsMTEuOTc0IEwxNjUuODkxLDE4LjUxOSBDMTY2LjA2OCwxOC42NzUgMTY2LjI0OSwxOC44MTQgMTY2LjQzMiwxOC45MzQgQzE2OC4wMTEsMTkuOTc0IDE2OS4zODIsMTkuNCAxNjkuNDk0LDE3LjY1MiBDMTY5LjU0MywxNi44NjggMTY5LjU1MSwxNi4wNTcgMTY5LjUxNywxNS4yMjMgTDE2OS41MTQsMTUuMDYzIEwxNjkuNTE0LDEzLjkxMiBDMTcwLjc4LDE0LjY0MiAxOTUuNTAxLDI4LjkxNSAxOTUuNTAxLDI4LjkxNSBMMTk1LjUwMSw4Mi45MTUgQzE5NS41MDEsODQuMDA1IDE5NC43MzEsODQuNDQ1IDE5My43ODEsODMuODk3IEwxNTEuMzA4LDU5LjM3NCBDMTUwLjM1OCw1OC44MjYgMTQ5LjU4OCw1Ny40OTcgMTQ5LjU4OCw1Ni40MDggTDE0OS41ODgsMjIuMzc1IiBpZD0iRmlsbC05IiBmaWxsPSIjRkFGQUZBIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE5NC41NTMsODQuMjUgQzE5NC4yOTYsODQuMjUgMTk0LjAxMyw4NC4xNjUgMTkzLjcyMiw4My45OTcgTDE1MS4yNSw1OS40NzYgQzE1MC4yNjksNTguOTA5IDE0OS40NzEsNTcuNTMzIDE0OS40NzEsNTYuNDA4IEwxNDkuNDcxLDIyLjM3NSBMMTQ5LjcwNSwyMi4zNzUgTDE0OS43MDUsNTYuNDA4IEMxNDkuNzA1LDU3LjQ1OSAxNTAuNDUsNTguNzQ0IDE1MS4zNjYsNTkuMjc0IEwxOTMuODM5LDgzLjc5NSBDMTk0LjI2Myw4NC4wNCAxOTQuNjU1LDg0LjA4MyAxOTQuOTQyLDgzLjkxNyBDMTk1LjIyNyw4My43NTMgMTk1LjM4NCw4My4zOTcgMTk1LjM4NCw4Mi45MTUgTDE5NS4zODQsMjguOTgyIEMxOTQuMTAyLDI4LjI0MiAxNzIuMTA0LDE1LjU0MiAxNjkuNjMxLDE0LjExNCBMMTY5LjYzNCwxNS4yMiBDMTY5LjY2OCwxNi4wNTIgMTY5LjY2LDE2Ljg3NCAxNjkuNjEsMTcuNjU5IEMxNjkuNTU2LDE4LjUwMyAxNjkuMjE0LDE5LjEyMyAxNjguNjQ3LDE5LjQwNSBDMTY4LjAyOCwxOS43MTQgMTY3LjE5NywxOS41NzggMTY2LjM2NywxOS4wMzIgQzE2Ni4xODEsMTguOTA5IDE2NS45OTUsMTguNzY2IDE2NS44MTQsMTguNjA2IEwxNTguNDE3LDEyLjA2MiBDMTU3LjI1OSwxMS4wMzYgMTU2LjQxOCw5LjQzNyAxNTYuMjc0LDcuOTg2IEMxNTYuMjY2LDcuOTA3IDE1Ni4yNTcsNy44MjcgMTU2LjI0Nyw3Ljc0OCBDMTU2LjIyMSw3LjU1NSAxNTYuMjA5LDcuMzY1IDE1Ni4yMDksNy4xODQgTDE1Ni4yMDksNi4zNjQgQzE1NS4zNzUsNS44ODMgMTQ5LjUyOSwyLjUwOCAxNDkuNTI5LDIuNTA4IEwxNDkuNjQ2LDIuMzA2IEMxNDkuNjQ2LDIuMzA2IDE1NS44MjcsNS44NzQgMTU2LjM4NCw2LjE5NiBMMTU2LjQ0Miw2LjIzIEwxNTYuNDQyLDcuMTg0IEMxNTYuNDQyLDcuMzU1IDE1Ni40NTQsNy41MzUgMTU2LjQ3OCw3LjcxNyBDMTU2LjQ4OSw3LjggMTU2LjQ5OSw3Ljg4MiAxNTYuNTA3LDcuOTYzIEMxNTYuNjQ1LDkuMzU4IDE1Ny40NTUsMTAuODk4IDE1OC41NzIsMTEuODg2IEwxNjUuOTY5LDE4LjQzMSBDMTY2LjE0MiwxOC41ODQgMTY2LjMxOSwxOC43MiAxNjYuNDk2LDE4LjgzNyBDMTY3LjI1NCwxOS4zMzYgMTY4LDE5LjQ2NyAxNjguNTQzLDE5LjE5NiBDMTY5LjAzMywxOC45NTMgMTY5LjMyOSwxOC40MDEgMTY5LjM3NywxNy42NDUgQzE2OS40MjcsMTYuODY3IDE2OS40MzQsMTYuMDU0IDE2OS40MDEsMTUuMjI4IEwxNjkuMzk3LDE1LjA2NSBMMTY5LjM5NywxMy43MSBMMTY5LjU3MiwxMy44MSBDMTcwLjgzOSwxNC41NDEgMTk1LjU1OSwyOC44MTQgMTk1LjU1OSwyOC44MTQgTDE5NS42MTgsMjguODQ3IEwxOTUuNjE4LDgyLjkxNSBDMTk1LjYxOCw4My40ODQgMTk1LjQyLDgzLjkxMSAxOTUuMDU5LDg0LjExOSBDMTk0LjkwOCw4NC4yMDYgMTk0LjczNyw4NC4yNSAxOTQuNTUzLDg0LjI1IiBpZD0iRmlsbC0xMCIgZmlsbD0iIzYwN0Q4QiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNDUuNjg1LDU2LjE2MSBMMTY5LjgsNzAuMDgzIEwxNDMuODIyLDg1LjA4MSBMMTQyLjM2LDg0Ljc3NCBDMTM1LjgyNiw4Mi42MDQgMTI4LjczMiw4MS4wNDYgMTIxLjM0MSw4MC4xNTggQzExNi45NzYsNzkuNjM0IDExMi42NzgsODEuMjU0IDExMS43NDMsODMuNzc4IEMxMTEuNTA2LDg0LjQxNCAxMTEuNTAzLDg1LjA3MSAxMTEuNzMyLDg1LjcwNiBDMTEzLjI3LDg5Ljk3MyAxMTUuOTY4LDk0LjA2OSAxMTkuNzI3LDk3Ljg0MSBMMTIwLjI1OSw5OC42ODYgQzEyMC4yNiw5OC42ODUgOTQuMjgyLDExMy42ODMgOTQuMjgyLDExMy42ODMgTDcwLjE2Nyw5OS43NjEgTDE0NS42ODUsNTYuMTYxIiBpZD0iRmlsbC0xMSIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik05NC4yODIsMTEzLjgxOCBMOTQuMjIzLDExMy43ODUgTDY5LjkzMyw5OS43NjEgTDcwLjEwOCw5OS42NiBMMTQ1LjY4NSw1Ni4wMjYgTDE0NS43NDMsNTYuMDU5IEwxNzAuMDMzLDcwLjA4MyBMMTQzLjg0Miw4NS4yMDUgTDE0My43OTcsODUuMTk1IEMxNDMuNzcyLDg1LjE5IDE0Mi4zMzYsODQuODg4IDE0Mi4zMzYsODQuODg4IEMxMzUuNzg3LDgyLjcxNCAxMjguNzIzLDgxLjE2MyAxMjEuMzI3LDgwLjI3NCBDMTIwLjc4OCw4MC4yMDkgMTIwLjIzNiw4MC4xNzcgMTE5LjY4OSw4MC4xNzcgQzExNS45MzEsODAuMTc3IDExMi42MzUsODEuNzA4IDExMS44NTIsODMuODE5IEMxMTEuNjI0LDg0LjQzMiAxMTEuNjIxLDg1LjA1MyAxMTEuODQyLDg1LjY2NyBDMTEzLjM3Nyw4OS45MjUgMTE2LjA1OCw5My45OTMgMTE5LjgxLDk3Ljc1OCBMMTE5LjgyNiw5Ny43NzkgTDEyMC4zNTIsOTguNjE0IEMxMjAuMzU0LDk4LjYxNyAxMjAuMzU2LDk4LjYyIDEyMC4zNTgsOTguNjI0IEwxMjAuNDIyLDk4LjcyNiBMMTIwLjMxNyw5OC43ODcgQzEyMC4yNjQsOTguODE4IDk0LjU5OSwxMTMuNjM1IDk0LjM0LDExMy43ODUgTDk0LjI4MiwxMTMuODE4IEw5NC4yODIsMTEzLjgxOCBaIE03MC40MDEsOTkuNzYxIEw5NC4yODIsMTEzLjU0OSBMMTE5LjA4NCw5OS4yMjkgQzExOS42Myw5OC45MTQgMTE5LjkzLDk4Ljc0IDEyMC4xMDEsOTguNjU0IEwxMTkuNjM1LDk3LjkxNCBDMTE1Ljg2NCw5NC4xMjcgMTEzLjE2OCw5MC4wMzMgMTExLjYyMiw4NS43NDYgQzExMS4zODIsODUuMDc5IDExMS4zODYsODQuNDA0IDExMS42MzMsODMuNzM4IEMxMTIuNDQ4LDgxLjUzOSAxMTUuODM2LDc5Ljk0MyAxMTkuNjg5LDc5Ljk0MyBDMTIwLjI0Niw3OS45NDMgMTIwLjgwNiw3OS45NzYgMTIxLjM1NSw4MC4wNDIgQzEyOC43NjcsODAuOTMzIDEzNS44NDYsODIuNDg3IDE0Mi4zOTYsODQuNjYzIEMxNDMuMjMyLDg0LjgzOCAxNDMuNjExLDg0LjkxNyAxNDMuNzg2LDg0Ljk2NyBMMTY5LjU2Niw3MC4wODMgTDE0NS42ODUsNTYuMjk1IEw3MC40MDEsOTkuNzYxIEw3MC40MDEsOTkuNzYxIFoiIGlkPSJGaWxsLTEyIiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE2Ny4yMywxOC45NzkgTDE2Ny4yMyw2OS44NSBMMTM5LjkwOSw4NS42MjMgTDEzMy40NDgsNzEuNDU2IEMxMzIuNTM4LDY5LjQ2IDEzMC4wMiw2OS43MTggMTI3LjgyNCw3Mi4wMyBDMTI2Ljc2OSw3My4xNCAxMjUuOTMxLDc0LjU4NSAxMjUuNDk0LDc2LjA0OCBMMTE5LjAzNCw5Ny42NzYgTDkxLjcxMiwxMTMuNDUgTDkxLjcxMiw2Mi41NzkgTDE2Ny4yMywxOC45NzkiIGlkPSJGaWxsLTEzIiBmaWxsPSIjRkZGRkZGIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTkxLjcxMiwxMTMuNTY3IEM5MS42OTIsMTEzLjU2NyA5MS42NzIsMTEzLjU2MSA5MS42NTMsMTEzLjU1MSBDOTEuNjE4LDExMy41MyA5MS41OTUsMTEzLjQ5MiA5MS41OTUsMTEzLjQ1IEw5MS41OTUsNjIuNTc5IEM5MS41OTUsNjIuNTM3IDkxLjYxOCw2Mi40OTkgOTEuNjUzLDYyLjQ3OCBMMTY3LjE3MiwxOC44NzggQzE2Ny4yMDgsMTguODU3IDE2Ny4yNTIsMTguODU3IDE2Ny4yODgsMTguODc4IEMxNjcuMzI0LDE4Ljg5OSAxNjcuMzQ3LDE4LjkzNyAxNjcuMzQ3LDE4Ljk3OSBMMTY3LjM0Nyw2OS44NSBDMTY3LjM0Nyw2OS44OTEgMTY3LjMyNCw2OS45MyAxNjcuMjg4LDY5Ljk1IEwxMzkuOTY3LDg1LjcyNSBDMTM5LjkzOSw4NS43NDEgMTM5LjkwNSw4NS43NDUgMTM5Ljg3Myw4NS43MzUgQzEzOS44NDIsODUuNzI1IDEzOS44MTYsODUuNzAyIDEzOS44MDIsODUuNjcyIEwxMzMuMzQyLDcxLjUwNCBDMTMyLjk2Nyw3MC42ODIgMTMyLjI4LDcwLjIyOSAxMzEuNDA4LDcwLjIyOSBDMTMwLjMxOSw3MC4yMjkgMTI5LjA0NCw3MC45MTUgMTI3LjkwOCw3Mi4xMSBDMTI2Ljg3NCw3My4yIDEyNi4wMzQsNzQuNjQ3IDEyNS42MDYsNzYuMDgyIEwxMTkuMTQ2LDk3LjcwOSBDMTE5LjEzNyw5Ny43MzggMTE5LjExOCw5Ny43NjIgMTE5LjA5Miw5Ny43NzcgTDkxLjc3LDExMy41NTEgQzkxLjc1MiwxMTMuNTYxIDkxLjczMiwxMTMuNTY3IDkxLjcxMiwxMTMuNTY3IEw5MS43MTIsMTEzLjU2NyBaIE05MS44MjksNjIuNjQ3IEw5MS44MjksMTEzLjI0OCBMMTE4LjkzNSw5Ny41OTggTDEyNS4zODIsNzYuMDE1IEMxMjUuODI3LDc0LjUyNSAxMjYuNjY0LDczLjA4MSAxMjcuNzM5LDcxLjk1IEMxMjguOTE5LDcwLjcwOCAxMzAuMjU2LDY5Ljk5NiAxMzEuNDA4LDY5Ljk5NiBDMTMyLjM3Nyw2OS45OTYgMTMzLjEzOSw3MC40OTcgMTMzLjU1NCw3MS40MDcgTDEzOS45NjEsODUuNDU4IEwxNjcuMTEzLDY5Ljc4MiBMMTY3LjExMywxOS4xODEgTDkxLjgyOSw2Mi42NDcgTDkxLjgyOSw2Mi42NDcgWiIgaWQ9IkZpbGwtMTQiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTY4LjU0MywxOS4yMTMgTDE2OC41NDMsNzAuMDgzIEwxNDEuMjIxLDg1Ljg1NyBMMTM0Ljc2MSw3MS42ODkgQzEzMy44NTEsNjkuNjk0IDEzMS4zMzMsNjkuOTUxIDEyOS4xMzcsNzIuMjYzIEMxMjguMDgyLDczLjM3NCAxMjcuMjQ0LDc0LjgxOSAxMjYuODA3LDc2LjI4MiBMMTIwLjM0Niw5Ny45MDkgTDkzLjAyNSwxMTMuNjgzIEw5My4wMjUsNjIuODEzIEwxNjguNTQzLDE5LjIxMyIgaWQ9IkZpbGwtMTUiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOTMuMDI1LDExMy44IEM5My4wMDUsMTEzLjggOTIuOTg0LDExMy43OTUgOTIuOTY2LDExMy43ODUgQzkyLjkzMSwxMTMuNzY0IDkyLjkwOCwxMTMuNzI1IDkyLjkwOCwxMTMuNjg0IEw5Mi45MDgsNjIuODEzIEM5Mi45MDgsNjIuNzcxIDkyLjkzMSw2Mi43MzMgOTIuOTY2LDYyLjcxMiBMMTY4LjQ4NCwxOS4xMTIgQzE2OC41MiwxOS4wOSAxNjguNTY1LDE5LjA5IDE2OC42MDEsMTkuMTEyIEMxNjguNjM3LDE5LjEzMiAxNjguNjYsMTkuMTcxIDE2OC42NiwxOS4yMTIgTDE2OC42Niw3MC4wODMgQzE2OC42Niw3MC4xMjUgMTY4LjYzNyw3MC4xNjQgMTY4LjYwMSw3MC4xODQgTDE0MS4yOCw4NS45NTggQzE0MS4yNTEsODUuOTc1IDE0MS4yMTcsODUuOTc5IDE0MS4xODYsODUuOTY4IEMxNDEuMTU0LDg1Ljk1OCAxNDEuMTI5LDg1LjkzNiAxNDEuMTE1LDg1LjkwNiBMMTM0LjY1NSw3MS43MzggQzEzNC4yOCw3MC45MTUgMTMzLjU5Myw3MC40NjMgMTMyLjcyLDcwLjQ2MyBDMTMxLjYzMiw3MC40NjMgMTMwLjM1Nyw3MS4xNDggMTI5LjIyMSw3Mi4zNDQgQzEyOC4xODYsNzMuNDMzIDEyNy4zNDcsNzQuODgxIDEyNi45MTksNzYuMzE1IEwxMjAuNDU4LDk3Ljk0MyBDMTIwLjQ1LDk3Ljk3MiAxMjAuNDMxLDk3Ljk5NiAxMjAuNDA1LDk4LjAxIEw5My4wODMsMTEzLjc4NSBDOTMuMDY1LDExMy43OTUgOTMuMDQ1LDExMy44IDkzLjAyNSwxMTMuOCBMOTMuMDI1LDExMy44IFogTTkzLjE0Miw2Mi44ODEgTDkzLjE0MiwxMTMuNDgxIEwxMjAuMjQ4LDk3LjgzMiBMMTI2LjY5NSw3Ni4yNDggQzEyNy4xNCw3NC43NTggMTI3Ljk3Nyw3My4zMTUgMTI5LjA1Miw3Mi4xODMgQzEzMC4yMzEsNzAuOTQyIDEzMS41NjgsNzAuMjI5IDEzMi43Miw3MC4yMjkgQzEzMy42ODksNzAuMjI5IDEzNC40NTIsNzAuNzMxIDEzNC44NjcsNzEuNjQxIEwxNDEuMjc0LDg1LjY5MiBMMTY4LjQyNiw3MC4wMTYgTDE2OC40MjYsMTkuNDE1IEw5My4xNDIsNjIuODgxIEw5My4xNDIsNjIuODgxIFoiIGlkPSJGaWxsLTE2IiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE2OS44LDcwLjA4MyBMMTQyLjQ3OCw4NS44NTcgTDEzNi4wMTgsNzEuNjg5IEMxMzUuMTA4LDY5LjY5NCAxMzIuNTksNjkuOTUxIDEzMC4zOTMsNzIuMjYzIEMxMjkuMzM5LDczLjM3NCAxMjguNSw3NC44MTkgMTI4LjA2NCw3Ni4yODIgTDEyMS42MDMsOTcuOTA5IEw5NC4yODIsMTEzLjY4MyBMOTQuMjgyLDYyLjgxMyBMMTY5LjgsMTkuMjEzIEwxNjkuOCw3MC4wODMgWiIgaWQ9IkZpbGwtMTciIGZpbGw9IiNGQUZBRkEiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOTQuMjgyLDExMy45MTcgQzk0LjI0MSwxMTMuOTE3IDk0LjIwMSwxMTMuOTA3IDk0LjE2NSwxMTMuODg2IEM5NC4wOTMsMTEzLjg0NSA5NC4wNDgsMTEzLjc2NyA5NC4wNDgsMTEzLjY4NCBMOTQuMDQ4LDYyLjgxMyBDOTQuMDQ4LDYyLjczIDk0LjA5Myw2Mi42NTIgOTQuMTY1LDYyLjYxMSBMMTY5LjY4MywxOS4wMSBDMTY5Ljc1NSwxOC45NjkgMTY5Ljg0NCwxOC45NjkgMTY5LjkxNywxOS4wMSBDMTY5Ljk4OSwxOS4wNTIgMTcwLjAzMywxOS4xMjkgMTcwLjAzMywxOS4yMTIgTDE3MC4wMzMsNzAuMDgzIEMxNzAuMDMzLDcwLjE2NiAxNjkuOTg5LDcwLjI0NCAxNjkuOTE3LDcwLjI4NSBMMTQyLjU5NSw4Ni4wNiBDMTQyLjUzOCw4Ni4wOTIgMTQyLjQ2OSw4Ni4xIDE0Mi40MDcsODYuMDggQzE0Mi4zNDQsODYuMDYgMTQyLjI5Myw4Ni4wMTQgMTQyLjI2Niw4NS45NTQgTDEzNS44MDUsNzEuNzg2IEMxMzUuNDQ1LDcwLjk5NyAxMzQuODEzLDcwLjU4IDEzMy45NzcsNzAuNTggQzEzMi45MjEsNzAuNTggMTMxLjY3Niw3MS4yNTIgMTMwLjU2Miw3Mi40MjQgQzEyOS41NCw3My41MDEgMTI4LjcxMSw3NC45MzEgMTI4LjI4Nyw3Ni4zNDggTDEyMS44MjcsOTcuOTc2IEMxMjEuODEsOTguMDM0IDEyMS43NzEsOTguMDgyIDEyMS43Miw5OC4xMTIgTDk0LjM5OCwxMTMuODg2IEM5NC4zNjIsMTEzLjkwNyA5NC4zMjIsMTEzLjkxNyA5NC4yODIsMTEzLjkxNyBMOTQuMjgyLDExMy45MTcgWiBNOTQuNTE1LDYyLjk0OCBMOTQuNTE1LDExMy4yNzkgTDEyMS40MDYsOTcuNzU0IEwxMjcuODQsNzYuMjE1IEMxMjguMjksNzQuNzA4IDEyOS4xMzcsNzMuMjQ3IDEzMC4yMjQsNzIuMTAzIEMxMzEuNDI1LDcwLjgzOCAxMzIuNzkzLDcwLjExMiAxMzMuOTc3LDcwLjExMiBDMTM0Ljk5NSw3MC4xMTIgMTM1Ljc5NSw3MC42MzggMTM2LjIzLDcxLjU5MiBMMTQyLjU4NCw4NS41MjYgTDE2OS41NjYsNjkuOTQ4IEwxNjkuNTY2LDE5LjYxNyBMOTQuNTE1LDYyLjk0OCBMOTQuNTE1LDYyLjk0OCBaIiBpZD0iRmlsbC0xOCIgZmlsbD0iIzYwN0Q4QiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMDkuODk0LDkyLjk0MyBMMTA5Ljg5NCw5Mi45NDMgQzEwOC4xMiw5Mi45NDMgMTA2LjY1Myw5Mi4yMTggMTA1LjY1LDkwLjgyMyBDMTA1LjU4Myw5MC43MzEgMTA1LjU5Myw5MC42MSAxMDUuNjczLDkwLjUyOSBDMTA1Ljc1Myw5MC40NDggMTA1Ljg4LDkwLjQ0IDEwNS45NzQsOTAuNTA2IEMxMDYuNzU0LDkxLjA1MyAxMDcuNjc5LDkxLjMzMyAxMDguNzI0LDkxLjMzMyBDMTEwLjA0Nyw5MS4zMzMgMTExLjQ3OCw5MC44OTQgMTEyLjk4LDkwLjAyNyBDMTE4LjI5MSw4Ni45NiAxMjIuNjExLDc5LjUwOSAxMjIuNjExLDczLjQxNiBDMTIyLjYxMSw3MS40ODkgMTIyLjE2OSw2OS44NTYgMTIxLjMzMyw2OC42OTIgQzEyMS4yNjYsNjguNiAxMjEuMjc2LDY4LjQ3MyAxMjEuMzU2LDY4LjM5MiBDMTIxLjQzNiw2OC4zMTEgMTIxLjU2Myw2OC4yOTkgMTIxLjY1Niw2OC4zNjUgQzEyMy4zMjcsNjkuNTM3IDEyNC4yNDcsNzEuNzQ2IDEyNC4yNDcsNzQuNTg0IEMxMjQuMjQ3LDgwLjgyNiAxMTkuODIxLDg4LjQ0NyAxMTQuMzgyLDkxLjU4NyBDMTEyLjgwOCw5Mi40OTUgMTExLjI5OCw5Mi45NDMgMTA5Ljg5NCw5Mi45NDMgTDEwOS44OTQsOTIuOTQzIFogTTEwNi45MjUsOTEuNDAxIEMxMDcuNzM4LDkyLjA1MiAxMDguNzQ1LDkyLjI3OCAxMDkuODkzLDkyLjI3OCBMMTA5Ljg5NCw5Mi4yNzggQzExMS4yMTUsOTIuMjc4IDExMi42NDcsOTEuOTUxIDExNC4xNDgsOTEuMDg0IEMxMTkuNDU5LDg4LjAxNyAxMjMuNzgsODAuNjIxIDEyMy43OCw3NC41MjggQzEyMy43OCw3Mi41NDkgMTIzLjMxNyw3MC45MjkgMTIyLjQ1NCw2OS43NjcgQzEyMi44NjUsNzAuODAyIDEyMy4wNzksNzIuMDQyIDEyMy4wNzksNzMuNDAyIEMxMjMuMDc5LDc5LjY0NSAxMTguNjUzLDg3LjI4NSAxMTMuMjE0LDkwLjQyNSBDMTExLjY0LDkxLjMzNCAxMTAuMTMsOTEuNzQyIDEwOC43MjQsOTEuNzQyIEMxMDguMDgzLDkxLjc0MiAxMDcuNDgxLDkxLjU5MyAxMDYuOTI1LDkxLjQwMSBMMTA2LjkyNSw5MS40MDEgWiIgaWQ9IkZpbGwtMTkiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTEzLjA5Nyw5MC4yMyBDMTE4LjQ4MSw4Ny4xMjIgMTIyLjg0NSw3OS41OTQgMTIyLjg0NSw3My40MTYgQzEyMi44NDUsNzEuMzY1IDEyMi4zNjIsNjkuNzI0IDEyMS41MjIsNjguNTU2IEMxMTkuNzM4LDY3LjMwNCAxMTcuMTQ4LDY3LjM2MiAxMTQuMjY1LDY5LjAyNiBDMTA4Ljg4MSw3Mi4xMzQgMTA0LjUxNyw3OS42NjIgMTA0LjUxNyw4NS44NCBDMTA0LjUxNyw4Ny44OTEgMTA1LDg5LjUzMiAxMDUuODQsOTAuNyBDMTA3LjYyNCw5MS45NTIgMTEwLjIxNCw5MS44OTQgMTEzLjA5Nyw5MC4yMyIgaWQ9IkZpbGwtMjAiIGZpbGw9IiNGQUZBRkEiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTA4LjcyNCw5MS42MTQgTDEwOC43MjQsOTEuNjE0IEMxMDcuNTgyLDkxLjYxNCAxMDYuNTY2LDkxLjQwMSAxMDUuNzA1LDkwLjc5NyBDMTA1LjY4NCw5MC43ODMgMTA1LjY2NSw5MC44MTEgMTA1LjY1LDkwLjc5IEMxMDQuNzU2LDg5LjU0NiAxMDQuMjgzLDg3Ljg0MiAxMDQuMjgzLDg1LjgxNyBDMTA0LjI4Myw3OS41NzUgMTA4LjcwOSw3MS45NTMgMTE0LjE0OCw2OC44MTIgQzExNS43MjIsNjcuOTA0IDExNy4yMzIsNjcuNDQ5IDExOC42MzgsNjcuNDQ5IEMxMTkuNzgsNjcuNDQ5IDEyMC43OTYsNjcuNzU4IDEyMS42NTYsNjguMzYyIEMxMjEuNjc4LDY4LjM3NyAxMjEuNjk3LDY4LjM5NyAxMjEuNzEyLDY4LjQxOCBDMTIyLjYwNiw2OS42NjIgMTIzLjA3OSw3MS4zOSAxMjMuMDc5LDczLjQxNSBDMTIzLjA3OSw3OS42NTggMTE4LjY1Myw4Ny4xOTggMTEzLjIxNCw5MC4zMzggQzExMS42NCw5MS4yNDcgMTEwLjEzLDkxLjYxNCAxMDguNzI0LDkxLjYxNCBMMTA4LjcyNCw5MS42MTQgWiBNMTA2LjAwNiw5MC41MDUgQzEwNi43OCw5MS4wMzcgMTA3LjY5NCw5MS4yODEgMTA4LjcyNCw5MS4yODEgQzExMC4wNDcsOTEuMjgxIDExMS40NzgsOTAuODY4IDExMi45OCw5MC4wMDEgQzExOC4yOTEsODYuOTM1IDEyMi42MTEsNzkuNDk2IDEyMi42MTEsNzMuNDAzIEMxMjIuNjExLDcxLjQ5NCAxMjIuMTc3LDY5Ljg4IDEyMS4zNTYsNjguNzE4IEMxMjAuNTgyLDY4LjE4NSAxMTkuNjY4LDY3LjkxOSAxMTguNjM4LDY3LjkxOSBDMTE3LjMxNSw2Ny45MTkgMTE1Ljg4Myw2OC4zNiAxMTQuMzgyLDY5LjIyNyBDMTA5LjA3MSw3Mi4yOTMgMTA0Ljc1MSw3OS43MzMgMTA0Ljc1MSw4NS44MjYgQzEwNC43NTEsODcuNzM1IDEwNS4xODUsODkuMzQzIDEwNi4wMDYsOTAuNTA1IEwxMDYuMDA2LDkwLjUwNSBaIiBpZD0iRmlsbC0yMSIgZmlsbD0iIzYwN0Q4QiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNDkuMzE4LDcuMjYyIEwxMzkuMzM0LDE2LjE0IEwxNTUuMjI3LDI3LjE3MSBMMTYwLjgxNiwyMS4wNTkgTDE0OS4zMTgsNy4yNjIiIGlkPSJGaWxsLTIyIiBmaWxsPSIjRkFGQUZBIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE2OS42NzYsMTMuODQgTDE1OS45MjgsMTkuNDY3IEMxNTYuMjg2LDIxLjU3IDE1MC40LDIxLjU4IDE0Ni43ODEsMTkuNDkxIEMxNDMuMTYxLDE3LjQwMiAxNDMuMTgsMTQuMDAzIDE0Ni44MjIsMTEuOSBMMTU2LjMxNyw2LjI5MiBMMTQ5LjU4OCwyLjQwNyBMNjcuNzUyLDQ5LjQ3OCBMMTEzLjY3NSw3NS45OTIgTDExNi43NTYsNzQuMjEzIEMxMTcuMzg3LDczLjg0OCAxMTcuNjI1LDczLjMxNSAxMTcuMzc0LDcyLjgyMyBDMTE1LjAxNyw2OC4xOTEgMTE0Ljc4MSw2My4yNzcgMTE2LjY5MSw1OC41NjEgQzEyMi4zMjksNDQuNjQxIDE0MS4yLDMzLjc0NiAxNjUuMzA5LDMwLjQ5MSBDMTczLjQ3OCwyOS4zODggMTgxLjk4OSwyOS41MjQgMTkwLjAxMywzMC44ODUgQzE5MC44NjUsMzEuMDMgMTkxLjc4OSwzMC44OTMgMTkyLjQyLDMwLjUyOCBMMTk1LjUwMSwyOC43NSBMMTY5LjY3NiwxMy44NCIgaWQ9IkZpbGwtMjMiIGZpbGw9IiNGQUZBRkEiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTEzLjY3NSw3Ni40NTkgQzExMy41OTQsNzYuNDU5IDExMy41MTQsNzYuNDM4IDExMy40NDIsNzYuMzk3IEw2Ny41MTgsNDkuODgyIEM2Ny4zNzQsNDkuNzk5IDY3LjI4NCw0OS42NDUgNjcuMjg1LDQ5LjQ3OCBDNjcuMjg1LDQ5LjMxMSA2Ny4zNzQsNDkuMTU3IDY3LjUxOSw0OS4wNzMgTDE0OS4zNTUsMi4wMDIgQzE0OS40OTksMS45MTkgMTQ5LjY3NywxLjkxOSAxNDkuODIxLDIuMDAyIEwxNTYuNTUsNS44ODcgQzE1Ni43NzQsNi4wMTcgMTU2Ljg1LDYuMzAyIDE1Ni43MjIsNi41MjYgQzE1Ni41OTIsNi43NDkgMTU2LjMwNyw2LjgyNiAxNTYuMDgzLDYuNjk2IEwxNDkuNTg3LDIuOTQ2IEw2OC42ODcsNDkuNDc5IEwxMTMuNjc1LDc1LjQ1MiBMMTE2LjUyMyw3My44MDggQzExNi43MTUsNzMuNjk3IDExNy4xNDMsNzMuMzk5IDExNi45NTgsNzMuMDM1IEMxMTQuNTQyLDY4LjI4NyAxMTQuMyw2My4yMjEgMTE2LjI1OCw1OC4zODUgQzExOS4wNjQsNTEuNDU4IDEyNS4xNDMsNDUuMTQzIDEzMy44NCw0MC4xMjIgQzE0Mi40OTcsMzUuMTI0IDE1My4zNTgsMzEuNjMzIDE2NS4yNDcsMzAuMDI4IEMxNzMuNDQ1LDI4LjkyMSAxODIuMDM3LDI5LjA1OCAxOTAuMDkxLDMwLjQyNSBDMTkwLjgzLDMwLjU1IDE5MS42NTIsMzAuNDMyIDE5Mi4xODYsMzAuMTI0IEwxOTQuNTY3LDI4Ljc1IEwxNjkuNDQyLDE0LjI0NCBDMTY5LjIxOSwxNC4xMTUgMTY5LjE0MiwxMy44MjkgMTY5LjI3MSwxMy42MDYgQzE2OS40LDEzLjM4MiAxNjkuNjg1LDEzLjMwNiAxNjkuOTA5LDEzLjQzNSBMMTk1LjczNCwyOC4zNDUgQzE5NS44NzksMjguNDI4IDE5NS45NjgsMjguNTgzIDE5NS45NjgsMjguNzUgQzE5NS45NjgsMjguOTE2IDE5NS44NzksMjkuMDcxIDE5NS43MzQsMjkuMTU0IEwxOTIuNjUzLDMwLjkzMyBDMTkxLjkzMiwzMS4zNSAxOTAuODksMzEuNTA4IDE4OS45MzUsMzEuMzQ2IEMxODEuOTcyLDI5Ljk5NSAxNzMuNDc4LDI5Ljg2IDE2NS4zNzIsMzAuOTU0IEMxNTMuNjAyLDMyLjU0MyAxNDIuODYsMzUuOTkzIDEzNC4zMDcsNDAuOTMxIEMxMjUuNzkzLDQ1Ljg0NyAxMTkuODUxLDUyLjAwNCAxMTcuMTI0LDU4LjczNiBDMTE1LjI3LDYzLjMxNCAxMTUuNTAxLDY4LjExMiAxMTcuNzksNzIuNjExIEMxMTguMTYsNzMuMzM2IDExNy44NDUsNzQuMTI0IDExNi45OSw3NC42MTcgTDExMy45MDksNzYuMzk3IEMxMTMuODM2LDc2LjQzOCAxMTMuNzU2LDc2LjQ1OSAxMTMuNjc1LDc2LjQ1OSIgaWQ9IkZpbGwtMjQiIGZpbGw9IiM0NTVBNjQiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTUzLjMxNiwyMS4yNzkgQzE1MC45MDMsMjEuMjc5IDE0OC40OTUsMjAuNzUxIDE0Ni42NjQsMTkuNjkzIEMxNDQuODQ2LDE4LjY0NCAxNDMuODQ0LDE3LjIzMiAxNDMuODQ0LDE1LjcxOCBDMTQzLjg0NCwxNC4xOTEgMTQ0Ljg2LDEyLjc2MyAxNDYuNzA1LDExLjY5OCBMMTU2LjE5OCw2LjA5MSBDMTU2LjMwOSw2LjAyNSAxNTYuNDUyLDYuMDYyIDE1Ni41MTgsNi4xNzMgQzE1Ni41ODMsNi4yODQgMTU2LjU0Nyw2LjQyNyAxNTYuNDM2LDYuNDkzIEwxNDYuOTQsMTIuMTAyIEMxNDUuMjQ0LDEzLjA4MSAxNDQuMzEyLDE0LjM2NSAxNDQuMzEyLDE1LjcxOCBDMTQ0LjMxMiwxNy4wNTggMTQ1LjIzLDE4LjMyNiAxNDYuODk3LDE5LjI4OSBDMTUwLjQ0NiwyMS4zMzggMTU2LjI0LDIxLjMyNyAxNTkuODExLDE5LjI2NSBMMTY5LjU1OSwxMy42MzcgQzE2OS42NywxMy41NzMgMTY5LjgxMywxMy42MTEgMTY5Ljg3OCwxMy43MjMgQzE2OS45NDMsMTMuODM0IDE2OS45MDQsMTMuOTc3IDE2OS43OTMsMTQuMDQyIEwxNjAuMDQ1LDE5LjY3IEMxNTguMTg3LDIwLjc0MiAxNTUuNzQ5LDIxLjI3OSAxNTMuMzE2LDIxLjI3OSIgaWQ9IkZpbGwtMjUiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTEzLjY3NSw3NS45OTIgTDY3Ljc2Miw0OS40ODQiIGlkPSJGaWxsLTI2IiBmaWxsPSIjNDU1QTY0Ij48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTExMy42NzUsNzYuMzQyIEMxMTMuNjE1LDc2LjM0MiAxMTMuNTU1LDc2LjMyNyAxMTMuNSw3Ni4yOTUgTDY3LjU4Nyw0OS43ODcgQzY3LjQxOSw0OS42OSA2Ny4zNjIsNDkuNDc2IDY3LjQ1OSw0OS4zMDkgQzY3LjU1Niw0OS4xNDEgNjcuNzcsNDkuMDgzIDY3LjkzNyw0OS4xOCBMMTEzLjg1LDc1LjY4OCBDMTE0LjAxOCw3NS43ODUgMTE0LjA3NSw3NiAxMTMuOTc4LDc2LjE2NyBDMTEzLjkxNCw3Ni4yNzkgMTEzLjc5Niw3Ni4zNDIgMTEzLjY3NSw3Ni4zNDIiIGlkPSJGaWxsLTI3IiBmaWxsPSIjNDU1QTY0Ij48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTY3Ljc2Miw0OS40ODQgTDY3Ljc2MiwxMDMuNDg1IEM2Ny43NjIsMTA0LjU3NSA2OC41MzIsMTA1LjkwMyA2OS40ODIsMTA2LjQ1MiBMMTExLjk1NSwxMzAuOTczIEMxMTIuOTA1LDEzMS41MjIgMTEzLjY3NSwxMzEuMDgzIDExMy42NzUsMTI5Ljk5MyBMMTEzLjY3NSw3NS45OTIiIGlkPSJGaWxsLTI4IiBmaWxsPSIjRkFGQUZBIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTExMi43MjcsMTMxLjU2MSBDMTEyLjQzLDEzMS41NjEgMTEyLjEwNywxMzEuNDY2IDExMS43OCwxMzEuMjc2IEw2OS4zMDcsMTA2Ljc1NSBDNjguMjQ0LDEwNi4xNDIgNjcuNDEyLDEwNC43MDUgNjcuNDEyLDEwMy40ODUgTDY3LjQxMiw0OS40ODQgQzY3LjQxMiw0OS4yOSA2Ny41NjksNDkuMTM0IDY3Ljc2Miw0OS4xMzQgQzY3Ljk1Niw0OS4xMzQgNjguMTEzLDQ5LjI5IDY4LjExMyw0OS40ODQgTDY4LjExMywxMDMuNDg1IEM2OC4xMTMsMTA0LjQ0NSA2OC44MiwxMDUuNjY1IDY5LjY1NywxMDYuMTQ4IEwxMTIuMTMsMTMwLjY3IEMxMTIuNDc0LDEzMC44NjggMTEyLjc5MSwxMzAuOTEzIDExMywxMzAuNzkyIEMxMTMuMjA2LDEzMC42NzMgMTEzLjMyNSwxMzAuMzgxIDExMy4zMjUsMTI5Ljk5MyBMMTEzLjMyNSw3NS45OTIgQzExMy4zMjUsNzUuNzk4IDExMy40ODIsNzUuNjQxIDExMy42NzUsNzUuNjQxIEMxMTMuODY5LDc1LjY0MSAxMTQuMDI1LDc1Ljc5OCAxMTQuMDI1LDc1Ljk5MiBMMTE0LjAyNSwxMjkuOTkzIEMxMTQuMDI1LDEzMC42NDggMTEzLjc4NiwxMzEuMTQ3IDExMy4zNSwxMzEuMzk5IEMxMTMuMTYyLDEzMS41MDcgMTEyLjk1MiwxMzEuNTYxIDExMi43MjcsMTMxLjU2MSIgaWQ9IkZpbGwtMjkiIGZpbGw9IiM0NTVBNjQiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTEyLjg2LDQwLjUxMiBDMTEyLjg2LDQwLjUxMiAxMTIuODYsNDAuNTEyIDExMi44NTksNDAuNTEyIEMxMTAuNTQxLDQwLjUxMiAxMDguMzYsMzkuOTkgMTA2LjcxNywzOS4wNDEgQzEwNS4wMTIsMzguMDU3IDEwNC4wNzQsMzYuNzI2IDEwNC4wNzQsMzUuMjkyIEMxMDQuMDc0LDMzLjg0NyAxMDUuMDI2LDMyLjUwMSAxMDYuNzU0LDMxLjUwNCBMMTE4Ljc5NSwyNC41NTEgQzEyMC40NjMsMjMuNTg5IDEyMi42NjksMjMuMDU4IDEyNS4wMDcsMjMuMDU4IEMxMjcuMzI1LDIzLjA1OCAxMjkuNTA2LDIzLjU4MSAxMzEuMTUsMjQuNTMgQzEzMi44NTQsMjUuNTE0IDEzMy43OTMsMjYuODQ1IDEzMy43OTMsMjguMjc4IEMxMzMuNzkzLDI5LjcyNCAxMzIuODQxLDMxLjA2OSAxMzEuMTEzLDMyLjA2NyBMMTE5LjA3MSwzOS4wMTkgQzExNy40MDMsMzkuOTgyIDExNS4xOTcsNDAuNTEyIDExMi44Niw0MC41MTIgTDExMi44Niw0MC41MTIgWiBNMTI1LjAwNywyMy43NTkgQzEyMi43OSwyMy43NTkgMTIwLjcwOSwyNC4yNTYgMTE5LjE0NiwyNS4xNTggTDEwNy4xMDQsMzIuMTEgQzEwNS42MDIsMzIuOTc4IDEwNC43NzQsMzQuMTA4IDEwNC43NzQsMzUuMjkyIEMxMDQuNzc0LDM2LjQ2NSAxMDUuNTg5LDM3LjU4MSAxMDcuMDY3LDM4LjQzNCBDMTA4LjYwNSwzOS4zMjMgMTEwLjY2MywzOS44MTIgMTEyLjg1OSwzOS44MTIgTDExMi44NiwzOS44MTIgQzExNS4wNzYsMzkuODEyIDExNy4xNTgsMzkuMzE1IDExOC43MjEsMzguNDEzIEwxMzAuNzYyLDMxLjQ2IEMxMzIuMjY0LDMwLjU5MyAxMzMuMDkyLDI5LjQ2MyAxMzMuMDkyLDI4LjI3OCBDMTMzLjA5MiwyNy4xMDYgMTMyLjI3OCwyNS45OSAxMzAuOCwyNS4xMzYgQzEyOS4yNjEsMjQuMjQ4IDEyNy4yMDQsMjMuNzU5IDEyNS4wMDcsMjMuNzU5IEwxMjUuMDA3LDIzLjc1OSBaIiBpZD0iRmlsbC0zMCIgZmlsbD0iIzYwN0Q4QiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNjUuNjMsMTYuMjE5IEwxNTkuODk2LDE5LjUzIEMxNTYuNzI5LDIxLjM1OCAxNTEuNjEsMjEuMzY3IDE0OC40NjMsMTkuNTUgQzE0NS4zMTYsMTcuNzMzIDE0NS4zMzIsMTQuNzc4IDE0OC40OTksMTIuOTQ5IEwxNTQuMjMzLDkuNjM5IEwxNjUuNjMsMTYuMjE5IiBpZD0iRmlsbC0zMSIgZmlsbD0iI0ZBRkFGQSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNTQuMjMzLDEwLjQ0OCBMMTY0LjIyOCwxNi4yMTkgTDE1OS41NDYsMTguOTIzIEMxNTguMTEyLDE5Ljc1IDE1Ni4xOTQsMjAuMjA2IDE1NC4xNDcsMjAuMjA2IEMxNTIuMTE4LDIwLjIwNiAxNTAuMjI0LDE5Ljc1NyAxNDguODE0LDE4Ljk0MyBDMTQ3LjUyNCwxOC4xOTkgMTQ2LjgxNCwxNy4yNDkgMTQ2LjgxNCwxNi4yNjkgQzE0Ni44MTQsMTUuMjc4IDE0Ny41MzcsMTQuMzE0IDE0OC44NSwxMy41NTYgTDE1NC4yMzMsMTAuNDQ4IE0xNTQuMjMzLDkuNjM5IEwxNDguNDk5LDEyLjk0OSBDMTQ1LjMzMiwxNC43NzggMTQ1LjMxNiwxNy43MzMgMTQ4LjQ2MywxOS41NSBDMTUwLjAzMSwyMC40NTUgMTUyLjA4NiwyMC45MDcgMTU0LjE0NywyMC45MDcgQzE1Ni4yMjQsMjAuOTA3IDE1OC4zMDYsMjAuNDQ3IDE1OS44OTYsMTkuNTMgTDE2NS42MywxNi4yMTkgTDE1NC4yMzMsOS42MzkiIGlkPSJGaWxsLTMyIiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE0NS40NDUsNzIuNjY3IEwxNDUuNDQ1LDcyLjY2NyBDMTQzLjY3Miw3Mi42NjcgMTQyLjIwNCw3MS44MTcgMTQxLjIwMiw3MC40MjIgQzE0MS4xMzUsNzAuMzMgMTQxLjE0NSw3MC4xNDcgMTQxLjIyNSw3MC4wNjYgQzE0MS4zMDUsNjkuOTg1IDE0MS40MzIsNjkuOTQ2IDE0MS41MjUsNzAuMDExIEMxNDIuMzA2LDcwLjU1OSAxNDMuMjMxLDcwLjgyMyAxNDQuMjc2LDcwLjgyMiBDMTQ1LjU5OCw3MC44MjIgMTQ3LjAzLDcwLjM3NiAxNDguNTMyLDY5LjUwOSBDMTUzLjg0Miw2Ni40NDMgMTU4LjE2Myw1OC45ODcgMTU4LjE2Myw1Mi44OTQgQzE1OC4xNjMsNTAuOTY3IDE1Ny43MjEsNDkuMzMyIDE1Ni44ODQsNDguMTY4IEMxNTYuODE4LDQ4LjA3NiAxNTYuODI4LDQ3Ljk0OCAxNTYuOTA4LDQ3Ljg2NyBDMTU2Ljk4OCw0Ny43ODYgMTU3LjExNCw0Ny43NzQgMTU3LjIwOCw0Ny44NCBDMTU4Ljg3OCw0OS4wMTIgMTU5Ljc5OCw1MS4yMiAxNTkuNzk4LDU0LjA1OSBDMTU5Ljc5OCw2MC4zMDEgMTU1LjM3Myw2OC4wNDYgMTQ5LjkzMyw3MS4xODYgQzE0OC4zNiw3Mi4wOTQgMTQ2Ljg1LDcyLjY2NyAxNDUuNDQ1LDcyLjY2NyBMMTQ1LjQ0NSw3Mi42NjcgWiBNMTQyLjQ3Niw3MSBDMTQzLjI5LDcxLjY1MSAxNDQuMjk2LDcyLjAwMiAxNDUuNDQ1LDcyLjAwMiBDMTQ2Ljc2Nyw3Mi4wMDIgMTQ4LjE5OCw3MS41NSAxNDkuNyw3MC42ODIgQzE1NS4wMSw2Ny42MTcgMTU5LjMzMSw2MC4xNTkgMTU5LjMzMSw1NC4wNjUgQzE1OS4zMzEsNTIuMDg1IDE1OC44NjgsNTAuNDM1IDE1OC4wMDYsNDkuMjcyIEMxNTguNDE3LDUwLjMwNyAxNTguNjMsNTEuNTMyIDE1OC42Myw1Mi44OTIgQzE1OC42Myw1OS4xMzQgMTU0LjIwNSw2Ni43NjcgMTQ4Ljc2NSw2OS45MDcgQzE0Ny4xOTIsNzAuODE2IDE0NS42ODEsNzEuMjgzIDE0NC4yNzYsNzEuMjgzIEMxNDMuNjM0LDcxLjI4MyAxNDMuMDMzLDcxLjE5MiAxNDIuNDc2LDcxIEwxNDIuNDc2LDcxIFoiIGlkPSJGaWxsLTMzIiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE0OC42NDgsNjkuNzA0IEMxNTQuMDMyLDY2LjU5NiAxNTguMzk2LDU5LjA2OCAxNTguMzk2LDUyLjg5MSBDMTU4LjM5Niw1MC44MzkgMTU3LjkxMyw0OS4xOTggMTU3LjA3NCw0OC4wMyBDMTU1LjI4OSw0Ni43NzggMTUyLjY5OSw0Ni44MzYgMTQ5LjgxNiw0OC41MDEgQzE0NC40MzMsNTEuNjA5IDE0MC4wNjgsNTkuMTM3IDE0MC4wNjgsNjUuMzE0IEMxNDAuMDY4LDY3LjM2NSAxNDAuNTUyLDY5LjAwNiAxNDEuMzkxLDcwLjE3NCBDMTQzLjE3Niw3MS40MjcgMTQ1Ljc2NSw3MS4zNjkgMTQ4LjY0OCw2OS43MDQiIGlkPSJGaWxsLTM0IiBmaWxsPSIjRkFGQUZBIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE0NC4yNzYsNzEuMjc2IEwxNDQuMjc2LDcxLjI3NiBDMTQzLjEzMyw3MS4yNzYgMTQyLjExOCw3MC45NjkgMTQxLjI1Nyw3MC4zNjUgQzE0MS4yMzYsNzAuMzUxIDE0MS4yMTcsNzAuMzMyIDE0MS4yMDIsNzAuMzExIEMxNDAuMzA3LDY5LjA2NyAxMzkuODM1LDY3LjMzOSAxMzkuODM1LDY1LjMxNCBDMTM5LjgzNSw1OS4wNzMgMTQ0LjI2LDUxLjQzOSAxNDkuNyw0OC4yOTggQzE1MS4yNzMsNDcuMzkgMTUyLjc4NCw0Ni45MjkgMTU0LjE4OSw0Ni45MjkgQzE1NS4zMzIsNDYuOTI5IDE1Ni4zNDcsNDcuMjM2IDE1Ny4yMDgsNDcuODM5IEMxNTcuMjI5LDQ3Ljg1NCAxNTcuMjQ4LDQ3Ljg3MyAxNTcuMjYzLDQ3Ljg5NCBDMTU4LjE1Nyw0OS4xMzggMTU4LjYzLDUwLjg2NSAxNTguNjMsNTIuODkxIEMxNTguNjMsNTkuMTMyIDE1NC4yMDUsNjYuNzY2IDE0OC43NjUsNjkuOTA3IEMxNDcuMTkyLDcwLjgxNSAxNDUuNjgxLDcxLjI3NiAxNDQuMjc2LDcxLjI3NiBMMTQ0LjI3Niw3MS4yNzYgWiBNMTQxLjU1OCw3MC4xMDQgQzE0Mi4zMzEsNzAuNjM3IDE0My4yNDUsNzEuMDA1IDE0NC4yNzYsNzEuMDA1IEMxNDUuNTk4LDcxLjAwNSAxNDcuMDMsNzAuNDY3IDE0OC41MzIsNjkuNiBDMTUzLjg0Miw2Ni41MzQgMTU4LjE2Myw1OS4wMzMgMTU4LjE2Myw1Mi45MzkgQzE1OC4xNjMsNTEuMDMxIDE1Ny43MjksNDkuMzg1IDE1Ni45MDcsNDguMjIzIEMxNTYuMTMzLDQ3LjY5MSAxNTUuMjE5LDQ3LjQwOSAxNTQuMTg5LDQ3LjQwOSBDMTUyLjg2Nyw0Ny40MDkgMTUxLjQzNSw0Ny44NDIgMTQ5LjkzMyw0OC43MDkgQzE0NC42MjMsNTEuNzc1IDE0MC4zMDIsNTkuMjczIDE0MC4zMDIsNjUuMzY2IEMxNDAuMzAyLDY3LjI3NiAxNDAuNzM2LDY4Ljk0MiAxNDEuNTU4LDcwLjEwNCBMMTQxLjU1OCw3MC4xMDQgWiIgaWQ9IkZpbGwtMzUiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTUwLjcyLDY1LjM2MSBMMTUwLjM1Nyw2NS4wNjYgQzE1MS4xNDcsNjQuMDkyIDE1MS44NjksNjMuMDQgMTUyLjUwNSw2MS45MzggQzE1My4zMTMsNjAuNTM5IDE1My45NzgsNTkuMDY3IDE1NC40ODIsNTcuNTYzIEwxNTQuOTI1LDU3LjcxMiBDMTU0LjQxMiw1OS4yNDUgMTUzLjczMyw2MC43NDUgMTUyLjkxLDYyLjE3MiBDMTUyLjI2Miw2My4yOTUgMTUxLjUyNSw2NC4zNjggMTUwLjcyLDY1LjM2MSIgaWQ9IkZpbGwtMzYiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTE1LjkxNyw4NC41MTQgTDExNS41NTQsODQuMjIgQzExNi4zNDQsODMuMjQ1IDExNy4wNjYsODIuMTk0IDExNy43MDIsODEuMDkyIEMxMTguNTEsNzkuNjkyIDExOS4xNzUsNzguMjIgMTE5LjY3OCw3Ni43MTcgTDEyMC4xMjEsNzYuODY1IEMxMTkuNjA4LDc4LjM5OCAxMTguOTMsNzkuODk5IDExOC4xMDYsODEuMzI2IEMxMTcuNDU4LDgyLjQ0OCAxMTYuNzIyLDgzLjUyMSAxMTUuOTE3LDg0LjUxNCIgaWQ9IkZpbGwtMzciIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTE0LDEzMC40NzYgTDExNCwxMzAuMDA4IEwxMTQsNzYuMDUyIEwxMTQsNzUuNTg0IEwxMTQsNzYuMDUyIEwxMTQsMTMwLjAwOCBMMTE0LDEzMC40NzYiIGlkPSJGaWxsLTM4IiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8ZyBpZD0iSW1wb3J0ZWQtTGF5ZXJzLUNvcHkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYyLjAwMDAwMCwgMC4wMDAwMDApIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTkuODIyLDM3LjQ3NCBDMTkuODM5LDM3LjMzOSAxOS43NDcsMzcuMTk0IDE5LjU1NSwzNy4wODIgQzE5LjIyOCwzNi44OTQgMTguNzI5LDM2Ljg3MiAxOC40NDYsMzcuMDM3IEwxMi40MzQsNDAuNTA4IEMxMi4zMDMsNDAuNTg0IDEyLjI0LDQwLjY4NiAxMi4yNDMsNDAuNzkzIEMxMi4yNDUsNDAuOTI1IDEyLjI0NSw0MS4yNTQgMTIuMjQ1LDQxLjM3MSBMMTIuMjQ1LDQxLjQxNCBMMTIuMjM4LDQxLjU0MiBDOC4xNDgsNDMuODg3IDUuNjQ3LDQ1LjMyMSA1LjY0Nyw0NS4zMjEgQzUuNjQ2LDQ1LjMyMSAzLjU3LDQ2LjM2NyAyLjg2LDUwLjUxMyBDMi44Niw1MC41MTMgMS45NDgsNTcuNDc0IDEuOTYyLDcwLjI1OCBDMS45NzcsODIuODI4IDIuNTY4LDg3LjMyOCAzLjEyOSw5MS42MDkgQzMuMzQ5LDkzLjI5MyA2LjEzLDkzLjczNCA2LjEzLDkzLjczNCBDNi40NjEsOTMuNzc0IDYuODI4LDkzLjcwNyA3LjIxLDkzLjQ4NiBMODIuNDgzLDQ5LjkzNSBDODQuMjkxLDQ4Ljg2NiA4NS4xNSw0Ni4yMTYgODUuNTM5LDQzLjY1MSBDODYuNzUyLDM1LjY2MSA4Ny4yMTQsMTAuNjczIDg1LjI2NCwzLjc3MyBDODUuMDY4LDMuMDggODQuNzU0LDIuNjkgODQuMzk2LDIuNDkxIEw4Mi4zMSwxLjcwMSBDODEuNTgzLDEuNzI5IDgwLjg5NCwyLjE2OCA4MC43NzYsMi4yMzYgQzgwLjYzNiwyLjMxNyA0MS44MDcsMjQuNTg1IDIwLjAzMiwzNy4wNzIgTDE5LjgyMiwzNy40NzQiIGlkPSJGaWxsLTEiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNODIuMzExLDEuNzAxIEw4NC4zOTYsMi40OTEgQzg0Ljc1NCwyLjY5IDg1LjA2OCwzLjA4IDg1LjI2NCwzLjc3MyBDODcuMjEzLDEwLjY3MyA4Ni43NTEsMzUuNjYgODUuNTM5LDQzLjY1MSBDODUuMTQ5LDQ2LjIxNiA4NC4yOSw0OC44NjYgODIuNDgzLDQ5LjkzNSBMNy4yMSw5My40ODYgQzYuODk3LDkzLjY2NyA2LjU5NSw5My43NDQgNi4zMTQsOTMuNzQ0IEw2LjEzMSw5My43MzMgQzYuMTMxLDkzLjczNCAzLjM0OSw5My4yOTMgMy4xMjgsOTEuNjA5IEMyLjU2OCw4Ny4zMjcgMS45NzcsODIuODI4IDEuOTYzLDcwLjI1OCBDMS45NDgsNTcuNDc0IDIuODYsNTAuNTEzIDIuODYsNTAuNTEzIEMzLjU3LDQ2LjM2NyA1LjY0Nyw0NS4zMjEgNS42NDcsNDUuMzIxIEM1LjY0Nyw0NS4zMjEgOC4xNDgsNDMuODg3IDEyLjIzOCw0MS41NDIgTDEyLjI0NSw0MS40MTQgTDEyLjI0NSw0MS4zNzEgQzEyLjI0NSw0MS4yNTQgMTIuMjQ1LDQwLjkyNSAxMi4yNDMsNDAuNzkzIEMxMi4yNCw0MC42ODYgMTIuMzAyLDQwLjU4MyAxMi40MzQsNDAuNTA4IEwxOC40NDYsMzcuMDM2IEMxOC41NzQsMzYuOTYyIDE4Ljc0NiwzNi45MjYgMTguOTI3LDM2LjkyNiBDMTkuMTQ1LDM2LjkyNiAxOS4zNzYsMzYuOTc5IDE5LjU1NCwzNy4wODIgQzE5Ljc0NywzNy4xOTQgMTkuODM5LDM3LjM0IDE5LjgyMiwzNy40NzQgTDIwLjAzMywzNy4wNzIgQzQxLjgwNiwyNC41ODUgODAuNjM2LDIuMzE4IDgwLjc3NywyLjIzNiBDODAuODk0LDIuMTY4IDgxLjU4MywxLjcyOSA4Mi4zMTEsMS43MDEgTTgyLjMxMSwwLjcwNCBMODIuMjcyLDAuNzA1IEM4MS42NTQsMC43MjggODAuOTg5LDAuOTQ5IDgwLjI5OCwxLjM2MSBMODAuMjc3LDEuMzczIEM4MC4xMjksMS40NTggNTkuNzY4LDEzLjEzNSAxOS43NTgsMzYuMDc5IEMxOS41LDM1Ljk4MSAxOS4yMTQsMzUuOTI5IDE4LjkyNywzNS45MjkgQzE4LjU2MiwzNS45MjkgMTguMjIzLDM2LjAxMyAxNy45NDcsMzYuMTczIEwxMS45MzUsMzkuNjQ0IEMxMS40OTMsMzkuODk5IDExLjIzNiw0MC4zMzQgMTEuMjQ2LDQwLjgxIEwxMS4yNDcsNDAuOTYgTDUuMTY3LDQ0LjQ0NyBDNC43OTQsNDQuNjQ2IDIuNjI1LDQ1Ljk3OCAxLjg3Nyw1MC4zNDUgTDEuODcxLDUwLjM4NCBDMS44NjIsNTAuNDU0IDAuOTUxLDU3LjU1NyAwLjk2NSw3MC4yNTkgQzAuOTc5LDgyLjg3OSAxLjU2OCw4Ny4zNzUgMi4xMzcsOTEuNzI0IEwyLjEzOSw5MS43MzkgQzIuNDQ3LDk0LjA5NCA1LjYxNCw5NC42NjIgNS45NzUsOTQuNzE5IEw2LjAwOSw5NC43MjMgQzYuMTEsOTQuNzM2IDYuMjEzLDk0Ljc0MiA2LjMxNCw5NC43NDIgQzYuNzksOTQuNzQyIDcuMjYsOTQuNjEgNy43MSw5NC4zNSBMODIuOTgzLDUwLjc5OCBDODQuNzk0LDQ5LjcyNyA4NS45ODIsNDcuMzc1IDg2LjUyNSw0My44MDEgQzg3LjcxMSwzNS45ODcgODguMjU5LDEwLjcwNSA4Ni4yMjQsMy41MDIgQzg1Ljk3MSwyLjYwOSA4NS41MiwxLjk3NSA4NC44ODEsMS42MiBMODQuNzQ5LDEuNTU4IEw4Mi42NjQsMC43NjkgQzgyLjU1MSwwLjcyNSA4Mi40MzEsMC43MDQgODIuMzExLDAuNzA0IiBpZD0iRmlsbC0yIiBmaWxsPSIjNDU1QTY0Ij48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTY2LjI2NywxMS41NjUgTDY3Ljc2MiwxMS45OTkgTDExLjQyMyw0NC4zMjUiIGlkPSJGaWxsLTMiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTIuMjAyLDkwLjU0NSBDMTIuMDI5LDkwLjU0NSAxMS44NjIsOTAuNDU1IDExLjc2OSw5MC4yOTUgQzExLjYzMiw5MC4wNTcgMTEuNzEzLDg5Ljc1MiAxMS45NTIsODkuNjE0IEwzMC4zODksNzguOTY5IEMzMC42MjgsNzguODMxIDMwLjkzMyw3OC45MTMgMzEuMDcxLDc5LjE1MiBDMzEuMjA4LDc5LjM5IDMxLjEyNyw3OS42OTYgMzAuODg4LDc5LjgzMyBMMTIuNDUxLDkwLjQ3OCBMMTIuMjAyLDkwLjU0NSIgaWQ9IkZpbGwtNCIgZmlsbD0iIzYwN0Q4QiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMy43NjQsNDIuNjU0IEwxMy42NTYsNDIuNTkyIEwxMy43MDIsNDIuNDIxIEwxOC44MzcsMzkuNDU3IEwxOS4wMDcsMzkuNTAyIEwxOC45NjIsMzkuNjczIEwxMy44MjcsNDIuNjM3IEwxMy43NjQsNDIuNjU0IiBpZD0iRmlsbC01IiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTguNTIsOTAuMzc1IEw4LjUyLDQ2LjQyMSBMOC41ODMsNDYuMzg1IEw3NS44NCw3LjU1NCBMNzUuODQsNTEuNTA4IEw3NS43NzgsNTEuNTQ0IEw4LjUyLDkwLjM3NSBMOC41Miw5MC4zNzUgWiBNOC43Nyw0Ni41NjQgTDguNzcsODkuOTQ0IEw3NS41OTEsNTEuMzY1IEw3NS41OTEsNy45ODUgTDguNzcsNDYuNTY0IEw4Ljc3LDQ2LjU2NCBaIiBpZD0iRmlsbC02IiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTI0Ljk4Niw4My4xODIgQzI0Ljc1Niw4My4zMzEgMjQuMzc0LDgzLjU2NiAyNC4xMzcsODMuNzA1IEwxMi42MzIsOTAuNDA2IEMxMi4zOTUsOTAuNTQ1IDEyLjQyNiw5MC42NTggMTIuNyw5MC42NTggTDEzLjI2NSw5MC42NTggQzEzLjU0LDkwLjY1OCAxMy45NTgsOTAuNTQ1IDE0LjE5NSw5MC40MDYgTDI1LjcsODMuNzA1IEMyNS45MzcsODMuNTY2IDI2LjEyOCw4My40NTIgMjYuMTI1LDgzLjQ0OSBDMjYuMTIyLDgzLjQ0NyAyNi4xMTksODMuMjIgMjYuMTE5LDgyLjk0NiBDMjYuMTE5LDgyLjY3MiAyNS45MzEsODIuNTY5IDI1LjcwMSw4Mi43MTkgTDI0Ljk4Niw4My4xODIiIGlkPSJGaWxsLTciIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTMuMjY2LDkwLjc4MiBMMTIuNyw5MC43ODIgQzEyLjUsOTAuNzgyIDEyLjM4NCw5MC43MjYgMTIuMzU0LDkwLjYxNiBDMTIuMzI0LDkwLjUwNiAxMi4zOTcsOTAuMzk5IDEyLjU2OSw5MC4yOTkgTDI0LjA3NCw4My41OTcgQzI0LjMxLDgzLjQ1OSAyNC42ODksODMuMjI2IDI0LjkxOCw4My4wNzggTDI1LjYzMyw4Mi42MTQgQzI1LjcyMyw4Mi41NTUgMjUuODEzLDgyLjUyNSAyNS44OTksODIuNTI1IEMyNi4wNzEsODIuNTI1IDI2LjI0NCw4Mi42NTUgMjYuMjQ0LDgyLjk0NiBDMjYuMjQ0LDgzLjE2IDI2LjI0NSw4My4zMDkgMjYuMjQ3LDgzLjM4MyBMMjYuMjUzLDgzLjM4NyBMMjYuMjQ5LDgzLjQ1NiBDMjYuMjQ2LDgzLjUzMSAyNi4yNDYsODMuNTMxIDI1Ljc2Myw4My44MTIgTDE0LjI1OCw5MC41MTQgQzE0LDkwLjY2NSAxMy41NjQsOTAuNzgyIDEzLjI2Niw5MC43ODIgTDEzLjI2Niw5MC43ODIgWiBNMTIuNjY2LDkwLjUzMiBMMTIuNyw5MC41MzMgTDEzLjI2Niw5MC41MzMgQzEzLjUxOCw5MC41MzMgMTMuOTE1LDkwLjQyNSAxNC4xMzIsOTAuMjk5IEwyNS42MzcsODMuNTk3IEMyNS44MDUsODMuNDk5IDI1LjkzMSw4My40MjQgMjUuOTk4LDgzLjM4MyBDMjUuOTk0LDgzLjI5OSAyNS45OTQsODMuMTY1IDI1Ljk5NCw4Mi45NDYgTDI1Ljg5OSw4Mi43NzUgTDI1Ljc2OCw4Mi44MjQgTDI1LjA1NCw4My4yODcgQzI0LjgyMiw4My40MzcgMjQuNDM4LDgzLjY3MyAyNC4yLDgzLjgxMiBMMTIuNjk1LDkwLjUxNCBMMTIuNjY2LDkwLjUzMiBMMTIuNjY2LDkwLjUzMiBaIiBpZD0iRmlsbC04IiBmaWxsPSIjNjA3RDhCIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEzLjI2Niw4OS44NzEgTDEyLjcsODkuODcxIEMxMi41LDg5Ljg3MSAxMi4zODQsODkuODE1IDEyLjM1NCw4OS43MDUgQzEyLjMyNCw4OS41OTUgMTIuMzk3LDg5LjQ4OCAxMi41NjksODkuMzg4IEwyNC4wNzQsODIuNjg2IEMyNC4zMzIsODIuNTM1IDI0Ljc2OCw4Mi40MTggMjUuMDY3LDgyLjQxOCBMMjUuNjMyLDgyLjQxOCBDMjUuODMyLDgyLjQxOCAyNS45NDgsODIuNDc0IDI1Ljk3OCw4Mi41ODQgQzI2LjAwOCw4Mi42OTQgMjUuOTM1LDgyLjgwMSAyNS43NjMsODIuOTAxIEwxNC4yNTgsODkuNjAzIEMxNCw4OS43NTQgMTMuNTY0LDg5Ljg3MSAxMy4yNjYsODkuODcxIEwxMy4yNjYsODkuODcxIFogTTEyLjY2Niw4OS42MjEgTDEyLjcsODkuNjIyIEwxMy4yNjYsODkuNjIyIEMxMy41MTgsODkuNjIyIDEzLjkxNSw4OS41MTUgMTQuMTMyLDg5LjM4OCBMMjUuNjM3LDgyLjY4NiBMMjUuNjY3LDgyLjY2OCBMMjUuNjMyLDgyLjY2NyBMMjUuMDY3LDgyLjY2NyBDMjQuODE1LDgyLjY2NyAyNC40MTgsODIuNzc1IDI0LjIsODIuOTAxIEwxMi42OTUsODkuNjAzIEwxMi42NjYsODkuNjIxIEwxMi42NjYsODkuNjIxIFoiIGlkPSJGaWxsLTkiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTIuMzcsOTAuODAxIEwxMi4zNyw4OS41NTQgTDEyLjM3LDkwLjgwMSIgaWQ9IkZpbGwtMTAiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNi4xMyw5My45MDEgQzUuMzc5LDkzLjgwOCA0LjgxNiw5My4xNjQgNC42OTEsOTIuNTI1IEMzLjg2LDg4LjI4NyAzLjU0LDgzLjc0MyAzLjUyNiw3MS4xNzMgQzMuNTExLDU4LjM4OSA0LjQyMyw1MS40MjggNC40MjMsNTEuNDI4IEM1LjEzNCw0Ny4yODIgNy4yMSw0Ni4yMzYgNy4yMSw0Ni4yMzYgQzcuMjEsNDYuMjM2IDgxLjY2NywzLjI1IDgyLjA2OSwzLjAxNyBDODIuMjkyLDIuODg4IDg0LjU1NiwxLjQzMyA4NS4yNjQsMy45NCBDODcuMjE0LDEwLjg0IDg2Ljc1MiwzNS44MjcgODUuNTM5LDQzLjgxOCBDODUuMTUsNDYuMzgzIDg0LjI5MSw0OS4wMzMgODIuNDgzLDUwLjEwMSBMNy4yMSw5My42NTMgQzYuODI4LDkzLjg3NCA2LjQ2MSw5My45NDEgNi4xMyw5My45MDEgQzYuMTMsOTMuOTAxIDMuMzQ5LDkzLjQ2IDMuMTI5LDkxLjc3NiBDMi41NjgsODcuNDk1IDEuOTc3LDgyLjk5NSAxLjk2Miw3MC40MjUgQzEuOTQ4LDU3LjY0MSAyLjg2LDUwLjY4IDIuODYsNTAuNjggQzMuNTcsNDYuNTM0IDUuNjQ3LDQ1LjQ4OSA1LjY0Nyw0NS40ODkgQzUuNjQ2LDQ1LjQ4OSA4LjA2NSw0NC4wOTIgMTIuMjQ1LDQxLjY3OSBMMTMuMTE2LDQxLjU2IEwxOS43MTUsMzcuNzMgTDE5Ljc2MSwzNy4yNjkgTDYuMTMsOTMuOTAxIiBpZD0iRmlsbC0xMSIgZmlsbD0iI0ZBRkFGQSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik02LjMxNyw5NC4xNjEgTDYuMTAyLDk0LjE0OCBMNi4xMDEsOTQuMTQ4IEw1Ljg1Nyw5NC4xMDEgQzUuMTM4LDkzLjk0NSAzLjA4NSw5My4zNjUgMi44ODEsOTEuODA5IEMyLjMxMyw4Ny40NjkgMS43MjcsODIuOTk2IDEuNzEzLDcwLjQyNSBDMS42OTksNTcuNzcxIDIuNjA0LDUwLjcxOCAyLjYxMyw1MC42NDggQzMuMzM4LDQ2LjQxNyA1LjQ0NSw0NS4zMSA1LjUzNSw0NS4yNjYgTDEyLjE2Myw0MS40MzkgTDEzLjAzMyw0MS4zMiBMMTkuNDc5LDM3LjU3OCBMMTkuNTEzLDM3LjI0NCBDMTkuNTI2LDM3LjEwNyAxOS42NDcsMzcuMDA4IDE5Ljc4NiwzNy4wMjEgQzE5LjkyMiwzNy4wMzQgMjAuMDIzLDM3LjE1NiAyMC4wMDksMzcuMjkzIEwxOS45NSwzNy44ODIgTDEzLjE5OCw0MS44MDEgTDEyLjMyOCw0MS45MTkgTDUuNzcyLDQ1LjcwNCBDNS43NDEsNDUuNzIgMy43ODIsNDYuNzcyIDMuMTA2LDUwLjcyMiBDMy4wOTksNTAuNzgyIDIuMTk4LDU3LjgwOCAyLjIxMiw3MC40MjQgQzIuMjI2LDgyLjk2MyAyLjgwOSw4Ny40MiAzLjM3Myw5MS43MjkgQzMuNDY0LDkyLjQyIDQuMDYyLDkyLjg4MyA0LjY4Miw5My4xODEgQzQuNTY2LDkyLjk4NCA0LjQ4Niw5Mi43NzYgNC40NDYsOTIuNTcyIEMzLjY2NSw4OC41ODggMy4yOTEsODQuMzcgMy4yNzYsNzEuMTczIEMzLjI2Miw1OC41MiA0LjE2Nyw1MS40NjYgNC4xNzYsNTEuMzk2IEM0LjkwMSw0Ny4xNjUgNy4wMDgsNDYuMDU5IDcuMDk4LDQ2LjAxNCBDNy4wOTQsNDYuMDE1IDgxLjU0MiwzLjAzNCA4MS45NDQsMi44MDIgTDgxLjk3MiwyLjc4NSBDODIuODc2LDIuMjQ3IDgzLjY5MiwyLjA5NyA4NC4zMzIsMi4zNTIgQzg0Ljg4NywyLjU3MyA4NS4yODEsMy4wODUgODUuNTA0LDMuODcyIEM4Ny41MTgsMTEgODYuOTY0LDM2LjA5MSA4NS43ODUsNDMuODU1IEM4NS4yNzgsNDcuMTk2IDg0LjIxLDQ5LjM3IDgyLjYxLDUwLjMxNyBMNy4zMzUsOTMuODY5IEM2Ljk5OSw5NC4wNjMgNi42NTgsOTQuMTYxIDYuMzE3LDk0LjE2MSBMNi4zMTcsOTQuMTYxIFogTTYuMTcsOTMuNjU0IEM2LjQ2Myw5My42OSA2Ljc3NCw5My42MTcgNy4wODUsOTMuNDM3IEw4Mi4zNTgsNDkuODg2IEM4NC4xODEsNDguODA4IDg0Ljk2LDQ1Ljk3MSA4NS4yOTIsNDMuNzggQzg2LjQ2NiwzNi4wNDkgODcuMDIzLDExLjA4NSA4NS4wMjQsNC4wMDggQzg0Ljg0NiwzLjM3NyA4NC41NTEsMi45NzYgODQuMTQ4LDIuODE2IEM4My42NjQsMi42MjMgODIuOTgyLDIuNzY0IDgyLjIyNywzLjIxMyBMODIuMTkzLDMuMjM0IEM4MS43OTEsMy40NjYgNy4zMzUsNDYuNDUyIDcuMzM1LDQ2LjQ1MiBDNy4zMDQsNDYuNDY5IDUuMzQ2LDQ3LjUyMSA0LjY2OSw1MS40NzEgQzQuNjYyLDUxLjUzIDMuNzYxLDU4LjU1NiAzLjc3NSw3MS4xNzMgQzMuNzksODQuMzI4IDQuMTYxLDg4LjUyNCA0LjkzNiw5Mi40NzYgQzUuMDI2LDkyLjkzNyA1LjQxMiw5My40NTkgNS45NzMsOTMuNjE1IEM2LjA4Nyw5My42NCA2LjE1OCw5My42NTIgNi4xNjksOTMuNjU0IEw2LjE3LDkzLjY1NCBMNi4xNyw5My42NTQgWiIgaWQ9IkZpbGwtMTIiIGZpbGw9IiM0NTVBNjQiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNy4zMTcsNjguOTgyIEM3LjgwNiw2OC43MDEgOC4yMDIsNjguOTI2IDguMjAyLDY5LjQ4NyBDOC4yMDIsNzAuMDQ3IDcuODA2LDcwLjczIDcuMzE3LDcxLjAxMiBDNi44MjksNzEuMjk0IDYuNDMzLDcxLjA2OSA2LjQzMyw3MC41MDggQzYuNDMzLDY5Ljk0OCA2LjgyOSw2OS4yNjUgNy4zMTcsNjguOTgyIiBpZD0iRmlsbC0xMyIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik02LjkyLDcxLjEzMyBDNi42MzEsNzEuMTMzIDYuNDMzLDcwLjkwNSA2LjQzMyw3MC41MDggQzYuNDMzLDY5Ljk0OCA2LjgyOSw2OS4yNjUgNy4zMTcsNjguOTgyIEM3LjQ2LDY4LjkgNy41OTUsNjguODYxIDcuNzE0LDY4Ljg2MSBDOC4wMDMsNjguODYxIDguMjAyLDY5LjA5IDguMjAyLDY5LjQ4NyBDOC4yMDIsNzAuMDQ3IDcuODA2LDcwLjczIDcuMzE3LDcxLjAxMiBDNy4xNzQsNzEuMDk0IDcuMDM5LDcxLjEzMyA2LjkyLDcxLjEzMyBNNy43MTQsNjguNjc0IEM3LjU1Nyw2OC42NzQgNy4zOTIsNjguNzIzIDcuMjI0LDY4LjgyMSBDNi42NzYsNjkuMTM4IDYuMjQ2LDY5Ljg3OSA2LjI0Niw3MC41MDggQzYuMjQ2LDcwLjk5NCA2LjUxNyw3MS4zMiA2LjkyLDcxLjMyIEM3LjA3OCw3MS4zMiA3LjI0Myw3MS4yNzEgNy40MTEsNzEuMTc0IEM3Ljk1OSw3MC44NTcgOC4zODksNzAuMTE3IDguMzg5LDY5LjQ4NyBDOC4zODksNjkuMDAxIDguMTE3LDY4LjY3NCA3LjcxNCw2OC42NzQiIGlkPSJGaWxsLTE0IiBmaWxsPSIjODA5N0EyIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTYuOTIsNzAuOTQ3IEM2LjY0OSw3MC45NDcgNi42MjEsNzAuNjQgNi42MjEsNzAuNTA4IEM2LjYyMSw3MC4wMTcgNi45ODIsNjkuMzkyIDcuNDExLDY5LjE0NSBDNy41MjEsNjkuMDgyIDcuNjI1LDY5LjA0OSA3LjcxNCw2OS4wNDkgQzcuOTg2LDY5LjA0OSA4LjAxNSw2OS4zNTUgOC4wMTUsNjkuNDg3IEM4LjAxNSw2OS45NzggNy42NTIsNzAuNjAzIDcuMjI0LDcwLjg1MSBDNy4xMTUsNzAuOTE0IDcuMDEsNzAuOTQ3IDYuOTIsNzAuOTQ3IE03LjcxNCw2OC44NjEgQzcuNTk1LDY4Ljg2MSA3LjQ2LDY4LjkgNy4zMTcsNjguOTgyIEM2LjgyOSw2OS4yNjUgNi40MzMsNjkuOTQ4IDYuNDMzLDcwLjUwOCBDNi40MzMsNzAuOTA1IDYuNjMxLDcxLjEzMyA2LjkyLDcxLjEzMyBDNy4wMzksNzEuMTMzIDcuMTc0LDcxLjA5NCA3LjMxNyw3MS4wMTIgQzcuODA2LDcwLjczIDguMjAyLDcwLjA0NyA4LjIwMiw2OS40ODcgQzguMjAyLDY5LjA5IDguMDAzLDY4Ljg2MSA3LjcxNCw2OC44NjEiIGlkPSJGaWxsLTE1IiBmaWxsPSIjODA5N0EyIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTcuNDQ0LDg1LjM1IEM3LjcwOCw4NS4xOTggNy45MjEsODUuMzE5IDcuOTIxLDg1LjYyMiBDNy45MjEsODUuOTI1IDcuNzA4LDg2LjI5MiA3LjQ0NCw4Ni40NDQgQzcuMTgxLDg2LjU5NyA2Ljk2Nyw4Ni40NzUgNi45NjcsODYuMTczIEM2Ljk2Nyw4NS44NzEgNy4xODEsODUuNTAyIDcuNDQ0LDg1LjM1IiBpZD0iRmlsbC0xNiIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik03LjIzLDg2LjUxIEM3LjA3NCw4Ni41MSA2Ljk2Nyw4Ni4zODcgNi45NjcsODYuMTczIEM2Ljk2Nyw4NS44NzEgNy4xODEsODUuNTAyIDcuNDQ0LDg1LjM1IEM3LjUyMSw4NS4zMDUgNy41OTQsODUuMjg0IDcuNjU4LDg1LjI4NCBDNy44MTQsODUuMjg0IDcuOTIxLDg1LjQwOCA3LjkyMSw4NS42MjIgQzcuOTIxLDg1LjkyNSA3LjcwOCw4Ni4yOTIgNy40NDQsODYuNDQ0IEM3LjM2Nyw4Ni40ODkgNy4yOTQsODYuNTEgNy4yMyw4Ni41MSBNNy42NTgsODUuMDk4IEM3LjU1OCw4NS4wOTggNy40NTUsODUuMTI3IDcuMzUxLDg1LjE4OCBDNy4wMzEsODUuMzczIDYuNzgxLDg1LjgwNiA2Ljc4MSw4Ni4xNzMgQzYuNzgxLDg2LjQ4MiA2Ljk2Niw4Ni42OTcgNy4yMyw4Ni42OTcgQzcuMzMsODYuNjk3IDcuNDMzLDg2LjY2NiA3LjUzOCw4Ni42MDcgQzcuODU4LDg2LjQyMiA4LjEwOCw4NS45ODkgOC4xMDgsODUuNjIyIEM4LjEwOCw4NS4zMTMgNy45MjMsODUuMDk4IDcuNjU4LDg1LjA5OCIgaWQ9IkZpbGwtMTciIGZpbGw9IiM4MDk3QTIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNy4yMyw4Ni4zMjIgTDcuMTU0LDg2LjE3MyBDNy4xNTQsODUuOTM4IDcuMzMzLDg1LjYyOSA3LjUzOCw4NS41MTIgTDcuNjU4LDg1LjQ3MSBMNy43MzQsODUuNjIyIEM3LjczNCw4NS44NTYgNy41NTUsODYuMTY0IDcuMzUxLDg2LjI4MiBMNy4yMyw4Ni4zMjIgTTcuNjU4LDg1LjI4NCBDNy41OTQsODUuMjg0IDcuNTIxLDg1LjMwNSA3LjQ0NCw4NS4zNSBDNy4xODEsODUuNTAyIDYuOTY3LDg1Ljg3MSA2Ljk2Nyw4Ni4xNzMgQzYuOTY3LDg2LjM4NyA3LjA3NCw4Ni41MSA3LjIzLDg2LjUxIEM3LjI5NCw4Ni41MSA3LjM2Nyw4Ni40ODkgNy40NDQsODYuNDQ0IEM3LjcwOCw4Ni4yOTIgNy45MjEsODUuOTI1IDcuOTIxLDg1LjYyMiBDNy45MjEsODUuNDA4IDcuODE0LDg1LjI4NCA3LjY1OCw4NS4yODQiIGlkPSJGaWxsLTE4IiBmaWxsPSIjODA5N0EyIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTc3LjI3OCw3Ljc2OSBMNzcuMjc4LDUxLjQzNiBMMTAuMjA4LDkwLjE2IEwxMC4yMDgsNDYuNDkzIEw3Ny4yNzgsNy43NjkiIGlkPSJGaWxsLTE5IiBmaWxsPSIjNDU1QTY0Ij48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEwLjA4Myw5MC4zNzUgTDEwLjA4Myw0Ni40MjEgTDEwLjE0Niw0Ni4zODUgTDc3LjQwMyw3LjU1NCBMNzcuNDAzLDUxLjUwOCBMNzcuMzQxLDUxLjU0NCBMMTAuMDgzLDkwLjM3NSBMMTAuMDgzLDkwLjM3NSBaIE0xMC4zMzMsNDYuNTY0IEwxMC4zMzMsODkuOTQ0IEw3Ny4xNTQsNTEuMzY1IEw3Ny4xNTQsNy45ODUgTDEwLjMzMyw0Ni41NjQgTDEwLjMzMyw0Ni41NjQgWiIgaWQ9IkZpbGwtMjAiIGZpbGw9IiM2MDdEOEIiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMjUuNzM3LDg4LjY0NyBMMTE4LjA5OCw5MS45ODEgTDExOC4wOTgsODQgTDEwNi42MzksODguNzEzIEwxMDYuNjM5LDk2Ljk4MiBMOTksMTAwLjMxNSBMMTEyLjM2OSwxMDMuOTYxIEwxMjUuNzM3LDg4LjY0NyIgaWQ9IkltcG9ydGVkLUxheWVycy1Db3B5LTIiIGZpbGw9IiM0NTVBNjQiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');
    };
    var rotateInstructions = RotateInstructions;

    var DEFAULT_VIEWER = 'CardboardV1';
    var VIEWER_KEY = 'WEBVR_CARDBOARD_VIEWER';
    var CLASS_NAME = 'webvr-polyfill-viewer-selector';

    function ViewerSelector() {
        try {
            this.selectedKey = localStorage.getItem(VIEWER_KEY);
        } catch (error) {
            console.error('Failed to load viewer profile: %s', error);
        }
        if (!this.selectedKey) {
            this.selectedKey = DEFAULT_VIEWER;
        }
        this.dialog = this.createDialog_(deviceInfo.Viewers);
        this.root = null;
        this.onChangeCallbacks_ = [];
    }
    ViewerSelector.prototype.show = function (root) {
        this.root = root;
        root.appendChild(this.dialog);
        var selected = this.dialog.querySelector('#' + this.selectedKey);
        selected.checked = true;
        this.dialog.style.display = 'block';
    };
    ViewerSelector.prototype.hide = function () {
        if (this.root && this.root.contains(this.dialog)) {
            this.root.removeChild(this.dialog);
        }
        this.dialog.style.display = 'none';
    };
    ViewerSelector.prototype.getCurrentViewer = function () {
        return deviceInfo.Viewers[this.selectedKey];
    };
    ViewerSelector.prototype.getSelectedKey_ = function () {
        var input = this.dialog.querySelector('input[name=field]:checked');
        if (input) {
            return input.id;
        }
        return null;
    };
    ViewerSelector.prototype.onChange = function (cb) {
        this.onChangeCallbacks_.push(cb);
    };
    ViewerSelector.prototype.fireOnChange_ = function (viewer) {
        for (var i = 0; i < this.onChangeCallbacks_.length; i++) {
            this.onChangeCallbacks_[i](viewer);
        }
    };
    ViewerSelector.prototype.onSave_ = function () {
        this.selectedKey = this.getSelectedKey_();
        if (!this.selectedKey || !deviceInfo.Viewers[this.selectedKey]) {
            console.error('ViewerSelector.onSave_: this should never happen!');
            return;
        }
        this.fireOnChange_(deviceInfo.Viewers[this.selectedKey]);
        try {
            localStorage.setItem(VIEWER_KEY, this.selectedKey);
        } catch (error) {
            console.error('Failed to save viewer profile: %s', error);
        }
        this.hide();
    };
    ViewerSelector.prototype.createDialog_ = function (options) {
        var container = document.createElement('div');
        container.classList.add(CLASS_NAME);
        container.style.display = 'none';
        var overlay = document.createElement('div');
        var s = overlay.style;
        s.position = 'fixed';
        s.left = 0;
        s.top = 0;
        s.width = '100%';
        s.height = '100%';
        s.background = 'rgba(0, 0, 0, 0.3)';
        overlay.addEventListener('click', this.hide.bind(this));
        var width = 280;
        var dialog = document.createElement('div');
        var s = dialog.style;
        s.boxSizing = 'border-box';
        s.position = 'fixed';
        s.top = '24px';
        s.left = '50%';
        s.marginLeft = (-width / 2) + 'px';
        s.width = width + 'px';
        s.padding = '24px';
        s.overflow = 'hidden';
        s.background = '#fafafa';
        s.fontFamily = "'Roboto', sans-serif";
        s.boxShadow = '0px 5px 20px #666';
        dialog.appendChild(this.createH1_('Select your viewer'));
        for (var id in options) {
            dialog.appendChild(this.createChoice_(id, options[id].label));
        }
        dialog.appendChild(this.createButton_('Save', this.onSave_.bind(this)));
        container.appendChild(overlay);
        container.appendChild(dialog);
        return container;
    };
    ViewerSelector.prototype.createH1_ = function (name) {
        var h1 = document.createElement('h1');
        var s = h1.style;
        s.color = 'black';
        s.fontSize = '20px';
        s.fontWeight = 'bold';
        s.marginTop = 0;
        s.marginBottom = '24px';
        h1.innerHTML = name;
        return h1;
    };
    ViewerSelector.prototype.createChoice_ = function (id, name) {
        var div = document.createElement('div');
        div.style.marginTop = '8px';
        div.style.color = 'black';
        var input = document.createElement('input');
        input.style.fontSize = '30px';
        input.setAttribute('id', id);
        input.setAttribute('type', 'radio');
        input.setAttribute('value', id);
        input.setAttribute('name', 'field');
        var label = document.createElement('label');
        label.style.marginLeft = '4px';
        label.setAttribute('for', id);
        label.innerHTML = name;
        div.appendChild(input);
        div.appendChild(label);
        return div;
    };
    ViewerSelector.prototype.createButton_ = function (label, onclick) {
        var button = document.createElement('button');
        button.innerHTML = label;
        var s = button.style;
        s.float = 'right';
        s.textTransform = 'uppercase';
        s.color = '#1094f7';
        s.fontSize = '14px';
        s.letterSpacing = 0;
        s.border = 0;
        s.background = 'none';
        s.marginTop = '16px';
        button.addEventListener('click', onclick);
        return button;
    };
    var viewerSelector = ViewerSelector;

    function AndroidWakeLock() {
        var video = document.createElement('video');
        video.setAttribute('loop', '');

        function addSourceToVideo(element, type, dataURI) {
            var source = document.createElement('source');
            source.src = dataURI;
            source.type = 'video/' + type;
            element.appendChild(source);
        }
        addSourceToVideo(video, 'webm', util$2.base64('video/webm', 'GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA='));
        addSourceToVideo(video, 'mp4', util$2.base64('video/mp4', 'AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAG21kYXQAAAGzABAHAAABthADAowdbb9/AAAC6W1vb3YAAABsbXZoZAAAAAB8JbCAfCWwgAAAA+gAAAAAAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAIVdHJhawAAAFx0a2hkAAAAD3wlsIB8JbCAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAABsW1kaWEAAAAgbWRoZAAAAAB8JbCAfCWwgAAAA+gAAAAAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAVxtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAEcc3RibAAAALhzdHNkAAAAAAAAAAEAAACobXA0dgAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAIAAgASAAAAEgAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABj//wAAAFJlc2RzAAAAAANEAAEABDwgEQAAAAADDUAAAAAABS0AAAGwAQAAAbWJEwAAAQAAAAEgAMSNiB9FAEQBFGMAAAGyTGF2YzUyLjg3LjQGAQIAAAAYc3R0cwAAAAAAAAABAAAAAQAAAAAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAAAEwAAAAEAAAAUc3RjbwAAAAAAAAABAAAALAAAAGB1ZHRhAAAAWG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAK2lsc3QAAAAjqXRvbwAAABtkYXRhAAAAAQAAAABMYXZmNTIuNzguMw=='));
        this.request = function () {
            if (video.paused) {
                video.play();
            }
        };
        this.release = function () {
            video.pause();
        };
    }

    function iOSWakeLock() {
        var timer = null;
        this.request = function () {
            if (!timer) {
                timer = setInterval(function () {
                    window.location = window.location;
                    setTimeout(window.stop, 0);
                }, 30000);
            }
        };
        this.release = function () {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        };
    }

    function getWakeLock() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
            return iOSWakeLock;
        } else {
            return AndroidWakeLock;
        }
    }
    var wakelock = getWakeLock();

    var nextDisplayId = 1000;
    var hasShowDeprecationWarning = false;
    var defaultLeftBounds = [0, 0, 0.5, 1];
    var defaultRightBounds = [0.5, 0, 0.5, 1];

    function VRFrameData$1() {
        this.leftProjectionMatrix = new Float32Array(16);
        this.leftViewMatrix = new Float32Array(16);
        this.rightProjectionMatrix = new Float32Array(16);
        this.rightViewMatrix = new Float32Array(16);
        this.pose = null;
    }

    function VRDisplay$2() {
        this.isPolyfilled = true;
        this.displayId = nextDisplayId++;
        this.displayName = '';
        this.depthNear = 0.01;
        this.depthFar = 10000.0;
        this.isConnected = true;
        this.isPresenting = false;
        this.capabilities = {
            hasPosition: false,
            hasOrientation: false,
            hasExternalDisplay: false,
            canPresent: false,
            maxLayers: 1
        };
        this.stageParameters = null;
        this.waitingForPresent_ = false;
        this.layer_ = null;
        this.orphanedLayer = null;
        this.fullscreenElement_ = null;
        this.fullscreenWrapper_ = null;
        this.fullscreenElementCachedStyle_ = null;
        this.fullscreenEventTarget_ = null;
        this.fullscreenChangeHandler_ = null;
        this.fullscreenErrorHandler_ = null;
        this.wakelock_ = new wakelock();
    }
    VRDisplay$2.prototype.getFrameData = function (frameData) {
        return util$2.frameDataFromPose(frameData, this.getPose(), this);
    };
    VRDisplay$2.prototype.getPose = function () {
        return this.getImmediatePose();
    };
    VRDisplay$2.prototype.requestAnimationFrame = function (callback) {
        return window.requestAnimationFrame(callback);
    };
    VRDisplay$2.prototype.cancelAnimationFrame = function (id) {
        return window.cancelAnimationFrame(id);
    };
    VRDisplay$2.prototype.wrapForFullscreen = function (element) {
        if (util$2.isIOS()) {
            return element;
        }
        if (!this.fullscreenWrapper_) {
            this.fullscreenWrapper_ = document.createElement('div');
            var cssProperties = [
                // 'height: ' + Math.min(screen.height, screen.width) + 'px !important',
                'top: 0 !important',
                'left: 0 !important',
                'right: 0 !important',
                'bottom: 0 !important',
                'border: 0',
                'margin: 0',
                'padding: 0',
                'over-flow: hidden',
                'z-index: 999999 !important',
                'position: fixed'
            ];
            this.fullscreenWrapper_.setAttribute('style', cssProperties.join('; ') + ';');
            this.fullscreenWrapper_.classList.add('webvr-polyfill-fullscreen-wrapper');
        }
        if (this.fullscreenElement_ == element) {
            return this.fullscreenWrapper_;
        }
        this.removeFullscreenWrapper();
        this.fullscreenElement_ = element;
        var parent = this.fullscreenElement_.parentElement;
        parent.insertBefore(this.fullscreenWrapper_, this.fullscreenElement_);
        parent.removeChild(this.fullscreenElement_);
        this.fullscreenWrapper_.insertBefore(this.fullscreenElement_, this.fullscreenWrapper_.firstChild);
        this.fullscreenElementCachedStyle_ = this.fullscreenElement_.getAttribute('style');
        var self = this;

        function applyFullscreenElementStyle() {
            if (!self.fullscreenElement_) {
                return;
            }
            var cssProperties = [
                'position: absolute',
                'top: 0',
                'left: 0',
                'width: ' + Math.max(screen.width, screen.height) + 'px',
                'height: ' + Math.min(screen.height, screen.width) + 'px',
                'border: 0',
                'margin: 0',
                'padding: 0',
            ];
            self.fullscreenElement_.setAttribute('style', cssProperties.join('; ') + ';');
        }
        applyFullscreenElementStyle();
        return this.fullscreenWrapper_;
    };
    VRDisplay$2.prototype.removeFullscreenWrapper = function () {
        if (!this.fullscreenElement_) {
            return;
        }
        var element = this.fullscreenElement_;
        if (this.fullscreenElementCachedStyle_) {
            element.setAttribute('style', this.fullscreenElementCachedStyle_);
        } else {
            element.removeAttribute('style');
        }
        this.fullscreenElement_ = null;
        this.fullscreenElementCachedStyle_ = null;
        var parent = this.fullscreenWrapper_.parentElement;
        this.fullscreenWrapper_.removeChild(element);
        parent.insertBefore(element, this.fullscreenWrapper_);
        parent.removeChild(this.fullscreenWrapper_);
        if (this.orphanedLayer) {
            element.parentElement.removeChild(element);
        }
        return element;
    };
    VRDisplay$2.prototype.requestPresent = function (layers) {
        var wasPresenting = this.isPresenting;
        var self = this;
        if (!(layers instanceof Array)) {
            if (!hasShowDeprecationWarning) {
                console.warn("Using a deprecated form of requestPresent. Should pass in an array of VRLayers.");
                hasShowDeprecationWarning = true;
            }
            layers = [layers];
        }
        return new Promise(function (resolve, reject) {
            if (!self.capabilities.canPresent) {
                reject(new Error('VRDisplay is not capable of presenting.'));
                return;
            }
            if (layers.length == 0 || layers.length > self.capabilities.maxLayers) {
                reject(new Error('Invalid number of layers.'));
                return;
            }
            var incomingLayer = layers[0];
            if (!incomingLayer.source) {
                resolve();
                return;
            }
            var leftBounds = incomingLayer.leftBounds || defaultLeftBounds;
            var rightBounds = incomingLayer.rightBounds || defaultRightBounds;
            if (wasPresenting) {
                var layer = self.layer_;
                if (layer.source !== incomingLayer.source) {
                    layer.source = incomingLayer.source;
                }
                for (var i = 0; i < 4; i++) {
                    layer.leftBounds[i] = leftBounds[i];
                    layer.rightBounds[i] = rightBounds[i];
                }
                resolve();
                return;
            }
            self.layer_ = {
                predistorted: incomingLayer.predistorted,
                source: incomingLayer.source,
                leftBounds: leftBounds.slice(0),
                rightBounds: rightBounds.slice(0)
            };
            self.waitingForPresent_ = false;
            if (self.layer_ && self.layer_.source) {
                if (!self.layer_.source.parentElement) {
                    self.orphanedLayer = true;
                    document.body.appendChild(self.layer_.source);
                }
                var fullscreenElement = self.wrapForFullscreen(self.layer_.source);
                var onFullscreenChange = function () {
                    var actualFullscreenElement = util$2.getFullscreenElement();
                    self.isPresenting = (fullscreenElement === actualFullscreenElement);
                    if (self.isPresenting) {
                        if (screen.orientation && screen.orientation.lock) {
                            screen.orientation.lock('landscape-primary').catch(function (error) {
                                console.error('screen.orientation.lock() failed due to', error.message);
                            });
                        }
                        self.waitingForPresent_ = false;
                        self.beginPresent_();
                        resolve();
                    } else {
                        if (screen.orientation && screen.orientation.unlock) {
                            screen.orientation.unlock();
                        }
                        self.removeFullscreenWrapper();
                        self.wakelock_.release();
                        self.endPresent_();
                        self.removeFullscreenListeners_();
                    }
                    self.fireVRDisplayPresentChange_();
                };
                var onFullscreenError = function () {
                    if (!self.waitingForPresent_) {
                        return;
                    }
                    self.removeFullscreenWrapper();
                    self.removeFullscreenListeners_();
                    self.wakelock_.release();
                    self.waitingForPresent_ = false;
                    self.isPresenting = false;
                    reject(new Error('Unable to present.'));
                };
                self.addFullscreenListeners_(fullscreenElement,
                    onFullscreenChange, onFullscreenError);
                if (util$2.requestFullscreen(fullscreenElement)) {
                    self.wakelock_.request();
                    self.waitingForPresent_ = true;
                } else if (util$2.isIOS() || util$2.isWebViewAndroid()) {
                    self.wakelock_.request();
                    self.isPresenting = true;
                    self.beginPresent_();
                    self.fireVRDisplayPresentChange_();
                    resolve();
                }
            }
            if (!self.waitingForPresent_ && !util$2.isIOS()) {
                util$2.exitFullscreen();
                reject(new Error('Unable to present.'));
            }
        });
    };
    VRDisplay$2.prototype.registerFunc = function (exitFunc) {
        this.exitOuterFunc = exitFunc;
    };
    VRDisplay$2.prototype.exitPresent = function () {
        var wasPresenting = this.isPresenting;
        var self = this;
        this.isPresenting = false;
        this.layer_ = null;
        this.wakelock_.release();
        return new Promise(function (resolve, reject) {
            if (wasPresenting) {
                if (!util$2.exitFullscreen() && util$2.isIOS()) {
                    self.endPresent_();
                    self.fireVRDisplayPresentChange_();
                }
                if (util$2.isWebViewAndroid()) {
                    self.removeFullscreenWrapper();
                    self.removeFullscreenListeners_();
                    self.endPresent_();
                    self.fireVRDisplayPresentChange_();
                }
                self.exitOuterFunc && self.exitOuterFunc();
                resolve();
            } else {
                reject(new Error('Was not presenting to VRDisplay.'));
            }
        });
    };
    VRDisplay$2.prototype.getLayers = function () {
        if (this.layer_) {
            return [this.layer_];
        }
        return [];
    };
    VRDisplay$2.prototype.fireVRDisplayPresentChange_ = function () {
        var event = new CustomEvent('vrdisplaypresentchange', {
            detail: {
                display: this
            }
        });
        window.dispatchEvent(event);
    };
    VRDisplay$2.prototype.fireVRDisplayConnect_ = function () {
        var event = new CustomEvent('vrdisplayconnect', {
            detail: {
                display: this
            }
        });
        window.dispatchEvent(event);
    };
    VRDisplay$2.prototype.addFullscreenListeners_ = function (element, changeHandler, errorHandler) {
        this.removeFullscreenListeners_();
        this.fullscreenEventTarget_ = element;
        this.fullscreenChangeHandler_ = changeHandler;
        this.fullscreenErrorHandler_ = errorHandler;
        if (changeHandler) {
            if (document.fullscreenEnabled) {
                element.addEventListener('fullscreenchange', changeHandler, false);
            } else if (document.webkitFullscreenEnabled) {
                element.addEventListener('webkitfullscreenchange', changeHandler, false);
            } else if (document.mozFullScreenEnabled) {
                document.addEventListener('mozfullscreenchange', changeHandler, false);
            } else if (document.msFullscreenEnabled) {
                element.addEventListener('msfullscreenchange', changeHandler, false);
            }
        }
        if (errorHandler) {
            if (document.fullscreenEnabled) {
                element.addEventListener('fullscreenerror', errorHandler, false);
            } else if (document.webkitFullscreenEnabled) {
                element.addEventListener('webkitfullscreenerror', errorHandler, false);
            } else if (document.mozFullScreenEnabled) {
                document.addEventListener('mozfullscreenerror', errorHandler, false);
            } else if (document.msFullscreenEnabled) {
                element.addEventListener('msfullscreenerror', errorHandler, false);
            }
        }
    };
    VRDisplay$2.prototype.removeFullscreenListeners_ = function () {
        if (!this.fullscreenEventTarget_)
            return;
        var element = this.fullscreenEventTarget_;
        if (this.fullscreenChangeHandler_) {
            var changeHandler = this.fullscreenChangeHandler_;
            element.removeEventListener('fullscreenchange', changeHandler, false);
            element.removeEventListener('webkitfullscreenchange', changeHandler, false);
            document.removeEventListener('mozfullscreenchange', changeHandler, false);
            element.removeEventListener('msfullscreenchange', changeHandler, false);
        }
        if (this.fullscreenErrorHandler_) {
            var errorHandler = this.fullscreenErrorHandler_;
            element.removeEventListener('fullscreenerror', errorHandler, false);
            element.removeEventListener('webkitfullscreenerror', errorHandler, false);
            document.removeEventListener('mozfullscreenerror', errorHandler, false);
            element.removeEventListener('msfullscreenerror', errorHandler, false);
        }
        this.fullscreenEventTarget_ = null;
        this.fullscreenChangeHandler_ = null;
        this.fullscreenErrorHandler_ = null;
    };
    VRDisplay$2.prototype.beginPresent_ = function () {};
    VRDisplay$2.prototype.endPresent_ = function () {};
    VRDisplay$2.prototype.submitFrame = function (pose) {};
    VRDisplay$2.prototype.getEyeParameters = function (whichEye) {
        return null;
    };
    var VRFrameData_1 = VRFrameData$1;
    var VRDisplay_1 = VRDisplay$2;
    var base = {
        VRFrameData: VRFrameData_1,
        VRDisplay: VRDisplay_1
    };

    var options = {
        DEBUG: false,
        DPDB_URL: 'https://dpdb.webvr.rocks/dpdb.json',
        K_FILTER: 0.98,
        PREDICTION_TIME_S: 0.040,
        TOUCH_PANNER_DISABLED: true,
        CARDBOARD_UI_DISABLED: false,
        ROTATE_INSTRUCTIONS_DISABLED: false,
        YAW_ONLY: false,
        BUFFER_SCALE: 0.5,
        DIRTY_SUBMIT_FRAME_BINDINGS: false,
    };

    var VRDisplay$1 = base.VRDisplay;
    var Eye = {
        LEFT: 'left',
        RIGHT: 'right'
    };

    function CardboardVRDisplay(config) {
        var defaults = util$2.extend({}, options);
        this.config = util$2.extend(defaults, config || {});
        this.displayName = 'Cardboard VRDisplay';
        this.capabilities.hasOrientation = true;
        this.capabilities.canPresent = true;
        this.bufferScale_ = this.config.BUFFER_SCALE;
        this.poseSensor_ = new fusionPoseSensor(this.config.K_FILTER,
            this.config.PREDICTION_TIME_S,
            this.config.TOUCH_PANNER_DISABLED,
            this.config.YAW_ONLY,
            this.config.DEBUG);
        this.distorter_ = null;
        this.cardboardUI_ = null;
        this.dpdb_ = new dpdb(this.config.DPDB_URL, this.onDeviceParamsUpdated_.bind(this));
        this.deviceInfo_ = new deviceInfo(this.dpdb_.getDeviceParams());
        this.viewerSelector_ = new viewerSelector();
        this.viewerSelector_.onChange(this.onViewerChanged_.bind(this));
        this.deviceInfo_.setViewer(this.viewerSelector_.getCurrentViewer());
        if (!this.config.ROTATE_INSTRUCTIONS_DISABLED) {
            this.rotateInstructions_ = new rotateInstructions();
        }
        if (util$2.isIOS()) {
            window.addEventListener('resize', this.onResize_.bind(this));
        }
    }
    CardboardVRDisplay.prototype = new VRDisplay$1();
    CardboardVRDisplay.prototype.getImmediatePose = function () {
        return {
            position: this.poseSensor_.getPosition(),
            orientation: this.poseSensor_.getOrientation(),
            linearVelocity: null,
            linearAcceleration: null,
            angularVelocity: null,
            angularAcceleration: null
        };
    };
    CardboardVRDisplay.prototype.resetPose = function () {
        this.poseSensor_.resetPose();
    };
    CardboardVRDisplay.prototype.getEyeParameters = function (whichEye) {
        var offset = [this.deviceInfo_.viewer.interLensDistance * 0.5, 0.0, 0.0];
        var fieldOfView;
        if (whichEye == Eye.LEFT) {
            offset[0] *= -1.0;
            fieldOfView = this.deviceInfo_.getFieldOfViewLeftEye();
        } else if (whichEye == Eye.RIGHT) {
            fieldOfView = this.deviceInfo_.getFieldOfViewRightEye();
        } else {
            console.error('Invalid eye provided: %s', whichEye);
            return null;
        }
        return {
            fieldOfView: fieldOfView,
            offset: offset,
            renderWidth: this.deviceInfo_.device.width * 0.5 * this.bufferScale_,
            renderHeight: this.deviceInfo_.device.height * this.bufferScale_,
        };
    };
    CardboardVRDisplay.prototype.onDeviceParamsUpdated_ = function (newParams) {
        if (this.config.DEBUG) {
            console.log('DPDB reported that device params were updated.');
        }
        this.deviceInfo_.updateDeviceParams(newParams);
        if (this.distorter_) {
            this.distorter_.updateDeviceInfo(this.deviceInfo_);
        }
    };
    CardboardVRDisplay.prototype.updateBounds_ = function () {
        if (this.layer_ && this.distorter_ && (this.layer_.leftBounds || this.layer_.rightBounds)) {
            this.distorter_.setTextureBounds(this.layer_.leftBounds, this.layer_.rightBounds);
        }
    };
    CardboardVRDisplay.prototype.beginPresent_ = function () {
        var gl = this.layer_.source.getContext('webgl');
        if (!gl)
            gl = this.layer_.source.getContext('experimental-webgl');
        if (!gl)
            gl = this.layer_.source.getContext('webgl2');
        if (!gl)
            return;
        if (this.layer_.predistorted) {
            if (!this.config.CARDBOARD_UI_DISABLED) {
                gl.canvas.width = util$2.getScreenWidth() * this.bufferScale_;
                gl.canvas.height = util$2.getScreenHeight() * this.bufferScale_;
                this.cardboardUI_ = new cardboardUi(gl);
            }
        } else {
            if (!this.config.CARDBOARD_UI_DISABLED) {
                this.cardboardUI_ = new cardboardUi(gl);
            }
            this.distorter_ = new cardboardDistorter(gl, this.cardboardUI_,
                this.config.BUFFER_SCALE,
                this.config.DIRTY_SUBMIT_FRAME_BINDINGS);
            this.distorter_.updateDeviceInfo(this.deviceInfo_);
        }
        if (this.cardboardUI_) {
            this.cardboardUI_.listen(function (e) {
                this.viewerSelector_.show(this.layer_.source.parentElement);
                e.stopPropagation();
                e.preventDefault();
            }.bind(this), function (e) {
                // this.exitPresent();
                e.stopPropagation();
                e.preventDefault();
            }.bind(this));
        }
        if (this.rotateInstructions_) {
            if (!util$2.isLandscapeMode() && util$2.isMobile()) {
                console.log(this.layer_.source.parentElement)
                this.rotateInstructions_.showTemporarily(10000, this.layer_.source.parentElement);
            } else {
                this.rotateInstructions_.update(this.layer_.source.parentElement);
            }
        }
        this.orientationHandler = this.onOrientationChange_.bind(this);
        window.addEventListener('orientationchange', this.orientationHandler);
        this.vrdisplaypresentchangeHandler = this.updateBounds_.bind(this);
        window.addEventListener('vrdisplaypresentchange', this.vrdisplaypresentchangeHandler);
        this.fireVRDisplayDeviceParamsChange_();
    };
    CardboardVRDisplay.prototype.endPresent_ = function () {
        if (this.distorter_) {
            this.distorter_.destroy();
            this.distorter_ = null;
        }
        if (this.cardboardUI_) {
            this.cardboardUI_.destroy();
            this.cardboardUI_ = null;
        }
        if (this.rotateInstructions_) {
            this.rotateInstructions_.hide();
        }
        this.viewerSelector_.hide();
        window.removeEventListener('orientationchange', this.orientationHandler);
        window.removeEventListener('vrdisplaypresentchange', this.vrdisplaypresentchangeHandler);
    };
    CardboardVRDisplay.prototype.submitFrame = function (pose) {
        if (this.distorter_) {
            this.updateBounds_();
            this.distorter_.submitFrame();
        } else if (this.cardboardUI_ && this.layer_) {
            var canvas = this.layer_.source.getContext('webgl').canvas;
            if (canvas.width != this.lastWidth || canvas.height != this.lastHeight) {
                this.cardboardUI_.onResize();
            }
            this.lastWidth = canvas.width;
            this.lastHeight = canvas.height;
            this.cardboardUI_.render();
        }
    };
    CardboardVRDisplay.prototype.onOrientationChange_ = function (e) {
        this.viewerSelector_.hide();
        if (this.rotateInstructions_) {
            this.rotateInstructions_.update();
        }
        this.onResize_();
    };
    CardboardVRDisplay.prototype.onResize_ = function (e) {
        if (this.layer_) {
            var gl = this.layer_.source.getContext('webgl');
            var cssProperties = [
                // 'position: absolute',
                // 'top: 0',
                // 'left: 0',
                'width: 100vw',
                'height: 100vh',
                'border: 0',
                'margin: 0',
                'padding: 0px',
                'box-sizing: border-box',
            ];
            gl.canvas.setAttribute('style', cssProperties.join('; ') + ';');
            util$2.safariCssSizeWorkaround(gl.canvas);
        }
    };
    CardboardVRDisplay.prototype.onViewerChanged_ = function (viewer) {
        this.deviceInfo_.setViewer(viewer);
        if (this.distorter_) {
            this.distorter_.updateDeviceInfo(this.deviceInfo_);
        }
        this.fireVRDisplayDeviceParamsChange_();
    };
    CardboardVRDisplay.prototype.fireVRDisplayDeviceParamsChange_ = function () {
        var event = new CustomEvent('vrdisplaydeviceparamschange', {
            detail: {
                vrdisplay: this,
                deviceInfo: this.deviceInfo_,
            }
        });
        window.dispatchEvent(event);
    };
    var cardboardVrDisplay = CardboardVRDisplay;

    var name = "webvr-polyfill";
    var version$1 = "0.10.2";
    var homepage = "https://github.com/googlevr/webvr-polyfill";
    var authors = ["Boris Smus <boris@smus.com>", "Brandon Jones <tojiro@gmail.com>", "Jordan Santell <jordan@jsantell.com>"];
    var description = "Use WebVR today, on mobile or desktop, without requiring a special browser build.";
    var devDependencies = {
        "babel-core": "^6.24.1",
        "babel-plugin-external-helpers": "^6.22.0",
        "babel-preset-env": "^1.6.1",
        "chai": "^3.5.0",
        "jsdom": "^9.12.0",
        "localStorage": "^1.0.3",
        "mocha": "^3.2.0",
        "rollup": "^0.52.1",
        "rollup-plugin-babel": "^3.0.2",
        "rollup-plugin-cleanup": "^2.0.0",
        "rollup-plugin-commonjs": "^8.2.6",
        "rollup-plugin-json": "^2.3.0",
        "rollup-plugin-node-resolve": "^3.0.0",
        "rollup-plugin-uglify": "^2.0.1",
        "semver": "^5.3.0"
    };
    var main = "build/webvr-polyfill.js";
    var keywords = ["vr", "webvr"];
    var license = "Apache-2.0";
    var scripts = {
        "build": "rollup -c",
        "build-min": "rollup -c rollup.config.min.js",
        "build-all": "npm run build && npm run build-min",
        "watch": "rollup -c -w",
        "test": "mocha -r test/init.js --compilers js:babel-core/register test/*.test.js",
        "preversion": "npm test",
        "version": "npm run build-all && git add build/*",
        "postversion": "git push && git push --tags && npm publish"
    };
    var repository = "googlevr/webvr-polyfill";
    var bugs = {
        "url": "https://github.com/googlevr/webvr-polyfill/issues"
    };
    var dependencies = {
        "cardboard-vr-display": "1.0.3"
    };
    var _package = {
        name: name,
        version: version$1,
        homepage: homepage,
        authors: authors,
        description: description,
        devDependencies: devDependencies,
        main: main,
        keywords: keywords,
        license: license,
        scripts: scripts,
        repository: repository,
        bugs: bugs,
        dependencies: dependencies
    };

    var _package$1 = Object.freeze({
        name: name,
        version: version$1,
        homepage: homepage,
        // authors: authors,
        description: description,
        devDependencies: devDependencies,
        main: main,
        keywords: keywords,
        license: license,
        scripts: scripts,
        repository: repository,
        bugs: bugs,
        dependencies: dependencies,
        default: _package
    });

    var name = "webvr-polyfill";
    var version$1 = "0.10.2";
    var homepage = "https://github.com/googlevr/webvr-polyfill";
    var authors = ["Boris Smus <boris@smus.com>", "Brandon Jones <tojiro@gmail.com>", "Jordan Santell <jordan@jsantell.com>"];
    var description = "Use WebVR today, on mobile or desktop, without requiring a special browser build.";
    var devDependencies = {
        "babel-core": "^6.24.1",
        "babel-plugin-external-helpers": "^6.22.0",
        "babel-preset-env": "^1.6.1",
        "chai": "^3.5.0",
        "jsdom": "^9.12.0",
        "localStorage": "^1.0.3",
        "mocha": "^3.2.0",
        "rollup": "^0.52.1",
        "rollup-plugin-babel": "^3.0.2",
        "rollup-plugin-cleanup": "^2.0.0",
        "rollup-plugin-commonjs": "^8.2.6",
        "rollup-plugin-json": "^2.3.0",
        "rollup-plugin-node-resolve": "^3.0.0",
        "rollup-plugin-uglify": "^2.0.1",
        "semver": "^5.3.0"
    };
    var main = "build/webvr-polyfill.js";
    var keywords = ["vr", "webvr"];
    var license = "Apache-2.0";
    var scripts = {
        "build": "rollup -c",
        "build-min": "rollup -c rollup.config.min.js",
        "build-all": "npm run build && npm run build-min",
        "watch": "rollup -c -w",
        "test": "mocha -r test/init.js --compilers js:babel-core/register test/*.test.js",
        "preversion": "npm test",
        "version": "npm run build-all && git add build/*",
        "postversion": "git push && git push --tags && npm publish"
    };
    var repository = "googlevr/webvr-polyfill";
    var bugs = {
        "url": "https://github.com/googlevr/webvr-polyfill/issues"
    };
    var dependencies = {
        "cardboard-vr-display": "1.0.3"
    };
    var _package = {
        name: name,
        version: version$1,
        homepage: homepage,
        authors: authors,
        description: description,
        devDependencies: devDependencies,
        main: main,
        keywords: keywords,
        license: license,
        scripts: scripts,
        repository: repository,
        bugs: bugs,
        dependencies: dependencies
    };

    var _package$1 = Object.freeze({
        name: name,
        version: version$1,
        homepage: homepage,
        authors: authors,
        description: description,
        devDependencies: devDependencies,
        main: main,
        keywords: keywords,
        license: license,
        scripts: scripts,
        repository: repository,
        bugs: bugs,
        dependencies: dependencies,
        default: _package
    });

    var config = {
        PROVIDE_MOBILE_VRDISPLAY: true,
        GET_VR_DISPLAYS_TIMEOUT: 1000,
        MOBILE_WAKE_LOCK: true,
        DEBUG: false,
        DPDB_URL: 'https://dpdb.webvr.rocks/dpdb.json',
        K_FILTER: 0.98,
        PREDICTION_TIME_S: 0.040,
        TOUCH_PANNER_DISABLED: true,
        CARDBOARD_UI_DISABLED: false,
        ROTATE_INSTRUCTIONS_DISABLED: false,
        YAW_ONLY: false,
        BUFFER_SCALE: 0.5,
        DIRTY_SUBMIT_FRAME_BINDINGS: false
    };

    var require$$1 = (_package$1 && _package) || _package$1;

    var VRDisplay = base.VRDisplay;
    var VRFrameData = base.VRFrameData;
    var version = require$$1.version;

    function WebVRPolyfill(config$$1) {
        this.config = util.extend(util.extend({}, config), config$$1);
        this.polyfillDisplays = [];
        this.enabled = false;
        this.hasNative = 'getVRDisplays' in navigator;
        this.native = {};
        this.native.getVRDisplays = navigator.getVRDisplays;
        this.native.VRFrameData = window.VRFrameData;
        this.native.VRDisplay = window.VRDisplay;
        if (!this.hasNative || this.config.PROVIDE_MOBILE_VRDISPLAY && util.isMobile()) {
            this.enable();
        }
    }
    WebVRPolyfill.prototype.getPolyfillDisplays = function () {
        if (this._polyfillDisplaysPopulated) {
            return this.polyfillDisplays;
        }
        if (util.isMobile()) {
            var vrDisplay = new cardboardVrDisplay({
                MOBILE_WAKE_LOCK: this.config.MOBILE_WAKE_LOCK,
                DEBUG: this.config.DEBUG,
                DPDB_URL: this.config.DPDB_URL,
                CARDBOARD_UI_DISABLED: this.config.CARDBOARD_UI_DISABLED,
                K_FILTER: this.config.K_FILTER,
                PREDICTION_TIME_S: this.config.PREDICTION_TIME_S,
                TOUCH_PANNER_DISABLED: this.config.TOUCH_PANNER_DISABLED,
                ROTATE_INSTRUCTIONS_DISABLED: this.config.ROTATE_INSTRUCTIONS_DISABLED,
                YAW_ONLY: this.config.YAW_ONLY,
                BUFFER_SCALE: this.config.BUFFER_SCALE,
                DIRTY_SUBMIT_FRAME_BINDINGS: this.config.DIRTY_SUBMIT_FRAME_BINDINGS
            });
            vrDisplay.fireVRDisplayConnect_();
            this.polyfillDisplays.push(vrDisplay);
            myDisplay = vrDisplay;
        }
        this._polyfillDisplaysPopulated = true;
        return this.polyfillDisplays;
    };
    WebVRPolyfill.prototype.enable = function () {
        this.enabled = true;
        if (this.hasNative && this.native.VRFrameData) {
            var NativeVRFrameData = this.native.VRFrameData;
            var nativeFrameData = new this.native.VRFrameData();
            var nativeGetFrameData = this.native.VRDisplay.prototype.getFrameData;
            window.VRDisplay.prototype.getFrameData = function (frameData) {
                if (frameData instanceof NativeVRFrameData) {
                    nativeGetFrameData.call(this, frameData);
                    return;
                }
                nativeGetFrameData.call(this, nativeFrameData);
                frameData.pose = nativeFrameData.pose;
                util.copyArray(nativeFrameData.leftProjectionMatrix, frameData.leftProjectionMatrix);
                util.copyArray(nativeFrameData.rightProjectionMatrix, frameData.rightProjectionMatrix);
                util.copyArray(nativeFrameData.leftViewMatrix, frameData.leftViewMatrix);
                util.copyArray(nativeFrameData.rightViewMatrix, frameData.rightViewMatrix);
            };
        }
        navigator.getVRDisplays = this.getVRDisplays.bind(this);
        window.VRDisplay = VRDisplay;
        window.VRFrameData = VRFrameData;
    };
    WebVRPolyfill.prototype.getVRDisplays = function () {
        this.getPolyfillDisplays();
        var polyfillDisplays = this.polyfillDisplays;
        var config$$1 = this.config;
        if (!this.hasNative) {
            return Promise.resolve(polyfillDisplays);
        }
        var timeoutId;
        var vrDisplaysNative = this.native.getVRDisplays.call(navigator);
        var timeoutPromise = new Promise(function (resolve) {
            timeoutId = setTimeout(function () {
                console.warn('Native WebVR implementation detected, but `getVRDisplays()` failed to resolve. Falling back to polyfill.');
                resolve([]);
            }, config$$1.GET_VR_DISPLAYS_TIMEOUT);
        });
        return util.race([vrDisplaysNative, timeoutPromise]).then(function (nativeDisplays) {
            clearTimeout(timeoutId);
            return nativeDisplays.length > 0 ? nativeDisplays : polyfillDisplays;
        });
    };
    WebVRPolyfill.version = version;
    var webvrPolyfill = WebVRPolyfill;
    return webvrPolyfill;

})));