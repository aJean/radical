import Tween from './tween.animation';

/**
 * @file pano 过场动画
 */

export default {
    /**
     * 透明度切换
     */
    fade(old, target, pano) {
        const plastic = target.getPlastic();
        const material = plastic.material;

        target.setOpacity(0);
        pano.addSceneObject(plastic);

        return new Promise(function (resolve, reject) {
            new Tween(material, pano.ref).to({opacity: 1}).effect('linear', 1000)
                .start(['opacity']).complete(resolve).error(reject);
        });
    },

    /**
     * 透明度切换 with preTrans
     */
    trans(old, target, pano) {
        const tplastic = target.getPlastic();
        const plastic = old.getPlastic();
        const material = plastic.material;

        plastic.renderOrder = 1;
        tplastic.renderOrder = 0;

        pano.addSceneObject(tplastic);
        return new Promise(function (resolve, reject) {
            new Tween(material, pano.ref).to({opacity: 0}).effect('linear', 1000)
                .start(['opacity']).complete(resolve).error(reject);
        });
    }
}