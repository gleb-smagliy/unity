import { transformSchema, mergeSchemas } from 'graphql-tools';
import { mergeResolvers } from 'merge-graphql-schemas';
import { makeServiceSchema } from './make-service-schema';
import { SchemaTypeConflictError } from './type-conflict-error'

const transformIfNeeded = (schema, transformations) =>
{
  if(Array.isArray(transformations) && transformations.length > 0)
  {
    return transformSchema(schema, transformations);
  }

  return schema;
};

// service.schema should be clientSchema
const transformServicesToSchemas = (services, transformations, contextSetter) =>
{
  return services.map(service =>
  {
    const schema = makeServiceSchema({ schema: service.schema, contextSetter });
    const transformation = transformations[service.id];

    return transformIfNeeded(schema, transformations);
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

  try {
    const mergedSchema = mergeSchemas({
      schemas: [
        extensions.typeDefs,
        ...servicesSchemas
      ],
      resolvers: mergedResolvers,
      onTypeConflict: left => { throw new SchemaTypeConflictError(`Type <${left.name}> ocurred more than once`) }
    });

    return transformIfNeeded(mergedSchema, gatewayTransformations);
  }
  catch(err)
  {
    if(err instanceof SchemaTypeConflictError)
    {
      return {
        success: false,
        error: err.message
      }
    }

    throw err;
  }
};