import { effects } from "../../../common-modules/saga-runner";
import { findSchemaBuilder } from "../../../common-modules/plugins";

export function* buildingNewServiceSaga({ serviceDefinition, schemaBuilders, schemaBuilderName })
{
  const schemaBuilder = yield effects.call(findSchemaBuilder, schemaBuilders, schemaBuilderName);
  const builtService = yield effects.call(schemaBuilder.buildServiceModel, serviceDefinition);
  const serviceMetadata = yield effects.call(schemaBuilder.extractMetadata, serviceDefinition);

  return {
    success: true,
    payload: {
      schema: builtService.schema,
      metadata: serviceMetadata.metadata,
      id: serviceDefinition.id,
      endpoint: builtService.endpoint
    }
  };
}