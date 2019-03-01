const LruCache = require('lru-cache');

const DEFAULT_OPTIONS = {
  max: 50
};

export class InMemoryCache
{
  constructor(cacheOptions)
  {
    this.cache = new LruCache(cacheOptions || DEFAULT_OPTIONS);
  }

  tryGetItem = (key) =>
  {
    const item = this.cache.get(key);

    if(item !== undefined)
    {
      return {
        success: true,
        payload: item
      }
    }

    return {
      success: false,
      error: 'Item not found'
    }
  };

  setItem = (key, item, maxAge) => this.cache.set(key, item, maxAge);
}