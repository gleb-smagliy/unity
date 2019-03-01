import { buildSchemaRetriever } from '../schema-retrieval';
import { buildExecutableSchemaComposer } from "./executable-schema-composer";

export const buildSchemaComposer = (options) =>
{
  const schemaRetriever = buildSchemaRetriever(options);

  return async ({ version }) =>
  {
    const schemasRetrieval = await schemaRetriever({ version });

    if(!schemasRetrieval.success)
    {
      throw new Error(`Could not retrieve schema definition: <${schemasRetrieval.error}>`);
    }

    return composeExecutableSchema(options, { schemaDefinition: schemasRetrieval.payload });
  };
};