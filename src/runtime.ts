import Panoram from './panoram';
import Log from './log';
import ResourceLoader from './loaders/resource.loader';
import Info from './plugins/info.plugin';
import Multiple from './plugins/multiple.plugin';
import Wormhole from './plugins/wormhole.plugin';
import Overlays from './overlays/overlays.overlay';
import Timeline from './animations/timeline.animation';

/**
 * @file 执行环境
 */

const myLoader = new ResourceLoader();
abstract class EnvQueue {
    static list = [];

    static add(fn, context) {
        this.list.push({
            context: context,
            fn: fn.bind(context)
        });
    }

    static excute() {
        this.list.forEach(item => item.fn());
    }

    static remove(context) {
        const list = this.list;
        const index = list.find(item => item.context == context);
        list.splice(index, 1);
    }

    static len() {
        return this.list.length;
    }
};

abstract class Runtime {
    static timeid: any;
    static uid = 0;
    static instanceMap = {};

    /**
     * 获取全景对象, use after scene-init
     * @param {string} ref 
     */
    static getInstance(ref) {
        return this.instanceMap[ref];
    }

    /**
     * 释放一个全景对象
     * @param {string} ref 
     */
    static releaseInstance(ref) {
        const panoram = this.instanceMap[ref];
        if (panoram) {
            panoram.dispose();
            EnvQueue.remove(panoram);
        }

        if (!EnvQueue.len()) {
            window.removeEventListener('resize', onEnvResize);
        }
    }

    /**
     * 创建全景对象
     * @param {Element} el root 元素
     * @param {Object} opts 配置 
     */
    static createRef(el, opts) {
        el = (typeof el == 'string') ? document.querySelector(el) : el;

        if (!el || !el.parentNode) {
            el = document.body;
        }

        const ref = el.getAttribute('ref') || `panoram_${this.uid++}`;
        el.setAttribute('ref', ref);

        // TODO: more configurable opts
        const panoram = this.instanceMap[ref] = new Panoram({el, ...opts});
        return panoram;
    }

    static async start(source, el, events?) {
        const config = await myLoader.fetchUrl(source);

        if (!(config && config['sceneGroup'])) {
            return Log.output('load source error');
        }

        const panoram = this.createRef(el, config['panoram']);

        if (config['animation']) {
            Timeline.install(config['animation'], panoram);
        } else {
            panoram.noTimeline();
        }

        if (config['multiScene']) {
            panoram.addPlugin(Multiple, config['sceneGroup']);
        }

        if (config['info']) {
            panoram.addPlugin(Info, config['info']);
        }

        if (config['wormhole']) {
            panoram.addPlugin(Wormhole, config['wormhole']);
        }
        // 用户订阅事件
        if (events) {
            for (let name in events) {
                panoram.subscribe(name, events[name]);
            }
        }

        // set pem path
        myLoader.loadCret(config['cretPath']);
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
                Overlays.install(panoram, scene);
            }
            
            // 加载缩略图
            const thumbImg = await myLoader.loadTexture(scene.imgPath, 'canvas');

            if (!thumbImg) {
                return Log.output('load preview texture error');
            }

            panoram.initMesh(thumbImg);
            panoram.animate();

            // first time load scene bxl
            const texture = await myLoader.loadTexture(scene.bxlPath || scene.texPath);
            if (texture) {
                panoram.replaceTexture(texture, true);
            } else {
                Log.output('load textures error');
            }
        } catch(e) {
            Log.output(e)
        }
    }
};

const pastLoad = window.onload;
window.onload = function() {
    pastLoad && pastLoad.call(this);

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

const onEnvResize = event => {
    clearTimeout(Runtime.timeid);
    Runtime.timeid = setTimeout(function () {
        EnvQueue.excute();
    }, 200);
};
window.addEventListener('resize', onEnvResize);

export default Runtime;