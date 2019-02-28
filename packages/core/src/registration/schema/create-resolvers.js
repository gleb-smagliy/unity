import { success, error } from './service-registration-result';

export const createResolvers = ({ registrationHandler }) => ({
  Mutation: {
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

      const command = {
        id,
        schemaBuilder: usedSchemaBuilders[0]
      };

      const result = await registrationHandler.execute(command);

      console.log('result:', result);

      return result.success ?
        success(result.payload, result.warnings) :
        error(result.error, result.warnings);
    }
  }
});