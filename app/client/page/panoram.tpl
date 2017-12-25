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
        .linkButton {
            padding: 5px;
            border-radius: 4px;
            background: #05e61a;
        }
    </style>
{% endblock %}

{% block content %}
    {% widget "webar:widget/app.tpl" %}
{% endblock %}