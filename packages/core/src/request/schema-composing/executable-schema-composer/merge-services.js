import { transformSchema, mergeSchemas } from 'graphql-tools';
import { mergeResolvers } from 'merge-graphql-schemas';
import { makeServiceSchema } from './make-service-schema';

const transformIfNeeded = (schema, transformation) =>
{
  if(Array.isArray(transformation) && transformation.length > 0)
  {
    return transformSchema(schema, transformation);
  }

  return schema;
};

// service.schema should be clientSchema
const transformServicesToSchemas = (services, transformations, contextSetter) =>
{
  return services.map(service =>
  {
    const schema = makeServiceSchema({ schema: service.schema, uri: service.uri, contextSetter });
    const transformation = transformations[service.id];

    return transformIfNeeded(schema, transformation);
  });
};

export const mergeServices = (services, {
  contextSetter,
  servicesTransformations,
  extensions,
  gatewayTransformations
}) =>
{
  const servicesSchemas = transformServicesToSchemas(services, servicesTransformations, contextSetter);
  const mergedResolvers = mergeResolvers(extensions.resolvers);

  const mergedSchema = mergeSchemas({
    schemas: [
      ...extensions.typeDefs,
      ...servicesSchemas
    ],
    resolvers: mergedResolvers
  });

  const resultSchema = transformIfNeeded(mergedSchema, gatewayTransformations);

  return {
    success: true,
    payload: resultSchema
  };
};