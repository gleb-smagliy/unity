import { createSchema } from "../../../src/registration/schema/create-schema";
import { createRegistrationHandler, createSchemaBuilders, executeRegistration } from './utils';

const HANDLER_RESULT_PAYLOAD = { version: '213' };
const HANDLER_ERROR_MESSAGE = 'something went wrong';

describe('schema, created by schema creator', () =>
{
  it('should return successful result if service is valid and command returned success', async () =>
  {
    const schemaBuilders = createSchemaBuilders([
      ['testBuilder', 'TestBuilder', 'input TestBuilder { endpoint: String }']
    ]);
    const registrationHandler = createRegistrationHandler({ success: true, payload: HANDLER_RESULT_PAYLOAD });
    const schema = createSchema({ schemaBuilders, registrationHandler });

    const service = {
      id: 'test_service',
      endpoint: 'localhost',
      schemaBuilder: { testBuilder: {  } }
    };

    const result = await executeRegistration(schema, service);

    expect(result.errors).toEqual(undefined);
    expect(result.data.register.success).toEqual(true);
    expect(result.data.register.payload).toEqual(HANDLER_RESULT_PAYLOAD);
  });

  it('should return GraphQL error if specified builder is not registered', async () =>
  {
    const schemaBuilders = createSchemaBuilders([
      ['testBuilder', 'TestBuilder', 'input TestBuilder { endpoint: String }']
    ]);
    const registrationHandler = createRegistrationHandler({ success: true, payload: HANDLER_RESULT_PAYLOAD });
    const schema = createSchema({ schemaBuilders, registrationHandler });

    const service = {
      id: 'test_service',
      endpoint: 'localhost',
      schemaBuilder: { testBuilderNotExists: { } }
    };

    const { errors } = await executeRegistration(schema, service);

    expect(errors).toHaveLength(1);
  });

  it('should return failure result if command returns failure', async () =>
  {
    const schemaBuilders = createSchemaBuilders([
      ['testBuilder', 'TestBuilder', 'input TestBuilder { endpoint: String }']
    ]);
    const registrationHandler = createRegistrationHandler({ success: false, error: HANDLER_ERROR_MESSAGE });
    const schema = createSchema({ schemaBuilders, registrationHandler });

    const service = {
      id: 'test_service',
      endpoint: 'localhost',
      schemaBuilder: { testBuilder: { } }
    };

    const result = await executeRegistration(schema, service);

    expect(result.errors).toEqual(undefined);
    expect(result.data.register.success).toEqual(false);
    expect(result.data.register.error.message).toEqual(HANDLER_ERROR_MESSAGE);
  });

  it('should throw schema validation error if two schema builders with the same name specified', async () =>
  {
    const schemaBuilders = createSchemaBuilders([
      ['testBuilder', 'TestBuilder', 'input TestBuilder { endpoint: String }'],
      ['testBuilder', 'TestBuilder', 'input TestBuilder { endpoint: String }']
    ]);

    expect(() => createSchema({ schemaBuilders, registrationHandler })).toThrow();
  });
});