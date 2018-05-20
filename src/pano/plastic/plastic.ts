/**
 * @file 内置物体材质抽象类
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
        const material = plastic.material;

        plastic.geometry.dispose();
        material.map && material.map.dispose();
        material.envMap && material.envMap.dispose();
        material.dispose();
        plastic.parent.remove(plastic);
    }
}
