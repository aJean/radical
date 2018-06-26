import PubSubAble from './pubsub.interface';

/**
 * @file simple 历史管理
 */

export default abstract class History extends PubSubAble {
    constructor() {
        super();

        this.onPopstate = this.onPopstate.bind(this);
        window.addEventListener('popstate', this.onPopstate);
    }

    initState(state, url?) {
        this.pushState(state, url);
    }

    pushState(state, url = location.href) {
        try {
            history.pushState(state, null, url);
        } catch (e) {}
    }

    replaceState(state, url = location.href) {
        try {
            history.replaceState(state, null, url);
        } catch (e) {}
    }

    popState() {
        return history.state;
    }

    abstract onPopstate()

    dispose() {
        super.dispose();
        window.removeEventListener('popstate', this.onPopstate);
    }
}