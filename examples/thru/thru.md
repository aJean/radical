<div id="test"></div>
<script src="../assets/zepto.js"></script>
<script src="../../dist/lib.js"></script>
<script>
    $.ajax({
        url: 'http://bjyz-newmedia07.epc.baidu.com:8080/img/image/quanjing/bxlpanoinfo?setid=17373537212767040097',
        success: function(res) {
            const data = res.data;
            data.multiScene = true;
            data.pano = {
                fovTrans: true,
                sceneTrans: true
            };

            bxl.startPano(data, '#test', {
                'overlay-click': function (data) {
                    console.log(data);
                }
            });
        }
    });
</script>