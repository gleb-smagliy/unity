import { effects } from "../../../common-modules/saga-runner";
import { findSchemaBuilder } from "../../../common-modules/plugins";
import { buildUri } from "../../../common-modules/services";

export function* buildingNewServiceSaga({ serviceDefinition, schemaBuilders, schemaBuilderName })
{
  const endpoint = yield effects.call(buildUri, serviceDefinition.endpoint, serviceDefinition.args);

  const schemaBuilderInput = {
    ...serviceDefinition,
    endpoint,
    args: undefined
  };

  const schemaBuilder = yield effects.call(findSchemaBuilder, schemaBuilders, schemaBuilderName);
  const builtService = yield effects.call(schemaBuilder.buildServiceModel, schemaBuilderInput);
  const serviceMetadata = yield effects.call(schemaBuilder.extractMetadata, schemaBuilderInput);

  return {
    success: true,
    payload: {
      schema: builtService.schema,
      metadata: serviceMetadata.metadata,
      id: serviceDefinition.id,
      endpoint: serviceDefinition.endpoint,
      args: serviceDefinition.args
    }
  };
}