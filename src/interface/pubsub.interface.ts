import Topic from '../core/topic';
import PSPool from '../core/pspool';

/**
 * @file 通用接口
 */

export default class PubSubAble {
    _pubSub: any;
    _subtokens = [];
    Topic = Topic;

    constructor(ref?) {
        this._pubSub = PSPool.getPSContext(ref);
    }

    /**
     * 订阅
     */
    subscribe(topic, fn) {
        this._subtokens.push(this._pubSub.subscribe(topic, fn));
    }

    /**
     * 异步发布
     */
    publish(topic, data) {
        this._pubSub.publish(topic, data);
    }

    /**
     * 同步发布
     */
    publishSync(topic, data) {
        this._pubSub.publishSync(topic, data);
    }

    /**
     * 清除所有
     */
    clean() {
        this._pubSub.clearAllSubscriptions();
    }

    /**
     * 取消订阅
     */
    unsubscribe(token) {
        this._pubSub.unsubscribe(token);
    }

    dispose() {
        this._subtokens.forEach(token => this._pubSub.unsubscribe(token));
    }
}