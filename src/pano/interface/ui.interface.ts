/**
 * @file ui interface defintation 
 */

export interface IPluggableUI {
    container: HTMLElement;

    getElement(): HTMLElement;

    setContainer(container: HTMLElement): void;

    show(): void;

    hide(): void;

    dispose(): void;
}