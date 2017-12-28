/**
 * @file fis3 配置
 */

fis.set('namespace', 'webar');
fis.set('livereload.port', 35729);
// 屏蔽静态文件
fis.set('project.ignore', ['fis.yml', 'package.json', 'upload.py', 'BCLOUD', 'GIT_COMMIT', 'fis-conf.js', 'output/**', 'typings/**']);
// client: es6 -> es5
fis.match('client/assets/lib/{**.ts,**.tsx,**.js}', {
    parser: fis.plugin('typescript', {
        module: 1,
        target: 1
    }),
    isJsXLike: true,
    isMod: true
});

fis.match('client/widget/{**.ts,**.tsx,**.js}', {
    parser: fis.plugin('typescript', {
        module: 1,
        target: 1
    }),
    isJsXLike: true,
    isMod: true
});

fis.match('/client/assets/lib/**.js', {
    packTo: '/static/pkg/webar.js'
});

fis.match('/client/assets/lib/**.less', {
    packTo: '/static/pkg/webar.css'
});

fis.media('otp').match('*', {
    useHash: false,
    useSprite: false,
    optimizer: null,
    deploy: fis.plugin('http-push', {
        receiver: 'http://skt2.image-node.otp.baidu.com/yog/upload',
        to: '/'
    })
});

fis.media('prod').match('/client/**', {
    domain: ['//imgn0.bdstatic.com/image/mobile/n',
        '//imgn1.bdstatic.com/image/mobile/n',
        '//imgn2.bdstatic.com/image/mobile/n']
}).match('/static/**', {
    domain: ['//imgn0.bdstatic.com/image/mobile/n',
        '//imgn1.bdstatic.com/image/mobile/n',
        '//imgn2.bdstatic.com/image/mobile/n']
}).match('/static/pkg/**', {
    useHash: true
}).match('*.tpl', {
    domain: false
}).match('*.sh', {
    release: false
}).match('*.py', {
    release: false
});
    
