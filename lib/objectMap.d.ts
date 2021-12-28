export declare type TOptions = {
    ignoredExtarField?: boolean;
};
/**
 * 注意，这个没有顺序区分
 */
export declare class ObjectMultiMap<TKey extends Record<string, any> = Record<string, any>, TValue = string> implements Map<TKey, TValue> {
    private _keyIndex;
    private _data;
    private _opts;
    get [Symbol.toStringTag](): string;
    [Symbol.iterator](): IterableIterator<[TKey, TValue]>;
    get size(): number;
    get keyIndex(): string[];
    constructor(keyIndex: Array<string> | Record<string, any>, opts?: TOptions);
    private geneKeysIndex;
    private checkAndParseKeys;
    private index2Keys;
    set(keys: TKey, data: TValue): this;
    get(keys: TKey, defaultVal?: TValue): TValue;
    has(keys: TKey): boolean;
    delete(keys: TKey): any;
    clear(): void;
    forEach(callbackfn: (value: TValue, keys: TKey, map: Map<TKey, TValue>) => void, thisArg?: any): void;
    entries(): IterableIterator<[TKey, TValue]>;
    keys(): IterableIterator<TKey>;
    values(): IterableIterator<TValue>;
}
