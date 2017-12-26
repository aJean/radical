import Panoram from './app/client/assets/lib/panoram.js';
import Runtime from './app/client/assets/lib/runtime.js';

const panoram = new Panoram({el: '#test'});

panoram.subscribe('animationEnd', animate => {
    console.log(animate);
});
// 覆盖物点击事件
panoram.subscribe('overlayClick', data => {
    if (data.actionType == 'custom') {
        const elem = document.createElement('div');
        elem.innerHTML = 'popup window';
        elem.style.position = 'absolute';
        elem.style.padding = '10px';
        elem.style.color = '#fff';
        elem.style.border = '2px solid #bfc';
        elem.style.background = 'rgba(0, 0, 0, .5)';
        elem.style.left = data.x + 20 + 'px';
        elem.style.top = data.y + 20 + 'px';

        panoram.getRoot().appendChild(elem);
    }
});

// start
Runtime.run(panoram, './source.json');