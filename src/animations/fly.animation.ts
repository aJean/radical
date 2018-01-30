/**
 * @file minor planet animation
 */

function calc (t, b, c, d) { 
    return c * t / d + b; 
}

export default class AnimationFly {
    path: any;
    camera: any;
    time = 0;
    type = 'fly';
    finished = false;

    constructor(camera) {
        this.path = this.getPath(this.camera = camera);
    }

    update() {
        const camera = this.camera;
        const path = this.path;
        const phase = path[0];
        let time = this.time;

        if (!phase) {
            return (this.finished = true);
        }

        if (time > phase.time) {
            camera.fov = phase.end.fov;
            camera.position.set(
                phase.end.px,
                phase.end.py,
                phase.end.pz
            );
            camera.rotation.set(
                phase.end.rx,
                phase.end.ry,
                phase.end.rz
            );
    
            camera.updateProjectionMatrix();
            time = this.time = 0;
            return path.shift();          
        }

        for (let data of path) {
            const px = calc(time, data.start.px, data.end.px - data.start.px, data.time);
            const py = calc(time, data.start.py, data.end.py - data.start.py, data.time);
            const pz = calc(time, data.start.pz, data.end.pz - data.start.pz, data.time);
            const rx = calc(time, data.start.rx, data.end.rx - data.start.rx, data.time);
            const ry = calc(time, data.start.ry, data.end.ry - data.start.ry, data.time);
            const rz = calc(time, data.start.rz, data.end.rz - data.start.rz, data.time);
            const fov = calc(time, data.start.fov, data.end.fov - data.start.fov, data.time);

            camera.fov = fov;
            camera.position.set(px, py, pz);
            camera.rotation.set(rx, ry, rz);

            this.time += 16;
            return camera.updateProjectionMatrix();
        }
    }

    getPath(camera) {
        return [{
            start: {fov: 160, px: 0, py: 1900, pz: 0, rx: -Math.PI / 2, ry: 0, rz: 0},
            end: {fov: 120, px: 0, py: 1500, pz: 0, rx: -Math.PI / 2, ry: 0, rz: Math.PI * 0.8},
            time: 1500
        }, {
            start: {fov: 120, px: 0, py: 1500, pz: 0, rx: -Math.PI / 2, ry: 0, rz: Math.PI * 0.8},
            end: {fov: camera.fov, px: camera.position.x, py: camera.position.y, pz: camera.position.z, rx: -Math.PI, ry: 0, rz: Math.PI},
            time: 1500
        }];
    }

    isEnd() {
        return this.finished;
    }
};