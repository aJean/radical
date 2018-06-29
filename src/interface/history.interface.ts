import PubSub from '../core/pubsub';
import Topic from '../core/topic';
import PubSubAble from './pubsub.interface';
import * as QS from 'query-string';

/**
 * @file simple 历史管理
 */

window.addEventListener('popstate', e => {
    PubSub.publish(Topic.HISTORY.POP, {data: QS.parse(location.search)});
});

const STATE = {bxlhistory: 1};
const SFOPTS = {disableServiceDispatch: true, silent: true};
export default abstract class History extends PubSubAble {
    router: any;

    constructor() {
        super();
        this.subscribe(Topic.HISTORY.POP, this.onPopState.bind(this));
    }

    _makeUrl(data) {
        const params = QS.parse(location.search);
        params.xrkey = data.setId;
        params.sceneid = data.id;

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
        try {
            const url =  this._makeUrl(data);
            this.router ? this.router.redirect(url.search, null, SFOPTS)
                : history.pushState(STATE, null, url.all);
        } catch (e) {}
    }

    replaceState(data) {
        try {
            const url =  this._makeUrl(data);
            this.router ? this.router.reset(url.search, null, SFOPTS)
                : history.replaceState(STATE, null, url.all);
        } catch (e) {}
    }

    getState() {
        return history.state;
    }

    abstract onPopState(topic, payload)

    dispose() {
        super.dispose();
    }
}