"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cacheDecorator = void 0;

const cacheDecorator = ({
  schemasCache,
  composeSchema
}) => async ({
  version
}) => {
  const fromCacheResult = schemasCache.tryGetItem(version);

  if (fromCacheResult.success) {
    return fromCacheResult;
  }

  const schemaComposition = await composeSchema({
    version
  });

  if (schemaComposition.success) {
    const schema = schemaComposition.payload;
    schemasCache.setItem(version, schema);
    return {
      success: true,
      payload: schema
    };
  }

  return schemaComposition;
};

exports.cacheDecorator = cacheDecorator;