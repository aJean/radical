<div id="test"></div>
<script src="../lib.js"></script>
<script>
    bxl.start({
        "title": "test bxl transfer",
        "cretPath": "../../assets/cret.pem",
        "info": {
            "author": "视频播放 - 点击播放"
        },
        "sceneGroup": [{
            "id": "scene5",
            "name": "罗浮宫",
            "bxlPath": "../../assets/scene6/scene6.bxl",
            "imgPath": "../../assets/scene6/scene6.jpg",
            "thumbPath": "../../assets/scene6/thumb6.jpg",
            "overlays": [{
                "id": "sintel",
                "type": "video",
                "actionType": "video",
                "src": "../../assets/video/sintel.mp4",
                "img": "../../assets/video/sign.png",
                "location": {
                    "lng": 0,
                    "lat": 0
                }
            }]
        }]
    }, '#test');
</script>