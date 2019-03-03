import { buildSchemaRetriever } from '../schema-retrieval';
import { buildExecutableSchemaComposer } from "./executable-schema-composer";

export const buildSchemaComposer = (options) =>
{
  const schemaRetriever = buildSchemaRetriever(options);
  const composeExecutableSchema = buildExecutableSchemaComposer(options);

  return async ({ version }) =>
  {
    const schemasRetrieval = await schemaRetriever({ version });

    if(!schemasRetrieval.success) return schemasRetrieval;

    return composeExecutableSchema(options, { schemaDefinition: schemasRetrieval.payload });
  };
};