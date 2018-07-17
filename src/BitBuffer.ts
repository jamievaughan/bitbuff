export class BitBuffer {
    private readonly _size: number;
    private readonly _buffer: Uint8Array;

    private _offset: number = 0;

    constructor(size: number) {
        this._size = size;

        this._buffer = new Uint8Array(size >> 3);
    }

    public write(value: number, count: number): BitBuffer {
        this.set(this._offset, value, count);
        this._offset += count;

        return this;
    }

    public read(count: number): number {
        const value = this.get(this._offset, count);        
        this._offset -= count;
        
        return value;
    }

    public set(value: number, offset: number, count: number): BitBuffer {
        if (offset + count > this._size)
            throw new RangeError();

        let bytePosition = offset >> 3;
        let bitPosition = 8 - (offset & 7);

        for (; count > bitPosition; bitPosition = 8) {
            const mask = (1 << bitPosition) - 1;

            this._buffer[bytePosition] &= ~mask;
            this._buffer[bytePosition++] |= (value >> (count - bitPosition)) & mask;

            count -= bitPosition;
        }

        const mask = (1 << count) - 1;
        const diff = bitPosition - count;

        this._buffer[bytePosition] &= ~(mask << diff);        
        this._buffer[bytePosition] |= (value & mask) << diff;

        return this;
    }

    public get(offset: number, count: number): number {
        if (offset < 0)
            throw new RangeError();
        
        let bytePosition = offset >> 3;
        let bitPosition = 8 - (offset & 7);

        let accumulator = 0;

        for (; count > bitPosition; bitPosition = 8) {
            const mask = (1 << bitPosition) - 1;

            accumulator += (this._buffer[bytePosition++] & mask) << (count - bitPosition);
            count -= bitPosition;
        }

        const mask = (1 << count) - 1;
        const current = this._buffer[bytePosition];
        const diff = (bitPosition - count);

        accumulator += (!diff ? current : current >> diff) & mask;        

        return accumulator;
    }

    public clear(): BitBuffer {
        for (let i = 0; i < this._offset; i++)
            this._buffer[i] = 0;

        this._offset = 0;

        return this;
    }

    public skip(amount: number): BitBuffer {
        this._offset += amount;
        return this;
    }

    public get size(): number {
        return this._size;
    }

    public get buffer(): Uint8Array {
        return this._buffer;
    }

    public get offset(): number {
        return this._offset;
    }

    public get remaining(): number {
        return this._size - this._offset;
    }
}