declare module "BitBuffer" {
    export class BitBuffer {
        private readonly _size;
        private readonly _buffer;
        private _position;
        constructor(size: number);
        write(value: number, count: number): BitBuffer;
        read(count: number): number;
        set(value: number, offset: number, count: number): BitBuffer;
        get(offset: number, count: number): number;
        clear(): BitBuffer;
        reset(): BitBuffer;
        skip(amount: number): BitBuffer;
        seek(offset: number): BitBuffer;
        readonly size: number;
        readonly buffer: Uint8Array;
        readonly position: number;
        readonly remaining: number;
    }
}
