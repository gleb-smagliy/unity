import {tryGetName} from "../../plugins/utils/get-plugin-name";

export const findSchemaBuilder = (builders, builderName) =>
{
  const schemaBuilder = builders.find(b => tryGetName(b).payload === builderName);

  if(!schemaBuilder)
  {
    return {
      success: false,
      error: `Specified schema builder ${builderName} is not in options`
    };
  }

  return { success: true, payload: schemaBuilder };
};