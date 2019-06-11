const { SoyuzClient } = require('../src/client');
const { startService } = require('../src/startup');

const randomId = () => `service_${Math.random().toString(36).substring(7)}`;

const registerNewService = async (dispatcher, { skipMetadata }, options) => {
  const id = randomId();

  const service = await startService(options);

  const client = new SoyuzClient({ endpoint: dispatcher.registerEndpoint });

  const result = await client.registerGraphqlService({
    id,
    endpoint: service.endpoint
  }, { skipMetadata });

  return {
    client,
    service,
    result
  };
};

const registerAndCommit = async (dispatcher, { skipMetadata }, options) =>
{
  const { service, client, result: registration } = await registerNewService(dispatcher, { skipMetadata }, options);

  expect(registration.success).toEqual(true);

  const commiting = await client.commit({ version: registration.payload.version });

  return {
    result: commiting,
    service
  };
};

module.exports = {
  registerNewService,
  registerAndCommit
};