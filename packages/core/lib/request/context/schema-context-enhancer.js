"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schemaContextEnhancer = exports.getSchemaFromContext = void 0;

var _batchedQuery = require("./batched-query");

const schemaSymbol = Symbol('schema');

const getSchemaFromContext = context => context[schemaSymbol];

exports.getSchemaFromContext = getSchemaFromContext;

const schemaContextEnhancer = () => {
  const loadersCache = {};
  return {
    [schemaSymbol]: {
      batchQuery: (0, _batchedQuery.createQuery)(loadersCache),
      batchQueryMany: (0, _batchedQuery.createQueryMany)(loadersCache)
    }
  };
};

exports.schemaContextEnhancer = schemaContextEnhancer;