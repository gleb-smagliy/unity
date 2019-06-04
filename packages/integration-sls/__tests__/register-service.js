const { SoyuzClient } = require('../src/client');
const { startService } = require('../src/startup');

const randomId = () => `service_${Math.random().toString(36).substring(7)}`;

const registerNewService = async (dispatcher, { skipMetadata }) => {
  const id = randomId();

  const service = await startService();

  const client = new SoyuzClient({ endpoint: dispatcher.registerEndpoint });

  const result = await client.registerGraphqlService({
    id,
    endpoint: service.endpoint
  }, { skipMetadata });

  return {
    service,
    result
  }
};

module.exports = {
  registerNewService
};