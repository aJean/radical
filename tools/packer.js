const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

/**
 * @file img binary package
 */

let dirPath = process.argv.splice(2)[0];
let isstart = true;

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

function convertFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
            err ? reject(err)
                : resolve('data:image/jpg;base64,' + data.toString('base64') + '~#~');
        });
    });
}

// 保持顺序合并加密
function encodeOrderFile() {
    Promise.all(flags.map(name => convertFile(dirPath + '/mobile_' + name + '.jpg')))
        .then(ret => {
            let data = ret.join('');
            const cipher = crypto.createCipher('aes-256-cbc', 'baiduid');
            data = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');

            fs.writeFile(dirPath + '/images.bxl', data, err => {
                if (err) {
                    throw new Error(err);
                }
            })
        }).catch(e => errorLog(e));
}

// 分别加密
function encodeFile(filename) {
    flags.forEach(str => {
        const filename = '/mobile_' + str;
        const filepath = dirPath + filename + '.jpg';

        fs.readFile(filepath, (err, data) => {
            const encodePath = `${dirPath}/${filename}.bxl`;
            const encodeData = 'data:image/jpg;base64,' + data.toString('base64');
    
            !err ? fs.writeFile(encodePath, encodeData, err => {
                if (err) {
                    throw new Error(err);
                }
            }) : errorLog(err);
        });
    });
}

dirPath = normalizePath(dirPath);

const flags = ['r', 'l', 'u', 'd', 'f', 'b'];
encodeOrderFile();