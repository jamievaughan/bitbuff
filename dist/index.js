define("BitBuffer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BitBuffer = /** @class */ (function () {
        function BitBuffer(size) {
            this._position = 0;
            this._size = size;
            this._array = new Uint8Array(size >> 3);
        }
        BitBuffer.prototype.write = function (value, numBits) {
            this.set(value, this._position, numBits);
            return this.skip(numBits);
        };
        BitBuffer.prototype.read = function (numBits) {
            var value = this.get(this._position, numBits);
            this.skip(numBits);
            return value;
        };
        BitBuffer.prototype.set = function (value, position, numBits) {
            if (position < 0 || position + numBits > this._size)
                throw new RangeError();
            var bytePosition = position >> 3;
            var bitPosition = 8 - (position & 7);
            for (; numBits > bitPosition; bitPosition = 8) {
                var mask_1 = (1 << bitPosition) - 1;
                this._array[bytePosition] &= ~mask_1;
                this._array[bytePosition++] |= (value >> (numBits - bitPosition)) & mask_1;
                numBits -= bitPosition;
            }
            var mask = (1 << numBits) - 1;
            var diff = bitPosition - numBits;
            this._array[bytePosition] &= ~(mask << diff);
            this._array[bytePosition] |= (value & mask) << diff;
            return this;
        };
        BitBuffer.prototype.get = function (position, numBits) {
            if (position < 0 || position + numBits > this._size)
                throw new RangeError();
            var bytePosition = position >> 3;
            var bitPosition = 8 - (position & 7);
            var accumulator = 0;
            for (; numBits > bitPosition; bitPosition = 8) {
                var mask_2 = (1 << bitPosition) - 1;
                accumulator += (this._array[bytePosition++] & mask_2) << (numBits - bitPosition);
                numBits -= bitPosition;
            }
            var mask = (1 << numBits) - 1;
            var current = this._array[bytePosition];
            var diff = (bitPosition - numBits);
            accumulator += (!diff ? current : current >> diff) & mask;
            return accumulator;
        };
        BitBuffer.prototype.clear = function () {
            for (var i = 0; i < this._array.length; i++)
                this._array[i] = 0;
            return this.reset();
        };
        BitBuffer.prototype.reset = function () {
            return this.seek(0);
        };
        BitBuffer.prototype.skip = function (amount) {
            return this.seek(this._position + amount);
        };
        BitBuffer.prototype.seek = function (position) {
            this._position = position;
            return this;
        };
        Object.defineProperty(BitBuffer.prototype, "size", {
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BitBuffer.prototype, "array", {
            get: function () {
                return this._array;
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
