define("BitBuffer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BitBuffer = /** @class */ (function () {
        function BitBuffer(size) {
            this._position = 0;
            this._size = size;
            this._buffer = new Uint8Array(size >> 3);
        }
        BitBuffer.prototype.write = function (value, count) {
            this.set(this._position, value, count);
            return this.skip(count);
        };
        BitBuffer.prototype.read = function (count) {
            var value = this.get(this._position, count);
            this.skip(count);
            return value;
        };
        BitBuffer.prototype.set = function (value, offset, count) {
            if (offset + count > this._size)
                throw new RangeError();
            var bytePosition = offset >> 3;
            var bitPosition = 8 - (offset & 7);
            for (; count > bitPosition; bitPosition = 8) {
                var mask_1 = (1 << bitPosition) - 1;
                this._buffer[bytePosition] &= ~mask_1;
                this._buffer[bytePosition++] |= (value >> (count - bitPosition)) & mask_1;
                count -= bitPosition;
            }
            var mask = (1 << count) - 1;
            var diff = bitPosition - count;
            this._buffer[bytePosition] &= ~(mask << diff);
            this._buffer[bytePosition] |= (value & mask) << diff;
            return this;
        };
        BitBuffer.prototype.get = function (offset, count) {
            if (offset < 0)
                throw new RangeError();
            var bytePosition = offset >> 3;
            var bitPosition = 8 - (offset & 7);
            var accumulator = 0;
            for (; count > bitPosition; bitPosition = 8) {
                var mask_2 = (1 << bitPosition) - 1;
                accumulator += (this._buffer[bytePosition++] & mask_2) << (count - bitPosition);
                count -= bitPosition;
            }
            var mask = (1 << count) - 1;
            var current = this._buffer[bytePosition];
            var diff = (bitPosition - count);
            accumulator += (!diff ? current : current >> diff) & mask;
            return accumulator;
        };
        BitBuffer.prototype.clear = function () {
            for (var i = 0; i < this._position; i++)
                this._buffer[i] = 0;
            return this.reset();
        };
        BitBuffer.prototype.reset = function () {
            return this.seek(0);
        };
        BitBuffer.prototype.skip = function (amount) {
            return this.seek(this._position + amount);
        };
        BitBuffer.prototype.seek = function (offset) {
            this._position = offset;
            return this;
        };
        Object.defineProperty(BitBuffer.prototype, "size", {
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BitBuffer.prototype, "buffer", {
            get: function () {
                return this._buffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BitBuffer.prototype, "position", {
            get: function () {
                return this._position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BitBuffer.prototype, "remaining", {
            get: function () {
                return this._size - this._position;
            },
            enumerable: true,
            configurable: true
        });
        return BitBuffer;
    }());
    exports.BitBuffer = BitBuffer;
});
