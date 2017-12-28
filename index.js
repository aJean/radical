import './app/client/assets/lib/plugin/multiple.style.less';
import './app/client/assets/lib/plugin/overlay.style.less';

import Panoram from './app/client/assets/lib/panoram.js';
import Runtime from './app/client/assets/lib/runtime.js';

const panoram = new Panoram({el: '#test'});
let testDom;

panoram.subscribe('animationEnd', animate => {
    console.log(animate);
});
// 覆盖物点击事件
panoram.subscribe('overlayClick', data => {
    if (data.actionType == 'custom' && !testDom) {
        testDom = document.createElement('div');
        testDom.className = 'testlabel';
        testDom.innerHTML = 'popup window';
        testDom.style.left = data.x + 20 + 'px';
        testDom.style.top = data.y + 20 + 'px';

        panoram.getRoot().appendChild(testDom);
    }
});

// start
Runtime.run(panoram, './source.json');