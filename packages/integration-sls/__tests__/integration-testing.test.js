const { startDispatcher } = require('../src/startup');

describe('Dispatcher on AWS', () =>
{
  let service = {};

  beforeEach(async () =>
  {
    service = await startDispatcher({ debug: true });
  });

  it('should run', () =>
  {
    console.log('From test endpoint: ', endpoint);
  });
});