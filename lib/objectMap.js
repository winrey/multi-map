"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectMultiMap = void 0;
const arrayMap_1 = require("./arrayMap");
/**
 * 注意，这个没有顺序区分
 */
class ObjectMultiMap {
    constructor(keyIndex, opts = {
        ignoredExtarField: false,
    }) {
        this._keyIndex = this.geneKeysIndex(keyIndex);
        this._data = new arrayMap_1.ArrayMultiMap(this._keyIndex.length);
        this._opts = opts;
    }
    get [Symbol.toStringTag]() {
        return 'ObjectMultiMap';
    }
    *[Symbol.iterator]() {
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
    geneKeysIndex(key) {
        if (!key || !['object', 'array'].includes(typeof key)) {
            throw new TypeError('keyIndex type invalid');
        }
        if (!(key instanceof Array)) {
            key = Object.keys(key);
        }
        if (!key.length) {
            throw new TypeError('keyIndex lens invalid');
        }
        return key;
    }
    checkAndParseKeys(key, ignoredExtarField) {
        /* istanbul ignore next */
        ignoredExtarField = ignoredExtarField !== null && ignoredExtarField !== void 0 ? ignoredExtarField : this._opts.ignoredExtarField;
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
        if (!ignoredExtarField && kkey.length) {
            throw new TypeError(`key have extra fields: ${JSON.stringify(kkey)}`);
        }
        return this._keyIndex.map((k) => key[k]);
    }
    index2Keys(index) {
        const result = {};
        /* istanbul ignore if  */
        if (index.length !== this._keyIndex.length) {
            throw new Error('index lens not matched');
        }
        for (let i = 0; i < index.length; i++) {
            result[this._keyIndex[i]] = index[i];
        }
        return result;
    }
    set(keys, data) {
        const k = this.checkAndParseKeys(keys);
        this._data.set(k, data);
        return this;
    }
    get(keys, defaultVal) {
        const k = this.checkAndParseKeys(keys);
        return this._data.get(k, defaultVal);
    }
    has(keys) {
        const k = this.checkAndParseKeys(keys);
        return this._data.has(k);
    }
    delete(keys) {
        const k = this.checkAndParseKeys(keys);
        return this._data.delete(k);
    }
    clone() {
        const clone = new ObjectMultiMap(this._keyIndex);
        for (const [k, v] of this.entries()) {
            clone.set(k, v);
        }
        return clone;
    }
    clear() {
        this._data.clear();
    }
    forEach(callbackfn, thisArg) {
        this._data.forEach((v, k) => {
            const keys = this.index2Keys(k);
            callbackfn.apply(thisArg, [v, keys, this]);
        });
    }
    *entries() {
        for (const [k, v] of this._data.entries()) {
            const keys = this.index2Keys(k);
            yield [keys, v];
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
exports.ObjectMultiMap = ObjectMultiMap;
