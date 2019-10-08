import { prepareOptions } from "../common-modules/options";
import { getSchemaVersion } from './data/get-schema-version';
import { buildSchemaComposer } from "./schema-composing";
import { applyTracingToSchema } from '../middleware';
import { getLogger as l } from '../tracing';

export const buildExecutableSchemaQuery = (options) =>
{
  const optionsPreparation = prepareOptions(options);

  if(!optionsPreparation.success)
  {
    throw new Error(`Options is not valid: <${optionsPreparation.error}>`);
  }

  const composeSchema = buildSchemaComposer(optionsPreparation.payload);

  return async ({ version, tag }) =>
  {
    const { getVersionByTag } = options.storage.queries;
    const schemaVersionResult = await getSchemaVersion({ version, tag, getVersionByTag });

    if(!schemaVersionResult.success)
    {
      throw new Error(schemaVersionResult.error);
    }

    const { args, version: resultVersion } = schemaVersionResult.payload;

    const result = await composeSchema({ version: resultVersion, args });

    if(!result.success)
    {
      throw new Error(result.error);
    }

    l().info('Schema for ({tag}, {version}) loaded', { tag, version: resultVersion });

    applyTracingToSchema(result.payload);

    return result.payload;
  };
};