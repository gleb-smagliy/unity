jest.mock('node-fetch', () => jest.fn());
import { makeServiceSchema } from "../../../../src/request/schema-composing/executable-schema-composer/make-service-schema";
import { buildFakeClientSchema } from '../../../fake-schema';
import { graphql } from 'graphql';
import fetch from 'node-fetch';

const CLIENT_SCHEMA = buildFakeClientSchema(`
  type Query {
    dummy: String
  }
`);
const querySchema = schema => graphql(schema, '{ dummy }');
const SERVICE_URI = 'http://localhost/';

const setHeaders = (headers) => (request, previousContext) => ({ headers });

describe('makeServiceSchema', () =>
{
    beforeEach(() => jest.mock('node-fetch', () => jest.fn()));
    afterEach(() => jest.unmock('node-fetch'));

    it('should execute query against remote service without context trasnformations', async () =>
    {
      const remoteSchema = makeServiceSchema({ schema: CLIENT_SCHEMA, uri: SERVICE_URI });

      await querySchema(remoteSchema);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0][0]).toEqual(SERVICE_URI);
    });

    it('should execute query against remote service with context transformations', async () =>
    {
      const remoteSchema = makeServiceSchema({
        schema: CLIENT_SCHEMA,
        uri: SERVICE_URI,
        contextSetter: setHeaders({ 'X-Test': 1 })
      });

      await querySchema(remoteSchema);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0][1].headers['X-Test']).toEqual(1);
    });
});