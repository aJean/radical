import AR from '../ar/ar';

/**
 * @file web ar - runtime
 */

export default abstract class Runtime {
    static start(opts) {
        new AR(opts);
    }
}
