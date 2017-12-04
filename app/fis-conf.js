/**
 * @file FIS 配置
 * @author
 */

fis.set('namespace', 'webar');
fis.set('livereload.port', 35729);
// 屏蔽静态文件
fis.set('project.ignore', ['fis.yml', 'package.json', 'upload.py', 'BCLOUD', 'GIT_COMMIT', 'fis-conf.js', 'output/**', 'client/node_modules/**']);
// client: es6 -> es5
fis.match('client/{**.ts,**.tsx,**.jsx,**.es}', {
    parser: fis.plugin('typescript', {
        module: 1,
        target: 1
    })
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
    
