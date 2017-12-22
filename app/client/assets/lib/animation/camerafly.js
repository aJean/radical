/**
 * @file 开场动画组组件
 */

export default class AnimationFly {
    end = false;
    startTime = 0;
    totleTime = 0;
    lastTime = 0;

    constructor(camera) {
        const path = this.path = this.getPath(camera);
        this.camera = camera;

        path.forEach(data => {
            this.totleTime += data.time;
        })
    }

    play() {
        this.startTime = Date.now() - this.lastTime;
    }

    reset() {
        this.startTime = Date.now();
        this.lastTime = 0;
    }

    update() {
        if (this.end) {
            return;
        }

        const camera = this.camera;
        const path = this.path;
        const last = path[path.length - 1];
        const dTime = Date.now() - this.startTime;
        this.lastTime = dTime;

        if (dTime > this.totleTime) {
            return;
        }

        for (let data of path) {
            if (dTime <= data.time) {
                var movePercent = dTime / data.time;
                var pX = data.start.position.x + movePercent * (data.end.position.x - data.start.position.x);
                var pY = data.start.position.y + movePercent * (data.end.position.y - data.start.position.y);
                var pZ = data.start.position.z + movePercent * (data.end.position.z - data.start.position.z);

                var rX = data.start.rotation.x + movePercent * (data.end.rotation.x - data.start.rotation.x);
                var rY = data.start.rotation.y + movePercent * (data.end.rotation.y - data.start.rotation.y);
                var rZ = data.start.rotation.z + movePercent * (data.end.rotation.z - data.start.rotation.z);

                var fov = data.start.fov + movePercent * (data.end.fov - data.start.fov);

                camera.fov = fov;
                camera.position.set(pX, pY, pZ);
                camera.rotation.set(rX, rY, rZ);

                camera.updateProjectionMatrix();
                return;
            } else {
                dTime -= data.time;
            }
        };

        camera.fov = last.end.fov;
        camera.position.set(
            last.end.position.x,
            last.end.position.y,
            last.end.position.z
        );
        camera.rotation.set(
            last.end.rotation.x,
            last.end.rotation.y,
            last.end.rotation.z
        );

        camera.updateProjectionMatrix();
        this.end = true;
        this.lastTime = 0;
    }

    getPath(camera) {
        return [{
            'start': {
                'fov': 160,
                'position': {
                    'x': 0,
                    'y': 1900,
                    'z': 0
                },
                'rotation': {
                    'x': -Math.PI / 2,
                    'y': 0,
                    'z': 0
                }
            },
            'end': {
                'fov': 120,
                'position': {
                    'x': 0,
                    'y': 1500,
                    'z': 0
                },
                'rotation': {
                    'x': -Math.PI / 2,
                    'y': 0,
                    'z': Math.PI * 0.8
                }
            },
            'time': '1500'}, {
            'start': {
                'fov': 120,
                'position': {
                    'x': 0,
                    'y': 1500,
                    'z': 0
                },
                'rotation': {
                    'x': -Math.PI / 2,
                    'y': 0,
                    'z': Math.PI * 0.8
                }
            },
            'end': {
                'fov': camera.fov,
                'position': {
                    'x': camera.position.x,
                    'y': camera.position.y,
                    'z': camera.position.z
                },
                'rotation': {
                    'x': -Math.PI,
                    'y': 0,
                    'z': Math.PI
                }
            },
            'time': '1500'}];
    }
};