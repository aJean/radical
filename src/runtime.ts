import Panoram from './panoram';
import Log from './log';
import Loader from './loader';
import AnimationFly from './animation/fly.animation';
import Overlay from './plugins/overlay.plugin';
import Multiple from './plugins/multiple.plugin';
import Layer from './plugins/layer.plugin';

/**
 * 执行环境
 */

let uid = 0;
const instanceMap = {};
const Runtime = {
    getInstance(id) {
        return instanceMap[id];
    },

    createRef(el) {
        el = (typeof el == 'string') ? document.querySelector(el) : el;

        if (!el || !el.parentNode) {
            el = document.body;
        }

        const ref = el.getAttribute('ref') || `panoram_${uid++}`;
        el.setAttribute('ref', ref);

        // todo: more configurable opts
        const panoram = instanceMap[ref] = new Panoram({el});
        return panoram;
    },

    async start(source, el, events?) {
        const config = await Loader.fetch(source);

        if (!(config && config['sceneGroup'])) {
            return Log.errorLog('load source error');
        }

        const panoram = this.createRef(el);

        if (config['enableAnimation']) {
            panoram.addAnimation(AnimationFly);
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

        // 设置证书路径
        Loader.setCret(config['cretPath']);
        this.run(panoram, panoram.initSource(config));
    },

    /**
     * 环境构造 stream
     * @param {Object} panoram 全景对象
     * @param {Object} scene 渲染的场景
     */
    async run(panoram, scene) {  
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

window.addEventListener('onload', event => {
    let uid = 0;
    const nodeList = document.querySelectorAll('panoram');

    for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i];
        const auto = node.getAttribute('auto');

        if (auto) {
            Runtime.start(node.getAttribute('source'), node);
        }
    }
});

export default Runtime;