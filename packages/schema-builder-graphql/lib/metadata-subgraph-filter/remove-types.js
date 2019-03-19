"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeTypesSubgraph = void 0;

var _graphql = require("graphql");

var _graphqlTools = require("graphql-tools");

var _utils = require("./utils");

var _typesRegistry = require("./types-registry");

const removeTypesSubgraph = ({
  metadataQueryName,
  schema
}) => {
  const types = [];
  const registry = new _typesRegistry.TypesRegistry();
  const query = schema.getQueryType().getFields()[metadataQueryName];

  if (query !== undefined) {
    types.push(query.type);
    types.push(...(0, _utils.getFieldArgsTypes)(query));
  }

  while (types.length > 0) {
    const type = (0, _graphql.getNamedType)(types.shift());

    if (type === undefined) {
      continue;
    }

    if ((0, _graphql.isScalarType)(type) || registry.isVisited(type)) {
      registry.setVisited(type);
      continue;
    }

    if ((0, _graphql.isAbstractType)(type)) {
      types.push(...schema.getPossibleTypes(type));
      registry.setBanned(type);
      continue;
    }

    if ((0, _utils.canContainFields)(type)) {
      types.push(...(0, _utils.getTypeDependencies)(type, schema));
    }

    registry.setBanned(type);
  }

  return new _graphqlTools.FilterTypes(type => !registry.isBanned(type));
};

exports.removeTypesSubgraph = removeTypesSubgraph;