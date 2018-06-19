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
        return img;
    }

    static getHDPictureByKey(key) {
        return this.hdmap[key];
    }

    static getStore() {
        return this.hdmap;
    }
}