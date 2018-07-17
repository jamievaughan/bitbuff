declare module "BitBuffer" {
    export class BitBuffer {
        private readonly _size;
        private readonly _buffer;
        private _offset;
        constructor(size: number);
        write(value: number, count: number): BitBuffer;
        read(count: number): number;
        set(value: number, offset: number, count: number): BitBuffer;
        get(offset: number, count: number): number;
        clear(): BitBuffer;
        skip(amount: number): BitBuffer;
        readonly size: number;
        readonly buffer: Uint8Array;
        readonly offset: number;
        readonly remaining: number;
    }
}
