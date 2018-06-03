import Util from '../../core/util';
import PluggableUI from '../interface/ui.class';

/**
 * @file 辅助工具
 */

export default class Helper extends PluggableUI {
    pano: any;

    constructor(pano) {
        super();

        this.pano = pano;
        pano.subscribe('render-process', this.update, this);

        const circle = this.element = Util.createElement('<div style="position:absolute;width:10px;height:10px;background:#fff;border-radius:10px;z-index:99;border:2px solid red;"></div>');
        this.setContainer();
    }

    setContainer() {
        const container = this.container = this.pano.getRoot()
        container.appendChild(this.element);
    }

    update() {
        const pano = this.pano;
        let pos = this.pano.getLook();
        pos.lng -= 180;
        pos.lat -= 90;

        pos = Util.caleSphereToScreen(pos.lng, pos.lat, pano.getCamera(), pano.getSize());
        Util.styleElement(this.element, {
            left: pos.x,
            top: pos.y
        });
    }

    dispose() {
        this.detachContainer();
        this.pano.unsubscribe('render-process', this.update, this);
    }
}