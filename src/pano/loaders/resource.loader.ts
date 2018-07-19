import {CubeTexture, CubeTextureLoader, CubeRefractionMapping} from 'three';
import BaseLoader from './base.loader';
import Util from '../../core/util';
import Log from '../../core/log';

/**
 * @file 资源加载器, 支持预览, bxl, image 三种格式
 */

const cubeLoader = new CubeTextureLoader();
class ResourceLoader extends BaseLoader {
    loadBxl(url) {
        const requests = [this.fetchUrl(url, 'text'), this.fetchCret()];

        return Promise.all(requests)
            .then(ret => {
                const list = String(ret[0]).split('~#~');
                const secretData = list.slice(0, 6);
                const secretKey = ret[1];

                const key = Util.decode(secretKey[0], 0xf);
                const EOF = Util.parseEOF(Util.decode(secretKey[1], 0xe));

                if (!EOF.pass) {
                    throw new Error('incorrect product domian');
                }

                const base64s = secretData.map((ciphertext, i) => {
                    const start = EOF.line;
                    // find real cipher header
                    const header = ciphertext.substring(0, start);
                    const body = ciphertext.substring(start);

                    return Util.decode(header, key) + body;
                });
                
                return new Promise((resolve, reject) => {
                    cubeLoader.load(base64s, tex => resolve(tex), null, e => reject(e));
                });
            }).catch(e => Log.output(e));
    }

    /**
     * 加载 6 张复合顺序和命名的图
     * attach order: right -> left -> up -> down -> front -> back
     * @param {string} url
     * @param {string} suffix 资源后缀
     */
    loadImage(url, suffix = '') {
        url = url.replace(/\/$/, '');
        const urls = ['r', 'l', 'u', 'd', 'f', 'b'].map(name => this.crosUrl(`${url}/mobile_${name}.jpg${suffix}`));

        return new Promise((resolve, reject) => {
            cubeLoader.load(urls, tex => resolve(tex), null, e => reject(e));
        }).catch(e => Log.output(e));
    }

    /**
     * canvas 切分预览图
     * @param {string} url 
     */
    loadCanvas(url) {
        return cutCanvas(this.crosUrl(url)); 
    }

    /**
     * 多种方式加载贴图
     * @param {string} url 
     * @param {string} suffix 
     */
    loadTexture(url, suffix?) {
        if (/\.bxl$/.test(url)) {
            return this.loadBxl(this.crosUrl(url));
        } else {
            return this.loadImage(url, suffix);
        }
    }
}

/**
 * 加载预览图, canvas cut
 */
function cutCanvas(url, timeout?) {
    timeout = timeout || 100000;

    return new Promise((resolve, reject) => {
        const texture = new CubeTexture();
        const image = new Image();
        image.crossOrigin = 'anonymous';

        let count = 0;
        image.onload = () => {
            let canvas;
            let context;
            const tileWidth = image.width;

            for (var i = 0; i < 6; i++) {
                canvas = document.createElement('canvas');
                context = canvas.getContext('2d');
                canvas.height = tileWidth;
                canvas.width = tileWidth;
                context.drawImage(image, 0, tileWidth * i, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth);
                
                var subImage = new Image();
                subImage.src = canvas.toDataURL('image/jpeg');
                subImage['idx'] = i;
                subImage.onload = function () {
                    count++;
                    switch (this['idx']) {
                        case 0: // left
                            texture.images[1] = this;
                            break;
                        case 1: // front
                            texture.images[4] = this;
                            break;
                        case 2: // right
                            texture.images[0] = this;
                            break;
                        case 3: // back
                            texture.images[5] = this;
                            break;
                        case 4: // up
                            texture.images[2] = this;
                            break;
                        case 5: // down
                            texture.images[3] = this;
                            break;
                    }

                    if (count === 6) {
                        texture.mapping = CubeRefractionMapping;
                        texture.needsUpdate = true;
                        resolve(texture);
                    }
                };
            };
        };
        
        image.onerror = () => reject('load preview error');
        image.src = url;
        setTimeout(timeout, () => reject('load preview timeout'));
    }).catch(e => Log.output(e));
}

export default ResourceLoader;