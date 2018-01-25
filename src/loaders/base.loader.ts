/**
 * @file resource loader
 * @todo cache, proxy
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

    loadCret(url) {
        cret = this.cret;

        return cret ? cret : (
            cret = this.fetchUrl(url, 'text')
                .then(ret => cret = String(ret).replace(/-*[A-Z\s]*-\n?/g, '').split('~#~'))
        );
    }

    fetchCret() {
        return cret;
    }

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
            xhr.withCredentials = true;
        
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

    clean() {
        this.cache = {};
    }
}