import PubSubAble from './common.interface';

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

    setContainer(container: HTMLElement) {}

    detachContainer() {
        this.container.removeChild(this.element);
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