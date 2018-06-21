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

    initState(state) {
        this.pushState(state);
    }

    pushState(state) {
        try {
            history.pushState(state, null, location.href);
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