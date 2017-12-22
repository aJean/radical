import Runtime from '../assets/lib/runtime';
import Panoram from '../assets/lib/panoram';

export default function init() {
    const panoram = new Panoram({el: 'pano'});
    panoram.subscribe('animationEnd', animate => {
        console.log(animate);
    });

    // bind event
    Runtime.run(panoram, '/static/webar/assets/source.json');
}