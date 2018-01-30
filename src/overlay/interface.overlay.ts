/**
 * @file overlay interface defintation 
 */

export interface IPluggableOverlay {
    create(): any;

    update(x?: number, y?: number): void;

    show(): void;

    hide(): void;

    dispose(): void;
}