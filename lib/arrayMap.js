"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayMultiMap = void 0;
/**
 * 注意，这个没有顺序区分
 */
class ArrayMultiMap {
    constructor() {
        this._size = 0;
        this._data = new Map();
        this.leafValue = Symbol('leafValue');
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
    clone() {
        const clone = new ArrayMultiMap();
        for (const [k, v] of this.entries()) {
            clone.set(k, v);
        }
        return clone;
    }
    set(keys, data) {
        const map = keys.reduce((last, key, i) => {
            if (last.has(key)) {
                return last.get(key);
            }
            const map = new Map();
            last.set(key, map);
            return map;
        }, this._data);
        if (!map.has(this.leafValue)) {
            this._size += 1;
        }
        map.set(this.leafValue, data);
        return this;
    }
    get(keys, defaultVal) {
        const exit = Symbol('not found');
        let val = keys.reduce((last, key, i) => {
            if (last === exit) {
                return exit;
            }
            last = last;
            if (!last.has(key)) {
                return exit;
            }
            return last.get(key);
        }, this._data);
        if (val !== exit && !val.has(this.leafValue)) {
            val = exit;
        }
        return val === exit ? defaultVal : val.get(this.leafValue);
    }
    has(keys) {
        const exit = Symbol('not found');
        const lastMap = keys.reduce((last, key, i) => {
            if (last === exit) {
                return exit;
            }
            last = last;
            if (!last.has(key)) {
                return exit;
            }
            return last.get(key);
        }, this._data);
        if (lastMap === exit) {
            return false;
        }
        return lastMap.has(this.leafValue);
    }
    delete(keys) {
        const exit = Symbol('not found');
        const routeStack = [this._data];
        const result = keys.reduce((last, key, i) => {
            if (last === exit) {
                return exit;
            }
            last = last;
            if (!last.has(key)) {
                return exit;
            }
            const next = last.get(key);
            routeStack.push(next);
            return next;
        }, this._data);
        if (result === exit || !result.has(this.leafValue)) {
            return false;
        }
        result.delete(this.leafValue);
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
    clear() {
        this._size = 0;
        this._data = new Map();
    }
    forEach(callbackfn, thisArg) {
        const foreachIfMap = (map, keys = []) => {
            map.forEach((v, k) => {
                if (k === this.leafValue) {
                    callbackfn.apply(thisArg !== null && thisArg !== void 0 ? thisArg : this, [v, [...keys], this]);
                    return;
                }
                foreachIfMap(v, [...keys, k]);
            });
        };
        foreachIfMap(this._data);
    }
    *entries() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        const foreachIfMap = function* (map, keys = []) {
            for (const [k, v] of map) {
                if (k === that.leafValue) {
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
