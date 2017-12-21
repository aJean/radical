/**
 * @file 雨雪特效组件
 * @author liwenhui(liwenhui01@baidu.com)
 */
/* globals THREE WebVR*/
define(function () {
    var create = function (opt) {
        var texPath = opt.texPath;
        var size = opt.size;
        var sceneName = opt.sceneName | '';
        var spriteCount = opt.spriteCount;
        var scene = opt.scene;
        var speed = opt.speed | 3;
        var colorR = opt.colorR || 0.3;
        var colorG = opt.colorG || 0.3;
        var colorB = opt.colorB || 0.3;
        var THREE = opt.three;

        var geometry = new THREE.Geometry();
        var textureLoader = new THREE.TextureLoader();
        var spriteTex = textureLoader.load(texPath);
        var color = [colorR, colorG, colorB];
        for (var i = 0; i < spriteCount; i++) {
            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 1400 - 700;
            vertex.y = Math.random() * 1400 - 700;
            vertex.z = Math.random() * 1400 - 700;
            geometry.vertices.push(vertex);
        }

        var materials = new THREE.PointsMaterial({
            size: size,
            map: spriteTex,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            side: THREE.DoubleSide
        });
        materials.color.setRGB(color[0], color[1], color[2]);

        var particles = new THREE.Points(geometry, materials);
        particles.name = sceneName;
        scene.add(particles);
        this.update = function () {
            var position;
            for (i = 0; i < particles.geometry.vertices.length; i++) {
                position = particles.geometry.vertices[i];
                particles.geometry.vertices[i].x = position.x - 0.2 * (Math.random() - 0.5);
                position.y = position.y < -700 ? 700 : position.y;
                particles.geometry.vertices[i].y = position.y - speed;
                particles.geometry.vertices[i].z = position.z - 0.2 * (Math.random() - 0.5);
            }
            particles.geometry.verticesNeedUpdate = true;
        };
    };
    return {
        create: create
    };
});