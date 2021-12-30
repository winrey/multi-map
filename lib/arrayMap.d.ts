/**
 * 注意，这个没有顺序区分
 */
export declare class ArrayMultiMap<TKeys extends any[] = any[], TValue = string> implements Map<TKeys, TValue> {
    private _size;
    private _keysLens;
    private _data;
    get [Symbol.toStringTag](): string;
    [Symbol.iterator](): IterableIterator<[TKeys, TValue]>;
    get size(): number;
    get keysLens(): number;
    constructor(keysLens: number);
    private checkKeysArg;
    clone(): ArrayMultiMap<TKeys, TValue>;
    set(keys: TKeys, data: TValue): this;
    get(keys: TKeys, defaultVal?: TValue): TValue | undefined;
    has(keys: TKeys): boolean;
    delete(keys: TKeys): any;
    clear(): void;
    forEach(callbackfn: (value: TValue, keys: TKeys, map: Map<TKeys, TValue>) => void, thisArg?: any): void;
    entries(): IterableIterator<[TKeys, TValue]>;
    keys(): IterableIterator<TKeys>;
    values(): IterableIterator<TValue>;
}
