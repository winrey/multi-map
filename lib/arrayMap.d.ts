export declare class ArrayMultiMap<TKeys extends any[] = any[], TValue = string> implements Map<TKeys, TValue> {
    data: Map<any, any>;
    set(keys: TKeys, data: TValue): this;
    get(keys: TKeys, defaultVal?: TValue): TValue;
    delete(): void;
}
