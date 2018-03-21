<div id="test"></div>
<script src="../lib.js"></script>
<script>
    // start
    bxl.start('./animation.json', '#test', {
        'animation-end': function (data) {
            console.log(data);
        }
    });
</script>