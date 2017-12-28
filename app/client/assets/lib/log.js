export default {
    timeline: 'forever',

    errorLog(msg) {
        if (typeof msg === 'string') {
            msg = new Error(msg);
        }

        console.error(msg);
    }
} 