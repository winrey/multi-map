"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayMultiMap = void 0;
/**
 * 注意，这个没有顺序区分
 */
class ArrayMultiMap {
    constructor(keysLens) {
        this._size = 0;
        this._data = new Map();
        if (keysLens <= 0) {
            throw new TypeError('key lens should greater than one');
        }
        if (typeof keysLens !== 'number') {
            throw new TypeError('key lens should be a number');
        }
        this._keysLens = keysLens;
    }
    get [Symbol.toStringTag]() {
        return 'ArrayMultiMap';
    }
    *[Symbol.iterator]() {
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
    checkKeysArg(keys) {
        if (keys.length !== this._keysLens) {
            throw new Error(`The length of the keys shouldn't change. old: ${this._keysLens}, yours:${keys.length}`);
        }
    }
    clone() {
        const clone = new ArrayMultiMap(this.keysLens);
        for (const [k, v] of this.entries()) {
            clone.set(k, v);
        }
        return clone;
    }
    set(keys, data) {
        /* istanbul ignore if  */
        if (this._keysLens === undefined) {
            this._keysLens = keys.length;
        }
        this.checkKeysArg(keys);
        keys.reduce((last, key, i) => {
            const isTheLastOne = i === keys.length - 1;
            if (isTheLastOne) {
                last.set(key, data);
                return;
            }
            if (last.has(key)) {
                return last.get(key);
            }
            const map = new Map();
            last.set(key, map);
            return map;
        }, this._data);
        this._size += 1;
        return this;
    }
    get(keys, defaultVal) {
        this.checkKeysArg(keys);
        const exit = Symbol('not found');
        const val = keys.reduce((last, key, i) => {
            if (last === exit) {
                return exit;
            }
            last = last;
            if (!last.has(key)) {
                return exit;
            }
            return last.get(key);
        }, this._data);
        return val === exit ? defaultVal : val;
    }
    has(keys) {
        this.checkKeysArg(keys);
        const exit = Symbol('not found');
        const val = keys.reduce((last, key, i) => {
            if (last === exit) {
                return exit;
            }
            last = last;
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
    delete(keys) {
        this.checkKeysArg(keys);
        const exit = Symbol('not found');
        const maps = [this._data];
        const result = keys.reduce((last, key, i) => {
            if (last === exit) {
                return exit;
            }
            last = last;
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
    clear() {
        this._size = 0;
        this._data = new Map();
    }
    forEach(callbackfn, thisArg) {
        const foreachIfMap = (map, keys = []) => {
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
            callbackfn.apply(thisArg, [map, keys, this]);
        };
        foreachIfMap(this._data);
    }
    *entries() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        const foreachIfMap = function* (map, keys = []) {
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
    *keys() {
        for (const result of this.entries()) {
            yield result[0];
        }
    }
    *values() {
        for (const result of this.entries()) {
            yield result[1];
        }
    }
}
exports.ArrayMultiMap = ArrayMultiMap;
