import GraphQLJson from 'graphql-type-json';
import { success, error } from './service-registration-result';

export const createResolvers = ({
  registrationHandler,
  versionTaggingHandler,
  registrationCommitingHandler
}) => ({
  JSON: GraphQLJson,
  Mutation:
  {
    async register(_, { service })
    {
      const { id, endpoint, args = {}, headers = {}, schemaBuilder } = service;

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
        args,
        headers,
        endpoint,
        schemaBuilder: builder,
        options
      };

      const result = await registrationHandler.execute(command);

      return result.success ?
        success(result.payload, result.warnings) :
        error(result.error, result.warnings);
    },
    async tagVersion(_, { version, tag, args = {} })
    {
      const command = { version, tag, args };

      const result = await versionTaggingHandler.execute(command);

      return result.success ?
        success(result.payload, result.warnings) :
        error(result.error, result.warnings);
    },
    async commitSchema(_, { version, stage, args = {} })
    {
      const command = { version, stage, args };

      const result = await registrationCommitingHandler.execute(command);

      return result.success ?
        success(result.payload, result.warnings) :
        error(result.error, result.warnings);
    }
  }
});