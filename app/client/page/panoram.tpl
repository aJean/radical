{% extends 'webar:page/layout.tpl' %}

{% block resource %}
    {% require "webar:assets/three.js" %}
    {% require "webar:assets/lib.js" %}
    
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
{% endblock %}