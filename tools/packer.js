const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

/**
 * @file img binary package
 */

let dirPath = process.argv.splice(2)[0];

function errorLog(msg) {
    console.log('\x1B[31m', `error: ${msg}`);
}

function normalizePath(filePath) {
    filePath = filePath.replace(/^\.\//, '');
    filePath = filePath.replace(/\/$/, '');
    
    return `${path.resolve('./')}/${filePath}`;
}

// encode to base64
function convertFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                data = 'data:image/jpg;base64,' + data.toString('base64');
                const cipher = crypto.createCipher('aes-256-cbc', 'baiduid');
                data = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');

                resolve(data + '~#~');
            }
        });
    });
}

// 保持顺序合并
function encodeFile(flags) {
    Promise.all(flags.map(name => convertFile(dirPath + name)))
        .then(ret => {
            const data = ret.join('');
            fs.writeFile(dirPath + '/images.bxl', data, err => {
                if (err) {
                    throw new Error(err);
                }
            })
        }).catch(e => errorLog(e));
}

if (!dirPath) {
    errorLog('no input files');
} else {
    const dh = crypto.createDiffieHellman(128);
    const key = dh.generateKeys('hex');
    console.log(dh.computeSecret(key, 'hex', 'base64'));
    console.log(dh.computeSecret(key, 'hex', 'base64'));

    dirPath = normalizePath(dirPath);
    encodeFile(['/mobile_r.jpg', '/mobile_l.jpg', '/mobile_u.jpg', '/mobile_d.jpg', '/mobile_f.jpg', '/mobile_b.jpg']);
}