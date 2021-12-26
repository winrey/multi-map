
/**
 * 注意，这个没有顺序区分
 */
export class ArrayMultiMap <TKeys extends any[] = any[], TValue=string> implements Map<TKeys, TValue> {
  private _size = 0
  private _keys_lens?: number
  private _data = new Map<any, any>()

  get [Symbol.toStringTag]() {
    return "ArrayMultiMap";
  }

  *[Symbol.iterator](): IterableIterator<[TKeys, TValue]> {
    for (const result of this.entries()) {
      yield result
    }
  }

  get size () {
    return this._size
  }

  get keysLens () {
    return this._keys_lens
  }

  constructor(keysLens?: number) {
    this._keys_lens = keysLens
  }

  private checkKeysArg(keys: TKeys) {
    if (keys.length !== this._keys_lens) {
      throw new Error(`The length of the keys shouldn't change. old: ${this._keys_lens}, yours:${keys.length}`)
    }
  }

  set(keys: TKeys, data: TValue) {
    if (this._keys_lens === undefined) {
      this._keys_lens = keys.length
    }
    this.checkKeysArg(keys)
    keys.reduce((last: Map<any, any>, key, i) => {
      const isTheLastOne = i === keys.length - 1
      if (isTheLastOne) {
        last.set(key, data)
        return
      }
      if (last.has(key)) {
        return last.get(key)
      }
      const map = new Map<any, any>()
      last.set(key, map)
      return map
    }, this._data)
    this._size += 1
    return this
  }

  get(keys: TKeys, defaultVal?: TValue): TValue {
    this.checkKeysArg(keys)
    const exit = Symbol("not found")
    const val = keys.reduce((last: Map<any, any> | symbol, key, i) => {
      if (last === exit) {
        return exit
      }
      last = last as Map<any, any>
      if (!last.has(key)) {
        return exit
      }
      return last.get(key)
    }, this._data)
    return val === exit ? defaultVal : val
  }

  has(keys: TKeys): boolean {
    this.checkKeysArg(keys)
    const exit = Symbol("not found")
    const val = keys.reduce((last: Map<any, any> | symbol, key, i) => {
      if (last === exit) {
        return exit
      }
      last = last as Map<any, any>
      const isTheLastOne = i === keys.length - 1
      if (isTheLastOne) {
        return last.has(key)
      }
      if (!last.has(key)) {
        return exit
      }
      return last.get(key)
    }, this._data)
    return val === exit && val
  }

  delete(keys: TKeys) {
    this.checkKeysArg(keys)
    const exit = Symbol("not found")
    const maps: Map<any, any>[] = []
    const result = keys.reduce((last: Map<any, any> | symbol, key, i) => {
      if (last === exit) {
        return exit
      }
      last = last as Map<any, any>
      const isTheLastOne = i === keys.length - 1
      if (isTheLastOne) {
        return last.delete(key)
      }
      if (!last.has(key)) {
        return exit
      }
      const next = last.get(key)
      maps.push(next)
      return next
    }, this._data)

    // clear unnecessary map
    for(let i = keys.length - 1; i > 0; i--) {
      if (maps[i]) {
        break;
      }
      // need clear
      maps[i - 1].delete(keys[i - 1])
    }
    const success = result === exit ? false : result
    if (success) {
      this._size -= 1
    }
    return success
  }

  clear(): void {
    this._size = 0
    this._data = new Map<any, any>()
  }

  
  forEach(callbackfn: (value: TValue, keys: TKeys, map: Map<TKeys, TValue>) => void, thisArg?: any) {
    const foreachIfMap = (map: any, keys: any[] = []) => {
      if (this._keys_lens === undefined) {
        throw new Error("Array Multi Map not init")
      }
      if (keys.length < this._keys_lens) {
        // 未检索到指定层次
        if(!(map instanceof Map)) {
          throw new Error("Inner Map Structure Error")
        }
        map.forEach((v, k) => {
          foreachIfMap(v, [...keys, k])
        })
      }
      // 检索到指定层次
      callbackfn.apply(thisArg, [map, keys as TKeys, this])
    }
    foreachIfMap(this._data)
  }

  *entries(): IterableIterator<[TKeys, TValue]> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    const foreachIfMap = function* (map: any, keys: any[] = []): any {
      if (that._keys_lens === undefined) {
        throw new Error("Array Multi Map not init")
      }
      if (keys.length < that._keys_lens) {
        // 未检索到指定层次
        if(!(map instanceof Map)) {
          throw new Error("Inner Map Structure Error")
        }
        for (const [k, v] of map) {
          for (const result of foreachIfMap(v, [...keys, k])) {
            yield result
          }
        }
      }
      // 检索到指定层次?
      yield [keys, map]
    }
    for (const result of foreachIfMap(this._data)) {
      yield result
    }
  }

  *keys(): IterableIterator<TKeys> {
    for (const result of this.entries()) {
      yield result[0]
    }
  }

  *values(): IterableIterator<TValue> {
    for (const result of this.entries()) {
      yield result[1]
    }
  }
}
