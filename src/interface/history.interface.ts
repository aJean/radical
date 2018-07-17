import PubSubAble from './pubsub.interface';
import * as QS from 'query-string';

/**
 * @file simple 历史管理
 */

const STATE = {bxlhistory: 1};
const SFOPTS = {disableServiceDispatch: true, silent: true};
export default abstract class History extends PubSubAble {
    router: any;

    constructor() {
        super();

        const Topic = this.Topic;
        window.addEventListener('popstate', e => this.publish(Topic.HISTORY.POP, {data: QS.parse(location.search)}));
        this.subscribe(Topic.HISTORY.POP, this.onPopState.bind(this));
    }

    /**
     * 改造必要的 location.search
     * data.setName 是为 nextpage 定制
     * @param {Object} data
     */
    _makeUrl(data) {
        const params = QS.parse(location.search);
        params.xrkey = data.setId;
        params.sceneid = data.id;
        params.setname = data.setName && encodeURIComponent(data.setName);

        return {
            all: `//${location.host}${location.pathname}?${QS.stringify(params)}`,
            search: `?${QS.stringify(params)}`
        };
    }

    _setRouter(router) {
        this.router = router;
    }

    initState(data) {
        this.replaceState(data);
    }

    pushState(data) {
        const url =  this._makeUrl(data);
        this.router ? this.router.redirect(url.search, null, SFOPTS)
            : history.pushState(STATE, null, url.all);
    }

    replaceState(data) {
        const url =  this._makeUrl(data);
        this.router ? this.router.reset(url.search, null, SFOPTS)
            : history.replaceState(STATE, null, url.all);
    }

    exhaustState() {
        if (this.router) {
            this['opts'].history = false;
            this.publish(this.Topic.HISTORY.END, null);
        } else {
            window.location.replace(document.referrer || 'about:blank');
        }
    }

    /**
     * 外部有机会控制历史纪录
     * @param {string} surl 来源
     * @param {string} furl 跳转
     */
    _releaseState(len, surl, furl) {
        if (len >= 0 && surl) {
            this['opts'].history = false;
            len === 0 ? history.back() : window.history.go(-(len + 1));
        } else {
            window.location.assign(furl);
        }
    }

    getState() {
        return history.state;
    }

    abstract onPopState(topic, payload)

    dispose() {
        super.dispose();
    }
}