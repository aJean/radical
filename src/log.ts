/**
 * @file logs & 统计
 */

function formatMsg(msg) {
    return (typeof msg === 'string') ? new Error(msg) : msg;
}

export default {
    debug: false,

    output(msg) {
        return this.debug ? this.errorLog(msg) : this.infoLog(msg);
    },

    infoLog(msg) {
        console.info(formatMsg(msg));
    },

    errorLog(msg) {
        console.error(formatMsg(msg));
    }
} 