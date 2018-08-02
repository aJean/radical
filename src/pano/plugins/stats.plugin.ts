import PluggableUI from '../../interface/ui.interface';
import Util from '../../core/util';

/**
 * @author mrdoob / http://mrdoob.com/
 */

export default class Stats extends PluggableUI {
    pano: any;
    panel: any;
    REVISION = 16;
    beginTime = (performance || Date).now();
    prevTime = this.beginTime;
    frames = 0;

    constructor(pano, opts) {
        super();

        this.pano = pano;
        this.subscribe(this.Topic.SCENE.LOAD, () => this.create());
    }

    create() {
        const element = this.element= Util.createElement('<div style="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000;"></div>');
        const panel = this.panel = createPanel('FPS', '#0ff', '#002');

        element.appendChild(panel.dom);
        this.pano.getRoot().appendChild(element);

        this.subscribe(this.Topic.RENDER.PROCESS, () => this.update());
    }

    begin() {
        this.beginTime = (performance || Date).now();
    }

    end() {
        this.frames++;
        const time = (performance || Date).now();

        if (time > this.prevTime + 1000) {
            this.panel.update((this.frames * 1000) / (time - this.prevTime), 100);

            this.prevTime = time;
            this.frames = 0;
        }

        return time;
    }

    update() {
        this.beginTime = this.end();
    }

    dispose() {
        super.dispose();
    }
}

function createPanel(name, fg, bg) {
    let min = Infinity;
    let max = 0;
    const round = Math.round;
    const PR = round(window.devicePixelRatio || 1);

    const WIDTH = 80 * PR;
    const HEIGHT = 48 * PR;
    const TEXT_X = 3 * PR;
    const TEXT_Y = 2 * PR;
    const GRAPH_X = 3 * PR;
    const GRAPH_Y = 15 * PR;
    const GRAPH_WIDTH = 74 * PR;
    const GRAPH_HEIGHT = 30 * PR;

    const canvas: any = Util.createElement(`<canvas width="${WIDTH}" height="${HEIGHT}" style="width:80px;hieght:48px;"></canvas>`);

    const context = canvas.getContext('2d');
    context.font = 'bold ' + (9 * PR) + 'px Helvetica,Arial,sans-serif';
    context.textBaseline = 'top';

    context.fillStyle = bg;
    context.fillRect(0, 0, WIDTH, HEIGHT);

    context.fillStyle = fg;
    context.fillText(name, TEXT_X, TEXT_Y);
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

    context.fillStyle = bg;
    context.globalAlpha = 0.9;
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

    return {
        dom: canvas,

        update: function (value, maxValue) {
            min = Math.min(min, value);
            max = Math.max(max, value);

            context.fillStyle = bg;
            context.globalAlpha = 1;
            context.fillRect(0, 0, WIDTH, GRAPH_Y);
            context.fillStyle = fg;
            context.fillText(round(value) + ' ' + name + ' (' + round(min) + '-' + round(max) + ')', TEXT_X, TEXT_Y);

            context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);

            context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

            context.fillStyle = bg;
            context.globalAlpha = 0.9;
            context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - (value / maxValue)) * GRAPH_HEIGHT));
        }
    };
}