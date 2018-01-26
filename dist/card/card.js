let flag = 0;
let oheight;
bxl.start('./card.json', '.scene', {
    'scene-init': function (panoram) {
        const $root = $('.scene');
        // dom placeholder
        const $copy = $('<div class="scene"></div>')
        
        $root.on('click', event => {
            const top = $root.offset().top;
            oheight = oheight || $root.height();

            if (flag) {
                $root.css({
                    transform: 'translate3d(0px, 0px, 0px)',
                    height: oheight
                });
                panoram.setFov(85);
                flag = 0;
            } else {
                $root.css({
                    position: 'fixed',
                    top: top,
                    left: 0
                });
                $root.after($copy);
            
                setTimeout(function() {
                    $root.css({
                        transform: 'translate3d(0px, -' + top + 'px, 0px)',
                        height: window.innerHeight
                    });
                    panoram.setFov(55);
                }, 20);
                flag = 1;
            }
        });
    }
});


