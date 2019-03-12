import { prepareOptions } from "../../common-modules/options";
import { createSchema as createSchemaImplementation } from './create-schema';
import { ServiceRegistrationCommandHander } from '../command-handlers/registration-handler';

export const createSchema = rawOptions =>
{
  const optionsPreparation = prepareOptions(rawOptions);

  if(!optionsPreparation.success)
  {
    throw new Error(optionsPreparation.error);
  }

  const options = optionsPreparation.payload;

  return createSchemaImplementation({
    schemaBuilders: options.schemaBuilders,
    registrationHandler: new ServiceRegistrationCommandHander(options)
  });
};