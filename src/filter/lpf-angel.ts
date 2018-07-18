/**
 * @file angel lpf
 */

export default class AngelLPF {
    smoothing: number = .5;
    maxSize: number = 10;
    buffer: [number, number][][] = [];
    defaultValue: [number, number][] = [];
    size: number;
    defaultResult: number[] = [];

    constructor(size, values?) {
        this.init(size, values);
    }

    init(size: number, values: number[][] = []) {
        this.size = size;
        this.defaultValue = [];
        this.buffer = [];

        for (let i = 0; i < values.length; i += 1) {
            this.push(values[i]);
        }

        for (let i = 0; i < size; i += 1) {
            this.defaultValue.push([0, 1]);
            this.defaultResult.push(0);
        }

        return this.buffer;
    }

    next(nextValue: number[]) {
        const removed = this.push(nextValue);
        const sI = 1 - this.smoothing;

        const result = this.buffer.reduce(
            (last, current) => current.map((v, index) => [
                this.smoothing * current[index][0] + sI * last[index][0],
                this.smoothing * current[index][1] + sI * last[index][1]
            ]),
            removed
        );

        this.buffer[this.buffer.length - 1] = result as[number, number][];
        return this.current();
    }

    reset(value: number[]) {
        this.buffer = [];
        this.push(value);
    }

    current() {
        const length = this.buffer.length;

        if (length === 0) {
            return this.defaultResult;
        }

        return this.buffer[length - 1].map(point => Math.atan2(point[1], point[0]));
    }

    ready() {
        return this.buffer.length === this.maxSize;
    }

    push(value: number[]) {
        if (value.length !== this.size) {
            throw new Error(`Size of value must be ${this.size} !`);
        }

        const removed = (this.buffer.length === this.maxSize) ? this.buffer.shift() : this.defaultValue;

        const tmp: [number, number][] = [];
        for (let index = 0; index < this.size; index += 1) {
            tmp.push([Math.cos(value[index]), Math.sin(value[index])]);
        }

        this.buffer.push(tmp);

        return removed;
    }
}