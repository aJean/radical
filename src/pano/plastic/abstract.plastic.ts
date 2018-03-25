/**
 * @file 内置物体材质抽象类
 * @TODO: 提取公共方法
 */

export default abstract class Plastic {
    data: any;
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

    dispose() {
        const plastic = this.plastic;

        plastic.material.envMap.dispose();
        plastic.material.dispose();
        plastic.parent.remove(plastic);
    }
}
