/**
 * @file 获取密钥
 */

const crypto = require('crypto');
module.exports = function (req, res) {
    res.json({
        errno: 0,
        key: 's+mNYYp+RdIXn5C+5uuIwszOoRMgbrcBPmiktFKsupjNbt6lIIPxUUeTb+apON3OkZPZIj+RJ0vRL+C8F2pCgqQeYKuZXt10TJrC1JNwRXZH3pW3XuJTSD1mPyJ7PXwU1BAQy3Gggn7ndKeTo+I+Qh/FaYFC5cU3WfBUtULpBWsHNzMV1ht7FRM7aEShLrdo42zH/lVV6LnfkUbT6KDpsSgUX5MPa0oEFvfuYiPsBkTlG93kilBap+i6W+cUWLXGi+21Who5EM6ZPQbeBF9HQkNSnt875KjPT0HB8AJ9s+QTMqglZSNBWblAdVvitMGFZ6xXWef5kzTK+osHxYRneA=='
    });
};
