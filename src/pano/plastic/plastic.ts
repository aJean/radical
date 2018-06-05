import Tween from '../animations/tween.animation';

/**
 * @file 内置物体材质抽象类
 */

export default abstract class Plastic {
    pano: any;
    opts: any;
    plastic: any;

    setPosition(x, y, z) {
        this.plastic.position.set(x, y, z);
    }

    addTo(obj) {
        if (obj instanceof Plastic) {
            obj = obj.plastic;
        }

        obj.add(this.plastic);
    }

    addBy(pano) {
        pano.addSceneObject(this.plastic);
    }

    removeBy(pano) {
        pano.removeSceneObject(this.plastic);
    }

    setOpacity(num, useanim) {
        const material = this.plastic.material;
       
        useanim ? new Tween(material).to({opacity: num}).effect('backOut', 500)
            .start(['opacity'])
            : (material.opacity = num);
    }

    show() {
        this.plastic.visible = true;
    }

    hide() {
        this.plastic.visible = false;
    }

    dispose() {
        const plastic = this.plastic;
        const material = plastic.material;

        delete plastic.data;
        plastic.geometry.dispose();
        material.map && material.map.dispose();
        material.envMap && material.envMap.dispose();
        material.dispose();
        plastic.parent.remove(plastic);
    }
}
