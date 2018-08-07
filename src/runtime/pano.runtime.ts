import createRuntime from './runtime';
import Timeline from '../pano/animations/timeline.animation';
import Info from '../pano/plugins/info.plugin';
import Indicator from '../pano/plugins/indicator.plugin';
import Rotate from '../pano/plugins/rotate.plugin';
import Multiple from '../pano/plugins/multiple.plugin';
import Wormhole from '../pano/plugins/wormhole.plugin';
import Thru from '../pano/plugins/thru.plugin';
import Media from '../pano/plugins/media.plugin';
import Helper from '../pano/plugins/helper.plugin';
import Stats from '../pano/plugins/stats.plugin';

/**
 * @file web pano runtime
 */

export default createRuntime('pano', function (pano, source) {
    if (source['animation']) {
        new Timeline().install(source['animation'], pano);
    } else {
        pano.noTimeline();
    }

    if (source['thru']) {
        pano.addPlugin(Thru, source['thru']);
    }

    if (source['rotate']) {
        pano.addPlugin(Rotate, source['rotate']);
    }

    if (source['multiScene']) {
        pano.addPlugin(Multiple, source['sceneGroup']);
    }

    if (source['info'] !== false) {
        pano.addPlugin(Info);
    }

    if (source['indicator'] !== false) {
        pano.addPlugin(Indicator);
    }

    if (source['wormhole']) {
        pano.addPlugin(Wormhole, source['wormhole']);
    }

    if (source['media']) {
        pano.addPlugin(Media, source['media']);
    }

    if (source['helper']) {
        pano.addPlugin(Helper, source['helper']);
    }
    // 性能监控
    if (source['stats']) {
        pano.addPlugin(Stats, source['stats']);
    }
});
