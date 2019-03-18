"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransforms = void 0;

var _graphqlTools = require("graphql-tools");

var _removeTypes = require("./remove-types");

const QUERY_OPERATION = 'Query';

const removeRootField = ({
  metadataQueryName
}) => new _graphqlTools.FilterRootFields((operation, fieldName) => operation !== QUERY_OPERATION || fieldName !== metadataQueryName);

const getTransforms = ({
  metadataQueryName,
  schema
}) => [removeRootField({
  metadataQueryName,
  schema
}), (0, _removeTypes.removeTypesSubgraph)({
  metadataQueryName,
  schema
})];

exports.getTransforms = getTransforms;