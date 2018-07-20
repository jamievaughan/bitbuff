export declare class BitBuffer {
    private readonly _size;
    private readonly _array;
    private _position;
    constructor(size: number);
    write(value: number, numBits: number): BitBuffer;
    read(numBits: number): number;
    set(value: number, position: number, numBits: number): BitBuffer;
    get(position: number, numBits: number): number;
    clear(): BitBuffer;
    reset(): BitBuffer;
    skip(amount: number): BitBuffer;
    seek(position: number): BitBuffer;
    readonly size: number;
    readonly array: Uint8Array;
    readonly position: number;
    readonly remaining: number;
}
export default BitBuffer;
