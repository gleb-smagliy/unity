import { getSchemaVersion } from './get-schema-version';
import { buildSchemaBlocksRetriever } from './schema-retrieval';
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
    const schemaVersion = await getSchemaVersion({ version, tag, getVersionByTag });

    return await composeSchema({ version });
  };
};

/*
  usage (lambda):

  const getExecutableSchema = buildExecutableSchemaRetriever(options);

  const { version, tag } = getSchemaSpecificationFromEvent(event);

  const schema = await getExecutableSchema({ version, tag })

  return new ApolloServer({ schema }).createHandler();
 */