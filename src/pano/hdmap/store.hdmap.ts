/**
 * @file 高清图存储
 */

export default abstract class HDStore {
    static hdmap = {};

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

    static getHDPictureByKey(key) {
        return Promise.resolve(this.hdmap[key]);
    }

    static getStore() {
        return Promise.resolve(this.hdmap);
    }
}