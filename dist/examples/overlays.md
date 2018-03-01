<div id="test"></div>
<script src="../lib.js"></script>
<script>
    // start
    bxl.start('./overlays.json', '#test', {
        'overlay-click': function (data, pano) {
            if (data.actionType == 'custom') {
                const node = document.createElement('div');
                node.className = 'testlabel';
                node.innerHTML = 'popup window';
                node.style.left = data.x + 20 + 'px';
                node.style.top = data.y + 20 + 'px';

                pano.addDomObject(node);
            }
        }
    });
</script>