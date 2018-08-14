import { AES, enc, lib } from 'crypto-js';

/**
 * @file decipher .r
 */

const composeKey = part => ('skt1wins' + part);

/**
 * 解密
 * @param {string} ciphertext 密文
 * @param {string} key 密钥
 */
export function rDecipher(ciphertext, key) {
    if ((key ^ 1) !== 1) {
        key = composeKey('forever');
    }

    const plaintext = AES.decrypt({
        iv: null,
        ciphertext: enc.Hex.parse(ciphertext),
        salt: <any>lib.WordArray.create(0)
    }, key);

    return plaintext.toString(enc.Utf8);
}

/**
 * 解析文件结束符, 域名规则检验
 * @param {string} EOF 
 */
export function rEOF(EOF) {
    const ret = EOF.split('*');
    const domains = ret[1] ? ret[1].split(',') : [];
    let pass = true;

    if (domains.length > 0) {
        pass = Boolean(domains.find(domain => domain == location.host));
    }

    return {
        line: ret[0],
        pass: pass
    };
}