/**
 * 注意，这个没有顺序区分
 */
export class ArrayMultiMap<TKeys extends any[] = any[], TValue = string> implements Map<TKeys, TValue> {
  private _size = 0;
  private _data = new Map<any, any>();
  private _leafValue = Symbol('leafValue');
  private _defaultFunc?: (keys: TKeys) => TValue;

  constructor(defaultFunc?: (keys: TKeys) => TValue) {
    this._defaultFunc = defaultFunc;
  }

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

  clone() {
    const clone = new ArrayMultiMap<TKeys, TValue>();
    for (const [k, v] of this.entries()) {
      clone.set(k, v);
    }
    return clone;
  }

  set(keys: TKeys, data: TValue) {
    const map = keys.reduce((last: Map<any, any>, key, i) => {
      if (last.has(key)) {
        return last.get(key) as Map<any, any>;
      }
      const map = new Map<any, any>();
      last.set(key, map);
      return map;
    }, this._data);
    if (!map.has(this._leafValue)) {
      this._size += 1;
    }
    map.set(this._leafValue, data);
    return this;
  }

  get(keys: TKeys, defaultVal?: TValue): TValue | undefined {
    const exit = Symbol('not found');
    const val = keys.reduce((last: Map<any, any> | symbol, key, i) => {
      if (last === exit) {
        return exit;
      }
      last = last as Map<any, any>;
      if (!last.has(key)) {
        return exit;
      }
      return last.get(key) as Map<any, any>;
    }, this._data);
    if (val === exit || !val.has(this._leafValue)) {
      const result = defaultVal ?? this._defaultFunc?.(keys);
      if (result !== undefined) {
        this.set(keys, result);
      }
      return result;
    }
    return val.get(this._leafValue);
  }

  has(keys: TKeys): boolean {
    const exit = Symbol('not found');
    const lastMap = keys.reduce((last: Map<any, any> | symbol, key, i) => {
      if (last === exit) {
        return exit;
      }
      last = last as Map<any, any>;
      if (!last.has(key)) {
        return exit;
      }
      return last.get(key) as Map<any, any>;
    }, this._data);
    if (lastMap === exit) {
      return false;
    }
    return lastMap.has(this._leafValue);
  }

  delete(keys: TKeys) {
    const exit = Symbol('not found');
    const routeStack: Map<any, any>[] = [this._data];
    const result = keys.reduce((last: Map<any, any> | symbol, key, i) => {
      if (last === exit) {
        return exit;
      }
      last = last as Map<any, any>;
      if (!last.has(key)) {
        return exit;
      }
      const next = last.get(key) as Map<any, any>;
      routeStack.push(next);
      return next;
    }, this._data);

    if (result === exit || !result.has(this._leafValue)) {
      return false;
    }

    result.delete(this._leafValue);
    this._size -= 1;

    // clear unnecessary map
    for (let i = routeStack.length - 1; i > 0; i--) {
      if (routeStack[i].size) {
        break;
      }
      // need clear
      routeStack[i - 1].delete(keys[i - 1]);
    }
    return true;
  }

  clear(): void {
    this._size = 0;
    this._data = new Map<any, any>();
  }

  forEach(callbackfn: (value: TValue, keys: TKeys, map: Map<TKeys, TValue>) => void, thisArg?: any) {
    const foreachIfMap = (map: Map<any, any>, keys: any[] = []) => {
      map.forEach((v, k) => {
        if (k === this._leafValue) {
          callbackfn.apply(thisArg ?? this, [v, [...keys] as TKeys, this]);
          return;
        }
        foreachIfMap(v, [...keys, k]);
      });
    };
    foreachIfMap(this._data);
  }

  *entries(): IterableIterator<[TKeys, TValue]> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const foreachIfMap = function* (map: Map<any, any>, keys: any[] = []): any {
      for (const [k, v] of map) {
        if (k === that._leafValue) {
          yield [[...keys], v];
          break;
        }
        for (const result of foreachIfMap(v, [...keys, k])) {
          yield result;
        }
      }
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
