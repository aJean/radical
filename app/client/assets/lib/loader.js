import {decode} from './util';

/**
 * @file fetch request
 */

export function fetch(url, type?) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = type || 'json';
        xhr.withCredentials = true;
    
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = e => reject(e);

        xhr.send();
    });
}

/**
 * 加载预览图
 * @param {string} path 资源路径
 * @param {number} timeout 超时时间
 */
export function loadPreviewTex(path, timeout) {
    timeout = timeout || 100000;

    return new Promise((resolve, reject) => {
        const texture = new THREE.CubeTexture();
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
                    /* 加载顺序 r l u d f b */
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
                        texture.mapping = THREE.CubeRefractionMapping;
                        texture.needsUpdate = true;

                        /* 触发完成加载preview的事件*/
                        // WebVR.container.dispatchEvent(WebVR.Event.LoadPreviewSuccessEvent);
                        resolve(texture);
                    }
                };
            };
        };
        image.src = path + '/preview.jpg';

        setTimeout(timeout, () => resolve('load images timeout'));
    });
}

/**
 * 加载场景 bxl
 * @param {string} path 资源路径
 */
export function loadSceneTex(path) {
    return Promise.all([fetch(`${path}/images.bxl`, 'text'), fetch(`${path}/images.pem`, 'text')])   
        .then(ret => {
            const data = String(ret[0]).split('~#~').slice(0, 6);
            const secretKey = String(ret[1]).replace(/-*[A-Z\s]*-\n?/g, '');
            // todo: hide secret
            const key = decode(secretKey, 'skt1winsforever');

            return data.map(ciphertext => decode(ciphertext, key));
        });
}
