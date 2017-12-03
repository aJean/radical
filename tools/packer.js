const path = require('path');
const fs = require('fs');

/**
 * @file img binary package
 */

let dirPath = process.argv.splice(2)[0];
let status = 0;

if (!dirPath) {
    errorLog('no input files');
}

function errorLog(msg) {
    console.log('\x1B[31m', `error: ${msg}`);
}

function normalizePath(filePath) {
    filePath = filePath.replace(/^\.\//, '');
    filePath = filePath.replace(/\/$/, '');
    
    return `${path.resolve('./')}/${filePath}`;
}

function packageFile(filePath) {
    fs.readFile(dirPath + filePath, (err, data) => {
        const encodePath = dirPath + '/assets.bxl';
        const encodeData = '~' + data;
        const encodeOpts = status ? {flag: 'a'} : null;

        !err ? fs.writeFile(encodePath, encodeData, encodeOpts, err => {
            if (err) {
                throw new Error(err);
            }
        }) : errorLog(err);
        status++;
    });
}

function encodeFile(filename) {
    fs.readFile(dirPath + filename, (err, data) => {
        const encodePath = `${dirPath}/${filename}.bxl`;
        const encodeData = 'data:image/jpg;base64,' + data;

        !err ? fs.writeFile(encodePath, encodeData, err => {
            if (err) {
                throw new Error(err);
            }
        }) : errorLog(err);
        status++;
    });
}

dirPath = normalizePath(dirPath);
// 转换全景图六张
['b', 'd', 'f', 'l', 'r', 'u'].map(str => `/mobile_${str}.jpg`)
    .forEach(name => encodeFile(name));