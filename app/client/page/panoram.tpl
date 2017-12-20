{% extends 'webar:page/layout.tpl' %}

{% block resource %}
    {% require "webar:assets/aes.js" %}
    {% require "webar:assets/three.js" %}
    
    <style>
        body {
            padding: 0px;
            margin: 0px;
            overflow: hidden;
            background: #000;
        }
    </style>
{% endblock %}

{% block content %}
    <pano source="/static/webar/assets/source.json"></pano>
    {% script %}
        require.async('webar:assets/lib/panoram.js', function(Panrom) {
            var panrom = new Panrom['default']({el: 'pano'});
            panrom.run('/static/webar/assets/source.json');
        });
    {% endscript %}
{% endblock %}