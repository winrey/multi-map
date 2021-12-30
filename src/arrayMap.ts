/**
 * 注意，这个没有顺序区分
 */
export class ArrayMultiMap<TKeys extends any[] = any[], TValue = string> implements Map<TKeys, TValue> {
  private _size = 0;
  private _keysLens: number;
  private _data = new Map<any, any>();

  get [Symbol.toStringTag]() {
    return 'ArrayMultiMap';
  }

  *[Symbol.iterator](): IterableIterator<[TKeys, TValue]> {
    for (const result of this.entries()) {
      yield result;
    }
  }

  get size() {
    return this._size;
  }

  get keysLens() {
    return this._keysLens;
  }

  constructor(keysLens: number) {
    if (keysLens <= 0) {
      throw new TypeError('key lens should greater than one');
    }
    if (typeof keysLens !== 'number') {
      throw new TypeError('key lens should be a number');
    }
    this._keysLens = keysLens;
  }

  private checkKeysArg(keys: TKeys) {
    if (keys.length !== this._keysLens) {
      throw new Error(`The length of the keys shouldn't change. old: ${this._keysLens}, yours:${keys.length}`);
    }
  }

  clone() {
    const clone = new ArrayMultiMap<TKeys, TValue>(this.keysLens)
    for (const [k, v] of this.entries()) {
      clone.set(k, v)
    }
    return clone
  }

  set(keys: TKeys, data: TValue) {
    /* istanbul ignore if  */
    if (this._keysLens === undefined) {
      this._keysLens = keys.length;
    }
    this.checkKeysArg(keys);
    keys.reduce((last: Map<any, any>, key, i) => {
      const isTheLastOne = i === keys.length - 1;
      if (isTheLastOne) {
        last.set(key, data);
        return;
      }
      if (last.has(key)) {
        return last.get(key);
      }
      const map = new Map<any, any>();
      last.set(key, map);
      return map;
    }, this._data);
    this._size += 1;
    return this;
  }

  get(keys: TKeys, defaultVal?: TValue): TValue | undefined {
    this.checkKeysArg(keys);
    const exit = Symbol('not found');
    const val = keys.reduce((last: Map<any, any> | symbol, key, i) => {
      if (last === exit) {
        return exit;
      }
      last = last as Map<any, any>;
      if (!last.has(key)) {
        return exit;
      }
      return last.get(key);
    }, this._data);
    return val === exit ? defaultVal : val;
  }

  has(keys: TKeys): boolean {
    this.checkKeysArg(keys);
    const exit = Symbol('not found');
    const val = keys.reduce((last: Map<any, any> | symbol, key, i) => {
      if (last === exit) {
        return exit;
      }
      last = last as Map<any, any>;
      const isTheLastOne = i === keys.length - 1;
      if (isTheLastOne) {
        return last.has(key);
      }
      if (!last.has(key)) {
        return exit;
      }
      return last.get(key);
    }, this._data);
    return val === exit ? false : val;
  }

  delete(keys: TKeys) {
    this.checkKeysArg(keys);
    const exit = Symbol('not found');
    const maps: Map<any, any>[] = [this._data];
    const result = keys.reduce((last: Map<any, any> | symbol, key, i) => {
      if (last === exit) {
        return exit;
      }
      last = last as Map<any, any>;
      const isTheLastOne = i === keys.length - 1;
      if (isTheLastOne) {
        return last.delete(key);
      }
      if (!last.has(key)) {
        return exit;
      }
      const next = last.get(key);
      maps.push(next);
      return next;
    }, this._data);

    if (result === exit) {
      return false;
    }

    // clear unnecessary map
    for (let i = keys.length - 1; i > 0; i--) {
      if (maps[i].size) {
        break;
      }
      // need clear
      maps[i - 1].delete(keys[i - 1]);
    }
    if (result) {
      this._size -= 1;
    }
    return result;
  }

  clear(): void {
    this._size = 0;
    this._data = new Map<any, any>();
  }

  forEach(callbackfn: (value: TValue, keys: TKeys, map: Map<TKeys, TValue>) => void, thisArg?: any) {
    const foreachIfMap = (map: any, keys: any[] = []) => {
      if (keys.length < this._keysLens) {
        // 未检索到指定层次
        /* istanbul ignore if  */
        if (!(map instanceof Map)) {
          throw new Error('Inner Map Structure Error');
        }
        map.forEach((v, k) => {
          foreachIfMap(v, [...keys, k]);
        });
        return;
      }
      // 检索到指定层次
      callbackfn.apply(thisArg, [map, keys as TKeys, this]);
    };
    foreachIfMap(this._data);
  }

  *entries(): IterableIterator<[TKeys, TValue]> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const foreachIfMap = function* (map: any, keys: any[] = []): any {
      if (keys.length < that._keysLens) {
        // 未检索到指定层次
        /* istanbul ignore if  */
        if (!(map instanceof Map)) {
          throw new Error('Inner Map Structure Error');
        }
        for (const [k, v] of map) {
          for (const result of foreachIfMap(v, [...keys, k])) {
            yield result;
          }
        }
        return;
      }
      // 检索到指定层次?
      yield [keys, map];
    };
    for (const result of foreachIfMap(this._data)) {
      yield result;
    }
  }

  *keys(): IterableIterator<TKeys> {
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
