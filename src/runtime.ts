import Pano from './pano';
import Log from './log';
import ResourceLoader from './loaders/resource.loader';
import Info from './plugins/info.plugin';
import Rotate from './plugins/rotate.plugin';
import Multiple from './plugins/multiple.plugin';
import Wormhole from './plugins/wormhole.plugin';
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
        const pano = this.instanceMap[ref];
        if (pano) {
            pano.dispose();
            EnvQueue.remove(pano);
        }

        if (!EnvQueue.len()) {
            window.removeEventListener('resize', onEnvResize);
        }
    }

    /**
     * 创建全景对象
     * @param {HTMLElement} el root 元素
     * @param {Object} opts
     * @param {Array} data
     */
    static createRef(el, opts, data) {
        el = (typeof el == 'string') ? document.querySelector(el) : el;

        if (!el || !el.parentNode) {
            el = document.body;
        }

        const ref = el.getAttribute('ref') || `pano_${this.uid++}`;
        el.setAttribute('ref', ref);
        
        return this.instanceMap[ref] = new Pano({el, data, ...opts});
    }

    static async start(url, el, events?) {
        const config = typeof url === 'string' ? await myLoader.fetchUrl(url) : url;

        if (!(config && config['sceneGroup'])) {
            return Log.output('load source error');
        }

        const pano = this.createRef(el, config['pano'], config['sceneGroup']);
        const data = this.findScene(config);

        if (config['animation']) {
            Timeline.install(config['animation'], pano);
        } else {
            pano.noTimeline();
        }

        if (config['rotate']) {
            pano.addPlugin(Rotate, config['rotate']);
        }

        if (config['multiScene']) {
            pano.addPlugin(Multiple, config['sceneGroup']);
        }

        if (config['info']) {
            pano.addPlugin(Info, config['info']);
        }

        if (config['wormhole']) {
            pano.addPlugin(Wormhole, config['wormhole']);
        }
        // 用户订阅事件
        if (events) {
            for (let name in events) {
                pano.subscribe(name, events[name]);
            }
        }

        // set pem path
        myLoader.loadCret(config['cretPath']);
        // add to env queue listeners
        EnvQueue.add(pano.onResize, pano);
        // load and render
        this.run(pano, data);
    }

    /**
     * 环境构造 stream
     * @param {Object} pano 全景对象
     * @param {Object} data 等待渲染的场景数据
     */
    static async run(pano, data) {  
        try {
            // 加载缩略图
            const thumbImg = await myLoader.loadTexture(data.imgPath, 'canvas');
            // 加载原图
            if (thumbImg) {
                pano.initPreview(thumbImg);
                await pano.initScene(data);
                pano.animate();
            }
        } catch(e) {
            Log.output(e)
        }
    }

      /**
     * 初始化资源配置
     * @param {Object} source 资源配置对象
     */
    static findScene(source) {
        const group = source.sceneGroup;
        const scene = group.find(item => item.id == source.defaultSceneId);

        return (scene || group[0]);
    }

    static addOverlay(pano) {

    }
};

const pastLoad = window.onload;
window.onload = function() {
    pastLoad && pastLoad.call(this);

    let uid = 0;
    const nodeList = document.querySelectorAll('pano');

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