import {CubeTexture, CubeTextureLoader, CubeRefractionMapping} from 'three';
import HttpLoader from './http.loader';
import Log from '../core/log';
import {rDecipher, rEOF} from './decipher';

/**
 * @file 资源加载器, 支持 6 in 1 预览, .r, image 三种格式
 */

const cubeLoader = new CubeTextureLoader();
export default class ResourceLoader extends HttpLoader {
    /**
     * 加载 .r 格式
     */
    loadR(url) {
        const requests = [this.fetchUrl(url, 'text'), this.fetchCret()];

        return Promise.all(requests)
            .then(ret => {
                const list = String(ret[0]).split('~#~');
                const secretData = list.slice(0, 6);
                const secretKey = ret[1];

                if (!secretKey) {
                    throw new Error('incorrect cret key');
                }

                const key = rDecipher(secretKey[0], 0xf);
                const EOF = rEOF(rDecipher(secretKey[1], 0xe));

                if (!EOF.pass) {
                    throw new Error('incorrect product domian');
                }

                const base64s = secretData.map((ciphertext, i) => {
                    const start = EOF.line;
                    // find real cipher header
                    const header = ciphertext.substring(0, start);
                    const body = ciphertext.substring(start);

                    return rDecipher(header, key) + body;
                });
                
                return new Promise((resolve, reject) => cubeLoader.load(base64s, tex => resolve(tex), null, e => reject(e)));
            }).catch(e => Log.output(e));
    }

    /**
     * 加载 6 张复合顺序和命名的图
     * attach order: right -> left -> up -> down -> front -> back
     * @param {string} url
     * @param {string} suffix 资源后缀
     */
    loadCube(url, suffix = '') {
        url = url.replace(/\/$/, '');
        const urls = ['r', 'l', 'u', 'd', 'f', 'b'].map(name => this.crosUrl(`${url}/mobile_${name}.jpg${suffix}`));

        return new Promise((resolve, reject) => {
            cubeLoader.load(urls, tex => resolve(tex), null, e => reject(e));
        }).catch(e => Log.output(e));
    }

    /**
     * 加载图片数组
     */
    loadArray(url, suffix = '') {
        url = url.replace(/\/$/, '');
        const urls = ['r', 'l', 'u', 'd', 'f', 'b'].map(name => this.crosUrl(`${url}/mobile_${name}.jpg${suffix}`));

        return Promise.resolve(urls.map(url => {
            const img = new Image();
            img.src = url;
            return img;
        }));
    }

    /**
     * canvas 切分预览图
     * @param {string} url 
     */
    loadCanvas(url) {
        return cutByCanvas(this.crosUrl(url)); 
    }

    /**
     * 多种方式加载贴图
     * @param {string} url 
     * @param {string} suffix 
     */
    loadTexture(url, suffix?) {
        return /\.r$/.test(url) ? this.loadR(this.crosUrl(url)) : this.loadCube(url, suffix);
    }
}

/**
 * 加载预览图, canvas cut
 */
function cutByCanvas(url, timeout?) {
    return new Promise((resolve, reject) => {
        const texture = new CubeTexture();
        const preview = new Image();
        preview.crossOrigin = 'anonymous';

        let count = 0;
        preview.onload = () => {
            const size = preview.width;

            for (let i = 0; i < 6; i++) {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                const img = new Image();

                canvas.height = size;
                canvas.width = size;
                context.drawImage(preview, 0, size * i, size, size, 0, 0, size, size);
                
                img['index'] = i;
                img.onload = function () {
                    switch (this['index']) {
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

                    if (++count === 6) {
                        texture.needsUpdate = true;
                        resolve(texture);
                    }
                };
                img.src = canvas.toDataURL('image/jpeg');
            };
        };
        
        preview.onerror = () => reject('load preview error');
        preview.src = url;
        setTimeout(timeout || 100000, () => reject('load preview timeout'));
    }).catch(e => Log.output(e));
}