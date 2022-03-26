import { ArrayMultiMap } from './arrayMap';

export type TOptions<TKey, TValue> = {
  ignoredExtraField?: boolean;
  defaultFunc?: (key: TKey) => TValue;
};

/**
 * 注意，这个没有顺序区分
 */
export class ObjectMultiMap<TKey extends Record<string, any> = Record<string, any>, TValue = string>
  implements Map<TKey, TValue>
{
  private _keyIndex: string[];
  private _data: ArrayMultiMap<any[], TValue>;
  // private _opts: TOptions;
  private _ignoredExtraField: boolean;
  private _defaultFunc?: (key: TKey) => TValue;

  get [Symbol.toStringTag]() {
    return 'ObjectMultiMap';
  }

  *[Symbol.iterator](): IterableIterator<[TKey, TValue]> {
    for (const result of this.entries()) {
      yield result;
    }
  }

  get size() {
    return this._data.size;
  }

  get keyIndex() {
    return this._keyIndex;
  }

  constructor(
    keyIndex: Array<string> | Record<string, any>,
    opts: TOptions<TKey, TValue> = {
      ignoredExtraField: false,
    },
  ) {
    this._keyIndex = this.geneKeysIndex(keyIndex);
    const { ignoredExtraField = false, defaultFunc } = opts;
    this._ignoredExtraField = ignoredExtraField;
    this._defaultFunc = defaultFunc;
    this._data = new ArrayMultiMap<any[], TValue>();
  }

  private geneKeysIndex(key?: Array<string> | Record<string, any>) {
    if (!key || !['object', 'array'].includes(typeof key)) {
      throw new TypeError('keyIndex type invalid');
    }
    if (!(key instanceof Array)) {
      key = Object.keys(key);
    }
    if (!key.length) {
      throw new TypeError('keyIndex lens invalid');
    }
    return key as string[];
  }

  private checkAndParseKeys(key: TKey, ignoredExtraField?: boolean) {
    /* istanbul ignore next */
    ignoredExtraField = ignoredExtraField ?? this._ignoredExtraField;
    if (typeof key !== 'object' || key instanceof Array) {
      throw new TypeError('key should be an obj');
    }
    let kkey = Object.keys(key);
    this._keyIndex.forEach((v) => {
      const filtered = kkey.filter((k) => k != v);
      if (kkey.length === filtered.length) {
        throw new TypeError(`index field "${v}" not found`);
      }
      kkey = filtered;
    });
    if (!ignoredExtraField && kkey.length) {
      throw new TypeError(`key have extra fields: ${JSON.stringify(kkey)}`);
    }
    return this._keyIndex.map((k) => key[k]);
  }

  private index2Keys(index: any[]) {
    const result: Record<string, any> = {};
    /* istanbul ignore if  */
    if (index.length !== this._keyIndex.length) {
      throw new Error('index lens not matched');
    }
    for (let i = 0; i < index.length; i++) {
      result[this._keyIndex[i]] = index[i];
    }
    return result as TKey;
  }

  set(keys: TKey, data: TValue) {
    const k = this.checkAndParseKeys(keys);
    this._data.set(k, data);
    return this;
  }

  get(keys: TKey, defaultVal?: TValue): TValue | undefined {
    const k = this.checkAndParseKeys(keys);
    const result = this._data.get(k, defaultVal);
    if (result === undefined) {
      const value = this._defaultFunc?.(keys);
      if (value !== undefined) {
        this.set(keys, value);
        return value;
      }
    }
    return result;
  }

  has(keys: TKey): boolean {
    const k = this.checkAndParseKeys(keys);
    return this._data.has(k);
  }

  delete(keys: TKey) {
    const k = this.checkAndParseKeys(keys);
    return this._data.delete(k);
  }

  clone() {
    const clone = new ObjectMultiMap<TKey, TValue>(this._keyIndex);
    for (const [k, v] of this.entries()) {
      clone.set(k, v);
    }
    return clone;
  }

  clear(): void {
    this._data.clear();
  }

  forEach(callbackfn: (value: TValue, keys: TKey, map: Map<TKey, TValue>) => void, thisArg?: any) {
    this._data.forEach((v, k) => {
      const keys = this.index2Keys(k);
      callbackfn.apply(thisArg, [v, keys, this]);
    });
  }

  *entries(): IterableIterator<[TKey, TValue]> {
    for (const [k, v] of this._data.entries()) {
      const keys = this.index2Keys(k);
      yield [keys, v];
    }
  }

  *keys(): IterableIterator<TKey> {
    for (const result of this.entries()) {
      yield result[0];
    }
  }

  *values(): IterableIterator<TValue> {
    for (const result of this.entries()) {
      yield result[1];
    }
  }
}
