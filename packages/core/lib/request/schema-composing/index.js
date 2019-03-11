"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildSchemaComposer = void 0;

var _inMemoryCache = require("./in-memory-cache");

var _schemaComposerCacheDecorator = require("./schema-composer-cache-decorator");

var _schemaComposer = require("./schema-composer");

const buildSchemaComposer = options => {
  const {
    cache: cacheOptions
  } = options;
  const originalSchemaComposer = (0, _schemaComposer.buildSchemaComposer)(options);

  if (typeof cacheOptions === 'object' || typeof cacheOptions === 'boolean' && !!cacheOptions) {
    const inMemoryCache = typeof cacheOptions === 'object' ? new _inMemoryCache.InMemoryCache(cacheOptions) : new _inMemoryCache.InMemoryCache();
    return (0, _schemaComposerCacheDecorator.cacheDecorator)({
      composeSchema: originalSchemaComposer,
      schemasCache: inMemoryCache
    });
  }

  return originalSchemaComposer;
};

exports.buildSchemaComposer = buildSchemaComposer;