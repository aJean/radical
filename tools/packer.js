const path = require('path');
const fs = require('fs');

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

// 保持顺序合并加密
function encodeOrderFile() {
    if (!flags.length) {
        return;
    }

    const filepath = dirPath + '/mobile_' + flags.shift() + '.jpg';

    fs.readFile(filepath, (err, data) => {
        const encodePath = dirPath + '/images.bxl';
        const encodeData = 'data:image/jpg;base64,' + data.toString('base64') + '~#~';
        const encodeOpts = isstart ? null : {flag: 'a'};

        if (err === null) {
            fs.writeFile(encodePath, encodeData, encodeOpts, err => {
                err ? errorLog(err) : encodeOrderFile();
            })
        } else {
           errorLog(err); 
        }

        isstart = false;    
    });
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