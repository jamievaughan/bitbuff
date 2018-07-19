export class BitBuffer {
    private readonly _size: number;
    private readonly _array: Uint8Array;

    private _position: number = 0;

    constructor(size: number) {
        this._size = size;

        this._array = new Uint8Array(size >> 3);
    }

    public write(value: number, numBits: number): BitBuffer {
        this.set(value, this._position, numBits);
        
        return this.skip(numBits);
    }

    public read(numBits: number): number {
        const value = this.get(this._position, numBits);

        this.skip(numBits);
        
        return value;
    }

    public set(value: number, position: number, numBits: number): BitBuffer {
        if (position < 0 || position + numBits > this._size)
            throw new RangeError();

        let bytePosition = position >> 3;
        let bitPosition = 8 - (position & 7);

        for (; numBits > bitPosition; bitPosition = 8) {
            const mask = (1 << bitPosition) - 1;

            this._array[bytePosition] &= ~mask;
            this._array[bytePosition++] |= (value >> (numBits - bitPosition)) & mask;

            numBits -= bitPosition;
        }

        const mask = (1 << numBits) - 1;
        const diff = bitPosition - numBits;

        this._array[bytePosition] &= ~(mask << diff);        
        this._array[bytePosition] |= (value & mask) << diff;

        return this;
    }

    public get(position: number, numBits: number): number {
        if (position < 0 || position + numBits > this._size)
            throw new RangeError();
        
        let bytePosition = position >> 3;
        let bitPosition = 8 - (position & 7);

        let accumulator = 0;

        for (; numBits > bitPosition; bitPosition = 8) {
            const mask = (1 << bitPosition) - 1;

            accumulator += (this._array[bytePosition++] & mask) << (numBits - bitPosition);
            numBits -= bitPosition;
        }

        const mask = (1 << numBits) - 1;
        const current = this._array[bytePosition];
        const diff = (bitPosition - numBits);

        accumulator += (!diff ? current : current >> diff) & mask;        

        return accumulator;
    }

    public clear(): BitBuffer {
        for (let i = 0; i < this._array.length; i++)
            this._array[i] = 0;

        return this.reset();
    }

    public reset(): BitBuffer {
        return this.seek(0);
    }

    public skip(amount: number): BitBuffer {
        return this.seek(this._position + amount);
    }

    public seek(position: number): BitBuffer {
        this._position = position;

        return this;
    }

    public get size(): number {
        return this._size;
    }

    public get array(): Uint8Array {
        return this._array;
    }

    public get position(): number {
        return this._position;
    }

    public get remaining(): number {
        return this._size - this._position;
    }
}

export default BitBuffer;