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

    addTo(scene) {
        scene.add(this.plastic);
    }

    addBy(pano) {
        pano.addSceneObject(this.plastic);
    }

    setOpacity(num, pano) {
        const material = this.plastic.material;
       
        pano ? new Tween(material).to({opacity: num}).effect('backOut', 500)
            .start(['opacity'], pano)
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

        plastic.geometry.dispose();
        material.map && material.map.dispose();
        material.envMap && material.envMap.dispose();
        material.dispose();
        plastic.parent.remove(plastic);
    }
}
