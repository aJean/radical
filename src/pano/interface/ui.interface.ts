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

export interface IAssemblyUI {
    container: HTMLElement;
    
    compose(): void;

    add(): void;

    remove(): void;

    dispose(): void;
}