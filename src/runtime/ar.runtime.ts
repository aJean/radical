import Util from '../util';

/**
 * @file web ar
 * http://bhollis.github.io/aruco-marker/demos/angular.html
 */

const AR = window['AR'];
export default class Runtime {
    detector: any;
    video: any;
    canvas: any;
    context: any;
    tip: any;

    constructor() {
        this.create();
        this.detector = new AR.Detector();

        const constraints = {audio: false, video: {facingMode: 'environment'}};
        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
            const video = this.video;

            if ('srcObject' in video) {
                video.srcObject = stream;
            } else {
                video.src = window.URL.createObjectURL(stream);
            }

            video.onloadedmetadata = e => video.play();
        }).catch(function(err) {
            alert(err);
        });

        this.tick();
    }

    create() {
        const video = this.video = Util.createElement(`<video class="ar-video" style="position:relative;z-index:1;" autoplay playsinline></video>`);
        const canvas:any = this.canvas = Util.createElement(`<canvas width="300" height="300"></canvas>`);
        const tip = this.tip = Util.createElement('<span style="display:none;position:absolute;width:100px;height:50px;background:blue;color:#fff;z-index:999;">hello webar</span>');

        this.context = canvas.getContext("2d");
        
        document.body.appendChild(video);
        document.body.appendChild(tip);
        
    }

    tick() {
        requestAnimationFrame(this.tick.bind(this));

        const video = this.video;
        const canvas = this.canvas;
        const context = this.context;
        const detector = this.detector;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const data = context.getImageData(0, 0, canvas.width, canvas.height);

        const markers = detector.detect(data);
        
        if (markers.length) {
            const marker = markers[0];
            this.tip.style.display = 'block'
            this.tip.style.left = marker.corners[0].x + 'px';
            this.tip.style.top = marker.corners[0].y + 'px';
        } else {
            this.tip.style.display = 'none';
        }
    }
}