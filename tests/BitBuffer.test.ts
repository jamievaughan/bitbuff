import { assert } from 'chai';

import { BitBuffer } from '../src/BitBuffer';

describe("BitBuffer", () => {
    describe("constructor()", () => {
        it("backing array should be X divided by 8 in size", () => {
            const size = 1024;
            const buffer = new BitBuffer(size);

            assert.equal(buffer.array.length, size / 8);
        });
    });

    describe("seek()", () => {
        it("seeks to the correct position", () => {
            const position = 9;

            const buffer = new BitBuffer(16);
            buffer.seek(position);

            assert.equal(buffer.position, position);
        });
    });

    describe("skip()", () => {
        it("skips requested number of bits", () => {
            const numBits = 4;

            const buffer = new BitBuffer(16);
            buffer.skip(numBits);

            assert.equal(buffer.position, numBits);
        });
    });

    describe("reset()", () => {
        it("buffer position resets back to zero", () => {
            const buffer = new BitBuffer(16);
            buffer
                .seek(16)
                .reset();

            assert.equal(buffer.position, 0);
        });
    });

    describe("write()", () => {
        it("buffer position should position correctly", () => {
            const buffer = new BitBuffer(8);
            buffer.write(128, 8);

            assert.equal(buffer.position, 8);
        });
    });

    describe("read()", () => {
        it("read the correctly set value from the buffer", () => {
            const testValue = 72;
            
            const buffer = new BitBuffer(8);
            const value = buffer
                .write(testValue, 8)
                .reset()
                .read(8);

            assert.equal(value, testValue);
        });

        it("buffer position should position correctly", () => {
            const buffer = new BitBuffer(16);
            
            buffer
                .write(128, 8)
                .reset()
                .read(8);

            assert.equal(buffer.position, 8);
        });
    });

    describe("set()", () => {
        it("value correctly sets at position", () => {
            const testValue = 93;

            const buffer = new BitBuffer(16);
            const value = buffer
                .set(testValue, 8, 8)
                .seek(8)
                .read(8);

            assert.equal(value, testValue);
        });

        it("throws a RangeError if position is below zero", () => {
            const buffer = new BitBuffer(16);

            assert.throws(() => buffer.set(122, -2, 8));
        });

        it("throws a RangeError if position and number of bits overflows buffer", () => {
            const buffer = new BitBuffer(16);            

            assert.throws(() => buffer.set(123, 9, 8), RangeError);
        });
    });

    describe("get()", () => {
        it("get correct value at position", () => {
            const testValue = 201;

            const buffer = new BitBuffer(16);
            const value = buffer
                .write(testValue, 8)
                .seek(16)
                .get(0, 8);

            assert.equal(value, testValue);
        });

        it("throws a RangeError if position is below zero", () => {
            const buffer = new BitBuffer(16);

            assert.throws(() => buffer.get(-5, 8));
        });

        it("throws a RangeError if position and requested number of bits overflows buffer", () => {
            const buffer = new BitBuffer(16);

            assert.throws(() => buffer.get(8, 9), RangeError);
        });
    });

    describe("clear()", () => {
        it("zero passes the backing array", () => {
            const buffer = new BitBuffer(32);
            buffer
                .write(872364234, 32)
                .clear();
            
            for (let i = 0; i < buffer.array.length; i++)
                assert.equal(buffer.array[i], 0);
        });

        it("resets the position to zero", () => {
            const buffer = new BitBuffer(32);
            buffer
                .write(187263482, 32)
                .clear();

            assert.equal(buffer.position, 0);
        });
    });
});