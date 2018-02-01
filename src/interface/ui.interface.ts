/**
 * @file ui interface defintation 
 */

export interface IPluggableUi {
    container: HTMLElement;

    getElement(): HTMLElement;

    appendTo(container: HTMLElement): void;

    show(): void;

    hide(): void;

    dispose(): void;
}

export interface IAssemblyUi {

}