"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeServices = void 0;

var _graphqlTools = require("graphql-tools");

var _mergeGraphqlSchemas = require("merge-graphql-schemas");

var _makeServiceSchema = require("./make-service-schema");

const transformIfNeeded = (schema, transformation) => {
  if (Array.isArray(transformation) && transformation.length > 0) {
    return (0, _graphqlTools.transformSchema)(schema, transformation);
  }

  return schema;
}; // service.schema should be clientSchema


const transformServicesToSchemas = (services, transformations, contextSetter) => {
  return services.map(service => {
    const schema = (0, _makeServiceSchema.makeServiceSchema)({
      schema: service.schema,
      endpoint: service.endpoint,
      headers: service.headers,
      contextSetter
    });
    const transformation = transformations[service.id];
    return transformIfNeeded(schema, transformation);
  });
};

const mergeServices = (services, {
  contextSetter,
  servicesTransformations,
  extensions,
  gatewayTransformations
}) => {
  const servicesSchemas = transformServicesToSchemas(services, servicesTransformations, contextSetter);
  const mergedResolvers = (0, _mergeGraphqlSchemas.mergeResolvers)(extensions.resolvers);
  const mergedSchema = (0, _graphqlTools.mergeSchemas)({
    schemas: [...extensions.typeDefs, ...servicesSchemas],
    resolvers: mergedResolvers
  });
  const resultSchema = transformIfNeeded(mergedSchema, gatewayTransformations);
  return {
    success: true,
    payload: resultSchema
  };
};

exports.mergeServices = mergeServices;