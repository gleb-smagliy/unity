const { startDispatcher, startService } = require('../src/startup');
const { registerNewService } = require('./register-service');
const wait = require('waait');

describe('Dispatcher on AWS', () =>
{
  let dispatcher = null;
  let service = null;

  beforeEach(async () =>
  {
    dispatcher = await startDispatcher({ debug: false });
  });

  afterEach(async () => {
    dispatcher.close();
    service && service.close();
  });

  it('should be able to register service without metadata successfully', async () =>
  {
    const registration = await registerNewService(dispatcher, { skipMetadata: true });

    service = registration.service;
    const { result } = registration;

    expect(result.success).toEqual(true);
  });
});