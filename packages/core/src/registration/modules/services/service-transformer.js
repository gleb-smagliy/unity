import { transformSchema } from "graphql-tools";
import { buildCompositeServicesTransformer } from "../../../request/schema-composing/executable-schema-composer/build-composite-service-transformer";

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

    result[key] = {
      ...service,
      transformedSchema: transformSchema(service.schema, transformsResult.payload[key])
    };
  }

  console.log('result:', result);

  return {
    success: true,
    payload: result
  }
};