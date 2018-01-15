const staticDIR = '/home/work/odp/webroot/static/bxl';
const url = 'http://bjyz-newmedia06.epc.baidu.com:8210';

// 定义上传方法
function push(receiver, to) {
    return fis.plugin('http-push', {
        host: receiver,
        to: to
    });
}

fis.set('namespace', 'bxl');
fis.set('project.ignore', ['package.json', 'package-lock.json', 'tsconfig.json', 'npm-debug.log', 'build.sh', 'BCLOUD', 'GIT_COMMIT', 'fis-conf.js', 'typings/**', 'output/**', 'receiver.js', 'node_modules/**']);

fis.media('remote').match('/dist/(**.{html,js,json,css,bxl,pem,png,jpg})', {
    optimizer: null,
    useHash: false,
    deploy: push(url, staticDIR),
    release: '/$1',
    url: '/static/bxl/$1'
});