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
export default abstract class History extends PubSubAble {
    constructor() {
        super();
        this.subscribe(Topic.HISTORY.POP, this.onPopState.bind(this));
    }

    _makeUrl(data) {
        const params = QS.parse(location.search);
        params.xrkey = data.setId;
        params.sceneid = data.id;

        return `//${location.host}${location.pathname}?${QS.stringify(params)}`;
    }

    initState(data) {
        this.replaceState(data);
    }

    pushState(data) {
        try {
            history.pushState(STATE, null, this._makeUrl(data));
        } catch (e) {}
    }

    replaceState(data) {
        try {
            history.replaceState(STATE, null, this._makeUrl(data));
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