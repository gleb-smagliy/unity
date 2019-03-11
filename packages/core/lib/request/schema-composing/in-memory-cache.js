"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InMemoryCache = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const LruCache = require('lru-cache');

const DEFAULT_OPTIONS = {
  max: 50
};

class InMemoryCache {
  constructor(cacheOptions) {
    _defineProperty(this, "tryGetItem", key => {
      const item = this.cache.get(key);

      if (item !== undefined) {
        return {
          success: true,
          payload: item
        };
      }

      return {
        success: false,
        error: 'Item not found'
      };
    });

    _defineProperty(this, "setItem", (key, item, maxAge) => this.cache.set(key, item, maxAge));

    this.cache = new LruCache(cacheOptions || DEFAULT_OPTIONS);
  }

}

exports.InMemoryCache = InMemoryCache;