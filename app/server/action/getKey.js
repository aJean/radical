/**
 * @file 获取密钥
 */

const crypto = require('crypto');
module.exports = function (req, res) {
    const publicKey = decodeURIComponent(req.query.key);
    
    publicKey ? res.json({
        errno: 0,
        key: 'skt1'
    }) : res.json({
        errno: -1,
        key: null
    });
};
