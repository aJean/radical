<script src="../require.js"></script>
<div id="test"></div>
<script>
    requirejs.config({
　　     paths: {"bxl": "../lib"}
　　 });
    requirejs(['bxl'], function (bxl) {
        bxl.start('./amd.json', '#test');
    });
</script>