import { createSchema as createSchemaImplementation } from './create-schema';
import { ServiceRegistrationCommandHander } from '../command-handlers/registration-handler';

export const createSchema = options => createSchemaImplementation({
  schemaBuilders: options.schemaBuilders,
  registrationHandler: new ServiceRegistrationCommandHander(options)
});