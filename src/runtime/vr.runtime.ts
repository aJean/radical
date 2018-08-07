import createRuntime from './runtime';
import Thru from '../pano/plugins/thru.plugin';
import Info from '../pano/plugins/info.plugin';
import Indicator from '../pano/plugins/indicator.plugin';
import Divider from '../vr/divider.vr';
import Stats from '../pano/plugins/stats.plugin';
import Timeline from '../pano/animations/timeline.animation';
import External from '../core/external';

/**
 * @file wev vr runtime
 */

export default createRuntime('vr', function (vpano, source) {
    // 开场动画
    if (source['animation']) {
        new Timeline().install(source['animation'], vpano);
    } else {
        vpano.noTimeline();
    }
    // 星际穿越, make sure to be first
    if (source['thru']) {
        vpano.addPlugin(Thru, source['thru']);
    }
    // 版权信息
    if (source['info'] !== false) {
        vpano.addPlugin(Info);
    }
    // 旋转指示
    if (source['indicator'] !== false) {
        vpano.addPlugin(Indicator);
    }
    // webvr ui divider
    if (source['vr']) {
        vpano.addPlugin(Divider, source['vr']);
    }
    // 性能监控
    if (source['stats']) {
        vpano.addPlugin(Stats, source['stats']);
    }
    // business plugins
    if (source['plugins']) {
        source['plugins'].forEach(plugin => vpano.addPlugin(plugin.class, plugin.opts, External));
    }
});