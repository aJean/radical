<div id="test" ref="mytest" style="margin-right:175px;"></div>
<div class="overlay-panel">
    <p><button class="add">添加 overlay</button></p>
    <div class="show-point">
        <p>点击 lng: <span></span></p>
        <p>点击 lat: <span></span></p>
    </div>
    <p><button class="lookat">获取相机角度</button></p>
    <div class="show-lookat">
        <p>相机 lng: <span></span></p>
        <p>相机 lat: <span></span></p>
    </div>
</div>
<script src="../zepto.js"></script>
<script src="../lib.js"></script>
<script>
    let pos;
    bxl.start('./add.json', '#test', {
        'pano-click': function (data) {
            pos = data;
            $('.show-point span').first().html(data.lng.toFixed(2));
            $('.show-point span').last().html(data.lat.toFixed(2));
        }
    });

    $('.overlay-panel .add').on('click', function () {
        const pano = bxl.getPano('mytest');
        pos && pano.addOverlay({
            'overlays': [{
                type: 'dom',
                actionType: 'custom',
                content: '<strong>动态热点</strong>',
                location: pos
            }]
        });
        });

        $('.overlay-panel .lookat').on('click', function () {
            const pano = bxl.getPano('mytest');
            const point = pano.getLook();

            $('.show-lookat span').first().html(point.lng.toFixed(2));
            $('.show-lookat span').last().html(point.lat.toFixed(2));
        });
</script>