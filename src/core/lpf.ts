/**
 * @file 低通滤波器
 */

export default class LPF {
    smoothing = 0.2;
    buffer = [];
    bufferMaxSize = 10;

    constructor(values, smoothing?) {
        if (smoothing) {
            this.smoothing = smoothing;
        }

        this.init(values);
    }

    /**
      * Init buffer with array of values
      * @param {Array} values
      * @returns {Array}
      */
    init(values) {
        for (var i = 0; i < values.length; i++) {
            this.__push(values[i]);
        }
        return this.buffer;
    }

    /**
      * Add new value to buffer (FIFO queue)
      * @param {integer|float} value
      * @returns {integer|float}
      * @access private
      */
    __push(value) {
        var removed = (this.buffer.length === this.bufferMaxSize)
            ? this.buffer.shift()
            : 0;

        this.buffer.push(value);
        return removed;
    }

    /**
      * Smooth value from stream
      *
      * @param {integer|float} nextValue
      * @returns {integer|float}
      * @access public
      */
    next(nextValue) {
        var self = this;
        // push new value to the end, and remove oldest one
        var removed = this.__push(nextValue);
        // smooth value using all values from buffer
        var result = this.buffer.reduce(function(last, current) {
            return self.smoothing * current + (1 - self.smoothing) * last;
        }, removed);
        // replace smoothed value
        this.buffer[this.buffer.length - 1] = result;
        return result;
    }

    /**
      * Smooth array of values
      * @param {array} values
      * @returns {undefined}
      * @access public
      */
    smoothArray(values){
        var value = values[0];
        for (var i = 1; i < values.length; i++){
            var currentValue = values[i];
            value += (currentValue - value) * this.smoothing;
            values[i] = Math.round(value);
        }
        return values;
    }
}