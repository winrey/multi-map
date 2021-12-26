"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayMultiMap = void 0;
class ArrayMultiMap {
    constructor() {
        this._size = 0;
        this._data = new Map();
    }
    has(key) {
        throw new Error("Method not implemented.");
    }
    entries() {
        throw new Error("Method not implemented.");
    }
    keys() {
        throw new Error("Method not implemented.");
    }
    values() {
        throw new Error("Method not implemented.");
    }
    [Symbol.iterator]() {
        throw new Error("Method not implemented.");
    }
    get size() {
        return this._size;
    }
    set(keys, data) {
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
        const exit = Symbol("not found");
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
    clear() {
        this._size = 0;
        this._data = new Map();
    }
    delete(keys) {
        const exit = Symbol("not found");
        const maps = [];
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
        // delete unnecessary map
        maps.reduceRight((last, now) => {
            last.size;
        });
        const success = result === exit ? false : result;
        if (success) {
            this._size -= 1;
        }
        return success;
    }
    forEach(callbackfn, thisArg) {
        const foreachIfMap = (cb) => { };
    }
}
exports.ArrayMultiMap = ArrayMultiMap;
Symbol.toStringTag;
