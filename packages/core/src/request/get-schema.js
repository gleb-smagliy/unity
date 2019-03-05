import { getSchemaVersion } from './data/get-schema-version';
import { buildSchemaComposer } from "./schema-composing";

//todo: currently just a stub
const validateOptions = () => ({ success: true });

export const buildExecutableSchemaRetriever = (options) =>
{
  const optionsValidation = validateOptions(options);

  if(!optionsValidation.success)
  {
    throw new Error(`Options is not valid: <${optionsValidation.error}>`);
  }

  const composeSchema = buildSchemaComposer(options);

  return async ({ version, tag }) =>
  {
    const { getVersionByTag } = options.storage.queries;
    const schemaVersionResult = await getSchemaVersion({ version, tag, getVersionByTag });

    if(!schemaVersionResult.success)
    {
      throw new Error(schemaVersionResult.error);
    }

    const schemaVersion = schemaVersionResult.payload;

    const result = await composeSchema({ version: schemaVersion });

    if(!result.success)
    {
      throw new Error(result.error);
    }
  };
};

/*
  usage (lambda):

  const getExecutableSchema = buildExecutableSchemaRetriever(options);

  const { version, tag } = getSchemaSpecificationFromEvent(event);

  const schema = await getExecutableSchema({ version, tag })

  return new ApolloServer({ schema }).createHandler();
 */