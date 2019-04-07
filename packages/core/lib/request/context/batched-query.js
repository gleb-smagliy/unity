"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createQueryMany = exports.createQuery = void 0;

const DataLoader = require('dataloader');

const getLoaderCacheKey = ({
  query,
  args,
  context,
  info
}) => `DataLoader/${query}/${JSON.stringify(info)}`;

const cacheKeyFn = args => JSON.stringify(args);

const createDataLoader = ({
  query,
  args,
  context,
  info
}) => {
  /*
    const argsList = [
      { ids: 123 },
      { ids: 321 },
        ...
    ];
  */
  const delegateToSchema = async argsList => {
    if (argsList.length === 0) {
      return [];
    }

    const keys = Object.keys(argsList[0]);
    const args = {};

    for (let key of keys) {
      args[key] = [];

      for (let arg of argsList) {
        args[key].push(arg[key]);
      }
    }

    const ret = await info.mergeInfo.delegateToSchema({
      schema: info.schema,
      operation: 'query',
      fieldName: query,
      args,
      context,
      info
    });
    return ret;
  };

  return new DataLoader(delegateToSchema, {
    cacheKeyFn
  });
};

const getOrCreateLoader = (cache, resolverInfo) => {
  const key = getLoaderCacheKey(resolverInfo);
  let dataLoader = cache[key];

  if (dataLoader === undefined) {
    dataLoader = createDataLoader(resolverInfo);
    cache[key] = dataLoader;
  }

  return dataLoader;
};

const createQuery = cache => async resolverInfo => {
  const loader = getOrCreateLoader(cache, resolverInfo);
  const {
    args
  } = resolverInfo;
  return await loader.load(args);
};

exports.createQuery = createQuery;

const createQueryMany = cache => async resolverInfo => {
  const loader = getOrCreateLoader(cache, resolverInfo);
  const {
    args
  } = resolverInfo;
  return await loader.loadMany(args);
};

exports.createQueryMany = createQueryMany;