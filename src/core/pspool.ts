/**
 * @file create pubsub
 * 执行 runtime 时创建, 保证每一个 context 的隔离性
 */

const create = () => {
    const PubSub: any = {};
    let messages = {};
    let lastUid = -1;

    function hasKeys(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns a function that throws the passed exception, for use as argument for setTimeout
     * @param { Object } ex An Error object
     */
    function throwException(ex) {
        return function reThrowException() {
            throw ex;
        };
    }

    function callSubscriberWithDelayedExceptions(subscriber, message, data) {
        try {
            subscriber(message, data);
        } catch (ex) {
            setTimeout(throwException(ex), 0);
        }
    }

    function callSubscriberWithImmediateExceptions(subscriber, message, data) {
        subscriber(message, data);
    }

    function deliverMessage(originalMessage, matchedMessage, data, immediateExceptions) {
        const subscribers = messages[matchedMessage];
        const callSubscriber = immediateExceptions ? callSubscriberWithImmediateExceptions : callSubscriberWithDelayedExceptions;

        if (!messages.hasOwnProperty(matchedMessage)) {
            return;
        }

        for (let s in subscribers) {
            if (subscribers.hasOwnProperty(s)) {
                callSubscriber(subscribers[s], originalMessage, data);
            }
        }
    }

    function createDeliveryFunction(message, data, immediateExceptions) {
        return function deliverNamespaced() {
            let topic = String(message);
            let position = topic.lastIndexOf('.');

            // deliver the message as it is now
            deliverMessage(message, message, data, immediateExceptions);

            // trim the hierarchy and deliver message to each level
            while (position !== -1) {
                topic = topic.substr(0, position);
                position = topic.lastIndexOf('.');
                deliverMessage(message, topic, data, immediateExceptions);
            }
        };
    }

    function messageHasSubscribers(message) {
        let topic = String(message);
        let found = Boolean(messages.hasOwnProperty(topic) && hasKeys(messages[topic]));
        let position = topic.lastIndexOf('.');

        while (!found && position !== -1) {
            topic = topic.substr(0, position);
            position = topic.lastIndexOf('.');
            found = Boolean(messages.hasOwnProperty(topic) && hasKeys(messages[topic]));
        }

        return found;
    }

    function publish(message, data, sync, immediateExceptions) {
        const deliver = createDeliveryFunction(message, data, immediateExceptions);
        const hasSubscribers = messageHasSubscribers(message);

        if (!hasSubscribers) {
            return false;
        }

        if (sync === true) {
            deliver();
        } else {
            setTimeout(deliver, 0);
        }

        return true;
    }

    /**
     *	Publishes the the message, passing the data to it's subscribers
     *	- message (String): The message to publish
     *	- data: The data to pass to subscribers
     */
    PubSub.publish = function (message, data) {
        return publish(message, data, false, PubSub.immediateExceptions);
    };

    /**
     *	Publishes the the message synchronously, passing the data to it's subscribers
     *	- message (String): The message to publish
     *	- data: The data to pass to subscribers
     */
    PubSub.publishSync = function (message, data) {
        return publish(message, data, true, PubSub.immediateExceptions);
    };

    /**
     *  Subscribes the passed function to the passed message
     *	- message (String): The message to subscribe to
     *	- func (Function): The function to call when a new message is published
     */
    PubSub.subscribe = function (message, func) {
        if (typeof func !== 'function') {
            return false;
        }

        // message is not registered yet
        if (!messages.hasOwnProperty(message)) {
            messages[message] = {};
        }

        // forcing token as String, to allow for future expansions without breaking usage
        // and allow for easy use as key names for the 'messages' object
        const token = 'uid_' + String(++lastUid);
        messages[message][token] = func;

        // return token for unsubscribing
        return token;
    };

    /**
     *	Subscribes the passed function to the passed message once
     *	- message (String): The message to subscribe to
     *	- func (Function): The function to call when a new message is published
     */
    PubSub.subscribeOnce = function (message, func) {
        const token = PubSub.subscribe(message, function () {
            // before func apply, unsubscribe message
            PubSub.unsubscribe(token);
            func.apply(this, arguments);
        });
        return PubSub;
    };

    /**
     * Public: Clears all subscriptions
     */
    PubSub.clearAllSubscriptions = function clearAllSubscriptions() {
        messages = {};
    };

    /**
     * Public: Clear subscriptions by the topic
     */
    PubSub.clearSubscriptions = function clearSubscriptions(topic) {
        for (let m in messages) {
            if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0) {
                delete messages[m];
            }
        }
    };

    /**
     * Public: removes subscriptions.
     * When passed a token, removes a specific subscription.
     * When passed a function, removes all subscriptions for that function
     * When passed a topic, removes all subscriptions for that topic (hierarchy)
     *
     * value - A token, function or topic to unsubscribe.
     *
     * Examples
     *		// Example 1 - unsubscribing with a token
     *		var token = PubSub.subscribe('mytopic', myFunc);
     *		PubSub.unsubscribe(token);
     *
     *		// Example 2 - unsubscribing with a function
     *		PubSub.unsubscribe(myFunc);
     *
     *		// Example 3 - unsubscribing a topic
     *		PubSub.unsubscribe('mytopic');
     */
    PubSub.unsubscribe = function (value) {
        const descendantTopicExists = function (topic) {
            for (let m in messages) {
                if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0) {
                    return true;
                }
            }
            return false;
        };
        const isTopic = typeof value === 'string' && (messages.hasOwnProperty(value) || descendantTopicExists(value));
        const isToken = !isTopic && typeof value === 'string';
        const isFunction = typeof value === 'function';
        let result = false;

        if (isTopic) {
            PubSub.clearSubscriptions(value);
            return;
        }

        for (let m in messages) {
            if (messages.hasOwnProperty(m)) {
                let message = messages[m];

                if (isToken && message[value]) {
                    delete message[value];
                    result = value;
                    // tokens are unique, so we can just stop here
                    break;
                }

                if (isFunction) {
                    for (let t in message) {
                        if (message.hasOwnProperty(t) && message[t] === value) {
                            delete message[t];
                            result = true;
                        }
                    }
                }
            }
        }

        return result;
    };

    return PubSub;
};

let current;
const poolMap = {};

export default {
    /**
     * invoke before pano create
     */
    createPSContext(ref) {
        poolMap[ref] = current = create();
    },

    /**
     * get context
     * 动态获时取需要传入 ref, 确保取得正确的 context
     */
    getPSContext(ref?) {
        return ref ? poolMap[ref] : current;
    },

    getPool() {
        return poolMap;
    },

    dispose() {
        for (let ref in poolMap) {
            poolMap[ref].clearAllSubscriptions();
        }
    }
}