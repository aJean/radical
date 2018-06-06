import Topic from '../core/topic';
import * as PubSub from 'pubsub-js';

/**
 * @file 通用接口
 */

export default class PubSubAble {
    subtokens = [];
    Topic = Topic;

    subscribe(topic, fn) {
        this.subtokens.push(PubSub.subscribe(topic, fn));
    }

    publish(topic, data) {
        PubSub.publish(topic, data);
    }

    publishSync(topic, data) {
        PubSub.publishSync(topic, data);
    }

    clean() {
        PubSub.clearAllSubscriptions();
    }

    dispose() {
        this.subtokens.forEach(token => PubSub.unsubscribe(token));
    }
}