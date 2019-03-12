import { transformSchema } from "graphql-tools";
import { buildCompositeServicesTransformer } from "../../../request/schema-composing/executable-schema-composer/build-composite-service-transformer";

const isNonEmptyArray = obj => typeof(obj) === 'object' && Array.isArray(obj) && obj.length > 0;

export const transformServices = (transformers) => (servicesHash) =>
{
  const compositeTransformer = buildCompositeServicesTransformer(transformers);
  const transformsResult = compositeTransformer({ services: Object.values(servicesHash) });

  if(!transformsResult.success)
  {
    return transformsResult;
  }

  const result = {};

  for (let key of Object.keys(servicesHash))
  {
    const service = servicesHash[key];
    const serviceTransforms = transformsResult.payload[key];

    const transformedSchema = isNonEmptyArray(serviceTransforms) ?
      transformSchema(service.schema, serviceTransforms) :
      service.schema;

    result[key] = {
      ...service,
      transformedSchema
    };
  }

  return {
    success: true,
    payload: result
  }
};