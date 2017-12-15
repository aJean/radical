/**
 * @file 获取密钥
 */

const crypto = require('crypto');
module.exports = function (req, res) {
    const publicKey = decodeURIComponent(req.query.key);
    
    publicKey ? res.json({
        errno: 0,
        key: '21GWou6yRPkc3fY38RA5JcvNGtJ5cXDisuFSDDbswsOMPAZ77szJydTRzA4pGueAr3c27dAUqCJ1LLdItOGIoFNYNJsoDNWFnHjmxDyHwSWenCIA5mSKMXIIwn5KK+peVYHzeCsDg6vHfmEE2ezopbJHlFGeNdWt/tqW75oHLp2aUTwW/WL/StVzXFC91GuYu4OTK9gcNC7iWLpftDU8cN2gk047Ha06CGvbIW4Tffz65RA5P8yU70fVDC/uoqq5fD+JXF8t7hoG5UabIthoxXMB5mLLPMAHTuiXPFk98arzY208KZqcOk2IkXJs4l+usUHGEhquSH2REO0dKq2diQ=='
    }) : res.json({
        errno: -1,
        key: null
    });
};
