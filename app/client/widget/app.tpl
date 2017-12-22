<pano source="/static/webar/assets/source.json"></pano>
{% script %}
    require.async('webar:widget/app.ts', function(App) {
        App['default']();
    });
{% endscript %}