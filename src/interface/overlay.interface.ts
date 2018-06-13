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

export default abstract class PluggableOverlay implements IPluggableOverlay {
    type: string;
    particle: any;
    data: any;

    abstract create();

    abstract update(x?: number, y?: number): void;

    show() {
        this.particle.visible = true;
    }

    hide() {
        this.particle.visible = false;
    }

    dispose() {
        const particle = this.particle;

        delete particle['instance'];
        particle.geometry.dispose();
        particle.material.map.dispose();
        particle.material.dispose();
    }
}