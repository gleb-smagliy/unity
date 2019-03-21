"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cacheDecorator = void 0;

const serializeArgs = args => Object.keys(args).reduce((s, k) => s + '|' + k + '|' + args[k], '');

const cacheKey = (version, args) => `${version}${serializeArgs(args)}`;

const cacheDecorator = ({
  schemasCache,
  composeSchema
}) => async ({
  version,
  args
}) => {
  const key = cacheKey(version, args);
  const fromCacheResult = schemasCache.tryGetItem(key);

  if (fromCacheResult.success) {
    return fromCacheResult;
  }

  const schemaComposition = await composeSchema({
    version,
    args
  });

  if (schemaComposition.success) {
    const schema = schemaComposition.payload;
    schemasCache.setItem(key, schema);
    return {
      success: true,
      payload: schema
    };
  }

  return schemaComposition;
};

exports.cacheDecorator = cacheDecorator;