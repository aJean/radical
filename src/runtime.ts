import Panoram from './panoram';
import Log from './log';
import Loader from './loader';
import Timeline from './animation/timeline.animation';
import Multiple from './plugins/multiple.plugin';
import Overlay from './plugins/overlay.plugin';
import Layer from './plugins/layer.plugin';

/**
 * @file 执行环境
 */

abstract class EnvQueue {
    static list = [];

    static add(fn, context) {
        this.list.push(fn.bind(context || null));
    }

    static excute() {
        this.list.forEach(fn => fn());
    }
};

abstract class Runtime {
    static timeid: any;
    static uid = 0;
    static instanceMap = {};

    static getInstance(ref) {
        return this.instanceMap[ref];
    }

    static createRef(el) {
        el = (typeof el == 'string') ? document.querySelector(el) : el;

        if (!el || !el.parentNode) {
            el = document.body;
        }

        const ref = el.getAttribute('ref') || `panoram_${this.uid++}`;
        el.setAttribute('ref', ref);

        // TODO: more configurable opts
        const panoram = this.instanceMap[ref] = new Panoram({el});
        return panoram;
    }

    static async start(source, el, events?) {
        const config = await Loader.fetch(source);

        if (!(config && config['sceneGroup'])) {
            return Log.errorLog('load source error');
        }

        const panoram = this.createRef(el);

        if (config['animation']) {
            Timeline.install(config['animation'], panoram);
        }

        if (config['multiScene']) {
            panoram.addPlugin(Multiple, config['sceneGroup']);
        }

        if (config['info']) {
            panoram.addPlugin(Layer, config['info']);
        }
        // 用户订阅事件
        if (events) {
            for (let name in events) {
                panoram.subscribe(name, events[name], panoram);
            }
        }

        // set pem path
        Loader.setCret(config['cretPath']);
        // add to env queue listeners
        EnvQueue.add(panoram.resize, panoram);
        // load and render
        this.run(panoram, panoram.initSource(config));
    }

    /**
     * 环境构造 stream
     * @param {Object} panoram 全景对象
     * @param {Object} scene 渲染的场景
     */
    static async run(panoram, scene) {  
        try {
            if (scene.overlays) {
                panoram.addPlugin(Overlay, scene);
            }
            
            // 加载缩略图
            const thumbImg = await Loader.loadPreviewTex(scene.imgPath);

            if (!thumbImg) {
                return Log.errorLog('load preview texture error');
            }

            panoram.initMesh(thumbImg);
            panoram.animate();

            // 加载场景资源图
            const textures =  await Loader.loadSceneTex(panoram.currentScene.bxlPath);
            if (textures) {
                panoram.loader.load(textures, tex => panoram.replaceTexture(tex));
            } else {
                Log.errorLog('load textures error');
            }
        } catch(e) {
            Log.errorLog(e)
        }
    }
};

const oldOnLoad = window.onload;
window.onload = function() {
    oldOnLoad && oldOnLoad.call(this);

    let uid = 0;
    const nodeList = document.querySelectorAll('panoram');

    for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i];
        const auto = node.getAttribute('auto');

        if (auto) {
            Runtime.start(node.getAttribute('source'), node);
        }
    }
};

window.addEventListener('resize', event => {
    clearTimeout(Runtime.timeid);
    Runtime.timeid = setTimeout(function () {
        EnvQueue.excute();
    }, 100);
});

export default Runtime;