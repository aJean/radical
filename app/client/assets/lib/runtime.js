import Log from './log';
import {fetch, loadPreviewTex, loadSceneTex} from './loader';
import AnimationFly from './animation/camerafly';

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
        fetch(url).then(ret => {
            console.log(ret);
            if (ret && ret.sceneGroup && ret.defaultSceneId) {
                if (ret.enableAnimation) {
                    panoram.addAnimation(AnimationFly);
                }

                return panoram.initSource(ret);
            } else {
                Log.errorLog('load source error');
            }
        // 预览场景
        }).then(scene => {
            if (scene) {
                return loadPreviewTex(scene.panoPath);
            } else {
                Log.errorLog('get preview scene error');
            }
        // 场景贴图
        }).then(texture => {
            if (texture) {
                panoram.initMesh(texture);
                panoram.animate();
                return loadSceneTex(panoram.currentScene.panoPath);
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