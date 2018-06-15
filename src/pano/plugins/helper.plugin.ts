import Util from '../../core/util';
import PluggableUI from '../../interface/ui.interface';

/**
 * @file 辅助工具
 */

export default class Helper extends PluggableUI {
    pano: any;

    constructor(pano) {
        super();

        this.pano = pano;
        this.subscribe(this.Topic.RENDER.PROCESS, () => this.update());

        const circle = this.element = Util.createElement('<div style="position:absolute;width:10px;height:10px;background:#fff;border-radius:10px;z-index:99;border:2px solid red;"></div>');
        this.setContainer(pano.getRoot());
    }

    update() {
        const pano = this.pano;
        let pos = this.pano.getLook();
        // camera to object
        pos.lng -= 180;
        pos.lat -= 90;

        pos = Util.caleSphereToScreen(pos.lng, pos.lat, pano.getCamera(), pano.getSize());
        Util.styleElement(this.element, {
            left: pos.x,
            top: pos.y
        });
    }

    dispose() {
        super.dispose();
    }
}