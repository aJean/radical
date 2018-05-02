<div id="test"></div>
<script src="./webvr.polyfill.js"></script>
<script src="../../dist/lib.js"></script>
<script>
    bxl.startVR({
        title: 'test bxl transfer',
        cretPath: '../assets/cret.txt',
        sceneGroup: [{
            info: {
                author: '绵阳谊君舞蹈',
                logo: '../assets/logo.png'
            },
            id: 'scene0',
            name: '罗浮宫',
            bxlPath: '../assets/scene0/scene0.bxl',
            imgPath: '../assets/scene0/scene0.jpg',
            thumbPath: '../assets/scene0/thumb0.jpg'
        }]
    }, '#test');
</script>