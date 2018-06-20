/**
 * @file 高清图存储
 */

export default abstract class HDStore {
    static hdmap = {};

    /**
     * 加载高清图片
     * @param {string} url 
     */
    static getHDPicture(url) {
        if (this.hdmap[url]) {
            return false;
        }

        const img = new Image();
        img.src = url;

        this.hdmap[url] = img;
        return new Promise(function(resolve, reject) {
            img.onload = () => resolve(img);
            img.onerror = () => reject();
        });
    }

    /**
     * 获取已经加载过的图片
     * @param {string} key 
     */
    static getHDPictureByKey(key) {
        return Promise.resolve(this.hdmap[key]);
    }

    static getStore() {
        return Promise.resolve(this.hdmap);
    }
}