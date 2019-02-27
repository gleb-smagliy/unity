import { createSchema as schemaCreation } from './create-schema';

export const schemaCreation = schemaCreation({
  registrationHandler: new ServiceRegistrationCommandHander()
});