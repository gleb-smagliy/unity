import { buildSchemaComposer } from "../../../src/request/schema-composing/schema-composer";

describe('schemaComposer', () =>
{
  beforeEach(() =>
  {
    jest.resetAllMocks();
    jest.mock('node-fetch', () => jest.fn());
  });
  afterEach(() => jest.unmock('node-fetch'));

  it('should be able to execute query to the composed from the storage schema', async () =>
  {

  });
});