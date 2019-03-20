import { success, error } from './service-registration-result';

export const createResolvers = ({
  registrationHandler,
  versionTaggingHandler,
  schemaCommitingHandler
}) => ({
  Mutation:
  {
    async register(_, { service })
    {
      const { id, schemaBuilder } = service;

      const usedSchemaBuilders = Object
        .keys(schemaBuilder)
        .filter(k => schemaBuilder[k] != null);

      if(usedSchemaBuilders.length !== 1)
      {
        return error("You should specify exactly one schema builder.");
      }

      const builder = usedSchemaBuilders[0];
      const options = schemaBuilder[builder];

      const command = {
        id,
        schemaBuilder: builder,
        options
      };

      const result = await registrationHandler.execute(command);

      return result.success ?
        success(result.payload, result.warnings) :
        error(result.error, result.warnings);
    },
    async tagVersion(_, { version, tag })
    {
      const command = { version, tag };

      const result = await versionTaggingHandler.execute(command);

      return result.success ?
        success(result.payload, result.warnings) :
        error(result.error, result.warnings);
    },
    async commitSchema(_, { version })
    {
      const command = { version, tag: SYSTEM_TAGS.STABLE };

      const result = await schemaCommitingHandler.execute(command);

      return result.success ?
        success(result.payload, result.warnings) :
        error(result.error, result.warnings);
    }
  }
});