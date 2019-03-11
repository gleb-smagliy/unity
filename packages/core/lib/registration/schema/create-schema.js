"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSchema = void 0;

var _graphqlTools = require("graphql-tools");

var _createTypeDefinitions = require("./create-type-definitions");

var _createResolvers = require("./create-resolvers");

const createSchema = ({
  schemaBuilders,
  registrationHandler
}) => {
  const apiDefinitions = schemaBuilders.map(b => b.getApiDefinition());
  return (0, _graphqlTools.makeExecutableSchema)({
    typeDefs: (0, _createTypeDefinitions.createTypeDefinitions)(apiDefinitions),
    resolvers: (0, _createResolvers.createResolvers)({
      apiDefinitions,
      registrationHandler
    })
  });
};

exports.createSchema = createSchema;