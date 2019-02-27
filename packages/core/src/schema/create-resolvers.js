import { success, error } from './service-registration-result';

export const createResolvers = ({ registrationHandler }) => async (_, { service }) =>
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

  if(result.success) return success(result.payload, result.warnings);

  return failure(result.error, result.warnings);
};