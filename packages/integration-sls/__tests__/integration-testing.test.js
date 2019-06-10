const { startDispatcher } = require('../src/startup');
const gql = require('graphql-tag');
const { registerNewService, registerAndCommit } = require('./register-service');
const { createSchema: authorsSchema } = require('./cases/services/authors');
const { createClient } = require('./create-client');
const wait = require('waait');

jest.setTimeout(20000);

describe('Dispatcher on AWS', () =>
{
  let dispatcher = null;
  let services = [];

  beforeEach(async () =>
  {
    dispatcher = await startDispatcher({ debug: true });
  });

  afterEach(async () =>
  {
    dispatcher.close();
    services.forEach(s => s.close());
  });

  it('should register service without metadata successfully', async () =>
  {
    const registration = await registerNewService(dispatcher, { skipMetadata: true }, { schema: authorsSchema().schema });
    services.push(registration.service);

    const { result } = registration;

    expect(result.success).toEqual(true);
  });

  it('should register and commit service without metadata successfully', async () =>
  {
    const registration = await registerAndCommit(dispatcher, { skipMetadata: true }, { schema: authorsSchema().schema });
    services.push(registration.service);

    const { result } = registration;

    expect(result.success).toEqual(true);
  });

  it.only('should allow to query (without alias) single registered service', async () =>
  {
    const variables = { id: 12345 };
    const { verifyData, verifyResolvers, schema } = authorsSchema();
    const registration = await registerAndCommit(dispatcher, { skipMetadata: true }, { schema });
    services.push(registration.service);

    await wait(50000);

    const client = createClient({ endpoint: dispatcher.endpoint });

    const { data, errors } = client.query({
      query: gql`
        query AuthorById($id: ID!) {
          authorById(id: $id) { id firstName lastName }
        }
      `, variables
    });

    expect(errors).toEqual(undefined);
    verifyData(data);
    verifyResolvers(variables);
  }, 120000);
});