import Log from './log';
import Loader from './loader';
import AnimationFly from './animation/fly.animation';
import Overlay from './plugins/overlay.plugin';
import Multiple from './plugins/multiple.plugin';
import Layer from './plugins/layer.plugin';

/**
 * 执行环境
 */

export default {
    panoramList: [],

    /**
     * 环境构造 stream
     * @param {Object} panoram 全景对象
     * @param {string} url 资源地址
     */
    run(panoram, url) {
        Loader.fetch(url).then(config => {
            if (config && config['sceneGroup'] && config['defaultSceneId']) {
                if (config['enableAnimation']) {
                    panoram.addAnimation(AnimationFly);
                }

                if (config['multiScene']) {
                    panoram.addPlugin(Multiple, config['sceneGroup']);
                }

                if (config['info']) {
                    panoram.addPlugin(Layer, config['info']);
                }

                Loader.setCret(config['cretPath']);
                return panoram.initSource(config);
            } else {
                Log.errorLog('load source error');
            }
        // 预览场景
        }).then(scene => {
            if (scene) {
                if (scene.overlays) {
                    panoram.addPlugin(Overlay, scene);
                }
                return Loader.loadPreviewTex(scene.imgPath);
            } else {
                Log.errorLog('get preview scene error');
            }
        // 场景贴图
        }).then(texture => {
            if (texture) {
                panoram.initMesh(texture);
                panoram.animate();
                return Loader.loadSceneTex(panoram.currentScene.bxlPath);
            } else {
                Log.errorLog('load preview texture error');
            }
        // 完整场景
        }).then(textures => {
            if (textures) {
                panoram.loader.load(textures, tex => panoram.replaceTexture(tex));
            } else {
                Log.errorLog('load textures error');
            }
        }).catch(e => Log.errorLog(e));
    }
}