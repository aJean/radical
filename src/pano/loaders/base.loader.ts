/**
 * @file resource loader
 * TODO: cache, proxy
 */

const defaultOpts = {
    proxy: '',
    useCache: false
};
let cret;

export default abstract class BaseLoader {
    cret: any;    
    cache: any;
    opts: any;
    abstract loadTexture(url: string, type?): any;

    constructor(opts?) {
        this.cache = {};
        this.opts = Object.assign({}, defaultOpts, opts);
    }

    getSafeUrl(url) {
        return `${this.opts.proxy}${decodeURIComponent(url)}`;
    }
    
    /**
     * 跨域 cdn 请求 bug
     * @param url 
     */
    crosUrl(url) {
        // if (/\.cdn\./.test(url)) {
        //     url += `?_=${Date.now()}`;
        // }
        
        return url;
    }

    loadCret(url) {
        cret = this.cret;

        return cret ? cret : (
            cret = this.fetchUrl(url, 'text')
                .then(ret => cret = String(ret).replace(/-*[A-Z\s]*-\n?/g, '').split('~#~'))
        );
    }

    /**
     * 获取证书
     */
    fetchCret() {
        return cret;
    }

    /**
     * ajax promise
     */
    fetchUrl(url, type?) {
        const cache = this.opts.cache;
        const useCache = this.opts.useCache;

        if (useCache && cache[url]) {
            return cache[url];
        }

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.responseType = type || 'json';
            // xhr.withCredentials = true;
        
            xhr.onload = () => {
                const ret = xhr.response;

                if (useCache) {
                    cache[url] = ret;
                }
                resolve(ret);
            };
            xhr.onerror = e => reject(e);

            xhr.send();
        });
    }

    /**
     * openapi 需要 jsonp 方式调用
     * @param {string} url 
     */
    fetchJsonp(url) {
        const script = document.createElement('script');
        const head = document.head;
        
        script.src = url + '&cb=bxlJsonpCb&_=' + Date.now();
        return new Promise(function (resolve, reject) {
            window['bxlJsonpCb'] = function(res) {
                resolve(res);
                head.removeChild(script);
            };
            head.appendChild(script);
        });
    }

    clean() {
        this.cache = {};
    }
}