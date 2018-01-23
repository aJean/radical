import {CubeTexture, CubeRefractionMapping} from 'three';
import Util from './util';
import Log from './log';

/**
 * @file fetch request
 */

let CREDENTIALS;
export default {
    fetch(url, type?) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.responseType = type || 'json';
            xhr.withCredentials = true;
        
            xhr.onload = () => resolve(xhr.response);
            xhr.onerror = e => reject(e);

            xhr.send();
        });
    },

    /**
     * 加载预览图
     * @param {string} url 资源路径
     * @param {number} timeout 超时时间
     */
    loadPreviewTex(url, timeout?) {
        timeout = timeout || 100000;

        return new Promise((resolve, reject) => {
            const texture = new CubeTexture();
            const image = new Image();
            image.setAttribute('crossOrigin', 'anonymous');

            let count = 0;
            image.onload = function () {
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
            image.src = url;
            setTimeout(timeout, () => resolve('load images timeout'));
        });
    },

    loadCret(url) {
        return CREDENTIALS ? CREDENTIALS : (CREDENTIALS = Promise.resolve(this.fetch(url, 'text')
            .then(ret => CREDENTIALS = String(ret).replace(/-*[A-Z\s]*-\n?/g, '').split('~#~'))));
    },

    /**
     * 加载场景 bxl & 解密
     * @param {string} url 资源路径
     */
    loadSceneTex(url) {
        const requests = [this.fetch(url, 'text'), CREDENTIALS];

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

                return secretData.map((ciphertext, i) => {
                    const start = EOF.line;
                    // find real cipher header
                    const header = ciphertext.substring(0, start);
                    const body = ciphertext.substring(start);

                    return Util.decode(header, key) + body;
                });
            }).catch(e => Log.output('decode failure'));
    }
}