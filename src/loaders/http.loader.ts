import mockData from './mock';

/**
 * @file resource loader
 * TODO: 实现 cache, proxy
 */

const defaultOpts = {proxy: '', useCache: false};
export default abstract class HttpLoader {
    static cret: any;    
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
     */
    crosUrl(url) {
        // if (/\.cdn\./.test(url)) {
        //     url += `?_=${Date.now()}`;
        // }
        
        return url;
    }


    /**
     * 加载证书, 每个应用只会请求一次
     */
    loadCret(url) {
        const cret = HttpLoader.cret;

        return cret ? cret : (
            HttpLoader.cret = this.fetchUrl(url, 'text')
                .then(ret => HttpLoader.cret = String(ret).replace(/-*[A-Z\s]*-\n?/g, '')
                .split('~#~'))
        );
    }

    /**
     * 获取证书
     */
    fetchCret() {
        return HttpLoader.cret;
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
        
        script.src = url + '&cb=rJsonpCb&_=' + Date.now();
        return new Promise(function (resolve, reject) {
            window['rJsonpCb'] = function(res) {
                resolve(res);
                head.removeChild(script);
            };
            head.appendChild(script);
        });
    }

    /**
     * 模拟数据, 还不完善
     */
    fetchMock() {
        return Promise.resolve(mockData.Result[0].DisplayData.resultData.tplData);
    }

    clean() {
        this.cache = {};
    }
}