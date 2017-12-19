/**
 * @file 开场动画组组件
 * @author liwenhui(liwenhui01@baidu.com)
 */
/* globals THREE WebVR*/
WebVR.CameraFly = function WebVR_Fly(camera, path, FlyEndCallBack) {
    var enable = false;
    var startTime;
    var totleTime = 0;
    var lastTime = 0;
    for (var i = 0; i < path.length; i++) {
        totleTime += path[i].time;
    }
    this.play = function () {
        startTime = new Date();
        startTime = startTime - lastTime;
        enable = true;
    };
    this.stop = function () {
        enable = false;
    };
    this.reset = function () {
        startTime = new Date();
        lastTime = 0;
    };
    this.update = function () {
        if (!enable) {
            return;
        }
        var currentTime = new Date();
        var dTime = currentTime - startTime;
        lastTime = dTime;
        if (dTime > totleTime) {
            return;
        }
        for (var i = 0; i < path.length; i++) {
            if (dTime <= path[i].time) {
                var movePercent = dTime / path[i].time;
                var pX = path[i].start.position.x + movePercent * (path[i].end.position.x - path[i].start.position.x);
                var pY = path[i].start.position.y + movePercent * (path[i].end.position.y - path[i].start.position.y);
                var pZ = path[i].start.position.z + movePercent * (path[i].end.position.z - path[i].start.position.z);

                var rX = path[i].start.rotation.x + movePercent * (path[i].end.rotation.x - path[i].start.rotation.x);
                var rY = path[i].start.rotation.y + movePercent * (path[i].end.rotation.y - path[i].start.rotation.y);
                var rZ = path[i].start.rotation.z + movePercent * (path[i].end.rotation.z - path[i].start.rotation.z);


                var fov = path[i].start.fov + movePercent * (path[i].end.fov - path[i].start.fov);

                camera.fov = fov;
                camera.position.set(pX, pY, pZ);
                camera.rotation.set(rX, rY, rZ);

                camera.updateProjectionMatrix();
                return;
            } else {
                dTime -= path[i].time;
            }
        }
        camera.fov = path[path.length - 1].end.fov;
        camera.position.set(
            path[path.length - 1].end.position.x,
            path[path.length - 1].end.position.y,
            path[path.length - 1].end.position.z
        );
        camera.rotation.set(
            path[path.length - 1].end.rotation.x,
            path[path.length - 1].end.rotation.y,
            path[path.length - 1].end.rotation.z
        );
        camera.updateProjectionMatrix();
        enable = false;
        lastTime = 0;
        if (FlyEndCallBack) {
            FlyEndCallBack();
        }
    };
};