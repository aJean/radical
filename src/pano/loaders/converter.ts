/**
 * @file data coordinate transform
 */

export class SceneData {
    id: any;
    setId: any;
    setName: string;
    pimg: string; // 预览图
    timg: string; // 缩略图
    simg: string; // 资源图
    suffix: string;
    fov: number; 
    lng: number; // 初始横向角度
    lat: number; // 初始纵向角度
    info: Object;
    overlays: Array<{}>;
    recomList: Array<{}>;
    recomPos: Array<{}>;

    constructor(data) {
        this.id = data.id;
        this.setId = data.setId;
        this.pimg = data.imgPath;
        this.timg = data.thumbPath;
        this.simg = data.texPath || data.bxlPath;
        this.suffix = data.textPathExt;
        this.fov = data.fov;
        this.lat = data.lat;
        this.lng = data.lng;
        this.info = data.bearInfo || data.info;
        this.overlays = this.getArrayValue(data.overlays);
        this.recomList = this.getArrayValue(data.recomList);
        this.recomPos = this.getArrayValue(data.recomPos);
    }

    getArrayValue(arry) {
        return arry && arry.length ? arry : null;
    }

    equal(data) {
        return this == data;
    }
}

export default abstract class Converter {
    static krpanoTransform(location) {
        location.lng = -location.x;
        location.lat = -location.y;
    }

    static XRTransform(location) {
        location.lng = location.lng - 180;
        location.lat = location.lat - 90;
    }

    static ResultTransform(res) {
        try {
            return res.Result[0].DisplayData.resultData.tplData;
        } catch (error) {
            return null;
        }
    }

    static DataTransform(olddata) {
        return new SceneData(olddata);
    }

    static DataFind(scenes, id) {
        const data = scenes.find(obj => obj.id == id);
        return this.DataTransform(data);
    }
}