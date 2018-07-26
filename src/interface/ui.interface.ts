import PubSubAble from './pubsub.interface';

/**
 * @file ui interface defintation 
 */

export interface IPluggableUI {
    container: any;
    element: any;

    getElement(): HTMLElement;

    setContainer(container: HTMLElement): void;

    show(): void;

    hide(): void;

    dispose(): void;
}

export default class PluggableUI extends PubSubAble implements IPluggableUI {
    container: any;
    element: any;

    getElement() {
        return this.element;
    }

    setContainer(container: HTMLElement) {
        this.container = container;
        container.appendChild(this.element);
    }

    detachContainer() {
        this.container && this.container.removeChild(this.element);
    }

    setOpacity(opacity) {
        this.element.style.opacity = opacity;
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }

    dispose() {
        this.detachContainer();
        super.dispose();
    }
}