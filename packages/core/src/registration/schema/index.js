import { prepareOptions } from "../../common-modules/options";
import { createSchema as createSchemaImplementation } from './create-schema';
import { ServiceRegistrationCommandHander } from '../command-handlers/registration-handler';
import { SchemaVersionTaggingHandler } from '../command-handlers/schema-version-taging-handler';
import { RegistrationCommitingHandler } from '../command-handlers/registration-commiting-handler';

export const createSchema = rawOptions =>
{
  const optionsPreparation = prepareOptions(rawOptions);

  if(!optionsPreparation.success)
  {
    throw new Error(optionsPreparation.error);
  }

  const options = optionsPreparation.payload;
  const { schemaBuilders } = options;

  const schemaVersionTaggingHandler = new SchemaVersionTaggingHandler(options);
  const registrationHandler = new ServiceRegistrationCommandHander(options);
  const registrationCommitingHandler = new RegistrationCommitingHandler(
    { schemaVersionTaggingHandler },
    options
  );

  return createSchemaImplementation({
    schemaBuilders,
    registrationHandler,
    schemaVersionTaggingHandler,
    registrationCommitingHandler
  });
};