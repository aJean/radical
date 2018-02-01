import {CubeTexture, CubeTextureLoader, CubeRefractionMapping} from 'three';
import BaseLoader from './base.loader';
import Util from '../util';
import Log from '../log';

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
     * @param {string} url 
     */
    loadImage(url) {
        const urls = ['r', 'l', 'u', 'd', 'f', 'b'].map(name => `${url}/texture_${name}.jpg`);

        return new Promise((resolve, reject) => {
            cubeLoader.load(urls, tex => resolve(tex), null, e => reject(e));
        }).catch(e => Log.output(e));
    }

    /**
     * 多种方式加载贴图
     * @param {string} url 
     * @param {string} type 
     */
    loadTexture(url, type?) {
        if (type == 'canvas') {
            return loadCanvas(url); 
        } else if (type == 'bxl' || /\.bxl$/.test(url)) {
            return this.loadBxl(url);
        } else {
            return this.loadImage(url);
        }
    }
}

// 加载预览图, 使用 canvas 切分成 6 张
function loadCanvas(url, timeout?) {
    timeout = timeout || 100000;

    return new Promise((resolve, reject) => {
        const texture = new CubeTexture();
        const image = new Image();
        image.setAttribute('crossOrigin', 'anonymous');

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
                    // attach order: right -> left -> up -> down -> front -> back
                    switch (this['idx']) {
                        case 0:
                            texture.images[1] = this;
                            break;
                        case 1:
                            texture.images[4] = this;
                            break;
                        case 2:
                            texture.images[0] = this;
                            break;
                        case 3:
                            texture.images[5] = this;
                            break;
                        case 4:
                            texture.images[2] = this;
                            break;
                        case 5:
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