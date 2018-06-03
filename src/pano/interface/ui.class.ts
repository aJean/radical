import { IPluggableUI } from './ui.interface';

export default class PluggableUI implements IPluggableUI {
    container: any;
    element: any;

    getElement() {
        return this.element;
    }

    setContainer(container: HTMLElement) {

    }

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
    }
}