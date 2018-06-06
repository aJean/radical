/**
 * @file overlay interface defintation 
 */

export interface IPluggableOverlay {
    type: string;
    
    create(): any;

    update(x?: number, y?: number): void;

    show(): void;

    hide(): void;

    dispose(): void;
}

export default class PluggableOverlay {

}