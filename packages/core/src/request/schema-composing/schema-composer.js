import { buildSchemaRetriever } from '../data';
import { buildExecutableSchemaComposer } from "./executable-schema-composer";

export const buildSchemaComposer = (options) =>
{
  const schemaRetriever = buildSchemaRetriever(options);
  const composeExecutableSchema = buildExecutableSchemaComposer(options);

  return async ({ version, args }) =>
  {
    const schemasRetrieval = await schemaRetriever({ version, args });

    if(!schemasRetrieval.success) return schemasRetrieval;

    return composeExecutableSchema(schemasRetrieval.payload);
  };
};