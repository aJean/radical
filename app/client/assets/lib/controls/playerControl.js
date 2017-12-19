/**
 * @file 全景序列帧控制器
 * @author liwenhui(liwenhui01@baidu.com)
 */
/* globals THREE WebVR*/
WebVR.ImagePlayerControl = (function () {
    var result;

    function ImagePlayer(position,
                         cameraPosition,
                         planeWidth,
                         planeHeight,
                         imgPath,
                         coverImgPath,
                         imgCount,
                         autoPlay,
                         loop) {
        var self = this;
        this.autoPlay = autoPlay;
        this.loop = loop;
        var isPlaying = false;
        var coverShowState = true;
        var readyState = false;
        var loading = false;
        var loadedCount = 0;
        var textureLoader = WebVR.textureLoader;

        var currentIndex = 0;
        var timePerFrame = 1000 / 20;

        var selfClass = this;

        var lastTime = 0;


        var texture;
        var textureArray = [];

        var coverTexture = textureLoader.load(coverImgPath);
        var material = new THREE.MeshBasicMaterial({map: coverTexture, transparent: true});

        var plane = new THREE.PlaneGeometry(planeWidth, planeHeight);

        var mesh = new THREE.Mesh(plane, material);
        mesh.position.set(position.x, position.y, position.z);
        mesh.lookAt(cameraPosition);

        function setCurrentFrame() {
            if (!isPlaying) {
                return;
            }
            /*根据时间设置当前帧*/
            if (lastTime > 0) {
                var currentTime = new Date().getTime();
                var deltaTime = currentTime - lastTime;

                var dIndex = parseInt(deltaTime / timePerFrame, 10);
                currentIndex += dIndex;
                if (!self.loop && currentIndex >= imgCount) {
                    selfClass.pause();
                    return;
                }
                currentIndex = currentIndex % imgCount;
                if (dIndex > 0) {
                    lastTime = currentTime;
                    if (textureArray[currentIndex]) {
                        textureArray[currentIndex].dispose();
                    }
                    texture = textureArray[currentIndex];
                    material.map = texture;
                }
            } else {
                if (textureArray[currentIndex]) {
                    textureArray[currentIndex].dispose();
                }
                texture = textureArray[currentIndex];
                material.map = texture;
                lastTime = new Date().getTime();
            }


        }

        function loadTexture() {
            if (loadedCount < imgCount) {
                loading = true;
                var loadImgPath = imgPath + '/' + (loadedCount + 1) + '.png';
                textureLoader.load(loadImgPath, function (tex) {
                    textureArray[loadedCount] = tex;
                    ++loadedCount;
                    loadTexture();
                });
            } else {
                texture = textureArray[0];
                readyState = true;
                loading = false;
            }

        }

        this.startLoad = function () {
            if (!loading) {
                loadTexture();
            }
        };

        this.update = function () {
            if (readyState && isPlaying) {

                setCurrentFrame();

            }
        };
        this.play = function () {
            if (!loading) {
                loadTexture();
            }
            isPlaying = true;
            lastTime = 0;
            currentIndex = currentIndex % imgCount;
            if (coverShowState) {
                coverShowState = false;
            }
        };
        this.pause = function () {
            isPlaying = false;
        };
        this.getMesh = function () {
            return mesh;
        };
        this.togglePlay = function () {
            if (isPlaying) {
                this.pause();
            }
            else {
                this.play();
            }
        };
        this.dispose = function () {
            self.pause();
            for (var i = 0; i < textureArray.length; i++) {
                textureArray[i].dispose();
            }
        };
        if (self.autoPlay) {
            self.play();
        }
    }

    function ImagePlayerControl() {
        this.createImagePlayer = function (position,
                                           cameraPosition,
                                           planeWidth,
                                           planeHeight,
                                           imgPath,
                                           coverImgPath,
                                           imgCount,
                                           autoPlay,
                                           loop) {
            return new ImagePlayer(position,
                cameraPosition,
                planeWidth,
                planeHeight,
                imgPath,
                coverImgPath,
                imgCount,
                autoPlay,
                loop);
        };
    }

    if (!result) {
        result = new ImagePlayerControl();
    }
    return result;
}());