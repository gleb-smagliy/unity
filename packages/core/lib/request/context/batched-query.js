"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createQueryMany = exports.createQuery = void 0;

const DataLoader = require('dataloader');

const {
  getLogger: l
} = require('../../tracing');

const fieldPathFromInfo = info => {
  let path = info.path;
  const segments = [];

  while (path) {
    segments.unshift(path.key);
    path = path.prev;
  }

  return segments.join('.');
};

const getLoaderCacheKey = ({
  query,
  args,
  context,
  info
}) => `DataLoader/${query}/${fieldPathFromInfo(info)}`;

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

    l().info('delegating {query} to the schema', {
      query
    });
    return await l().useLogging(() => {
      return info.mergeInfo.delegateToSchema({
        schema: info.schema,
        operation: 'query',
        fieldName: query,
        args,
        context,
        info
      });
    }, {
      delegatedQuery: query
    }); // return await l().useLogging(() =>
    // {
    //
    // },
    // { fieldName: query });
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