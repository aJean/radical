<div id="test"></div>
<script src="../../dist/lib.js"></script>
<script>
    const json = {
        title: 'test bxl transfer',
        cretPath: '../assets/cret.txt',
        media: {
            asrc: '../assets/video/astar.mp3',
            vsrc: '../assets/video/sintel.mp4',
            aauto: false
        },
        sceneGroup: [{
            info: {
                author: '视频播放 - 点击播放'
            },
            id: '49775931288',
            name: '罗浮宫',
            bxlPath: '../assets/scene6/scene6.bxl',
            imgPath: '../assets/scene6/scene6.jpg',
            thumbPath: '../assets/scene6/thumb6.jpg'
        }]
    };

    bxl.startPano(json, '#test', {
        'overlay-click': function (data) {
            console.log(data);
        }
    });
</script>