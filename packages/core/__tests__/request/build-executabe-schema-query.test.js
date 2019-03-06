import { graphql } from 'graphql';
import { buildExecutableSchemaQuery } from "../../src/request/build-executabe-schema-query";
import { createSuccessfulMocks } from '../fake-plugins';
import { createSuccessfulStorage } from '../fake-storage';
import { BOOK_RESPONSE, mockFetch} from "../fake-data";
import fetch from "node-fetch";

const VERSION = 'abcd-edzx';
const TAG = 'v1';

const querySchema = async ({
    storage = createSuccessfulStorage(),
    plugins = createSuccessfulMocks(),
    version = VERSION,
    tag = TAG
 }) => await buildExecutableSchemaQuery({
  storage,
  ...plugins
})({ version, tag: TAG });

describe('buildExecutableSchemaQuery', () =>
{
  beforeEach(() =>
  {
    jest.resetAllMocks();
    jest.mock('node-fetch', () => jest.fn());
  });
  afterEach(() => jest.unmock('node-fetch'));

  it('should return function if passed options are valid', async () =>
  {
    expect(typeof(buildExecutableSchemaQuery({
      storage: createSuccessfulStorage(),
    }))).toEqual('function');
  });

  it('should throw if passed options are invalid', async () =>
  {
    expect(() => buildExecutableSchemaQuery(null)).toThrow();
  });

  it('should throw if schema version could not be retrieved by tag', async () =>
  {
    const storage = {
      ...createSuccessfulStorage().queries,
      queries: {
        ...createSuccessfulStorage().queries,
        getVersionByTag: jest.fn().mockResolvedValue({ success: false, error: 'db connection error'})
      }
    };

    expect(querySchema({ storage, tag: TAG, version: null })).rejects.toThrow();
  });

  it('should throw if schema could not be retrieved by version', async () =>
  {
    const storage = {
        ...createSuccessfulStorage().queries,
      queries: {
        ...createSuccessfulStorage().queries,
        getServicesByVersion: jest.fn().mockResolvedValue({ success: false, error: 'db connection error'})
      }
    };

    expect(querySchema({ storage, version: VERSION })).rejects.toThrow();
  });

  it('should be able to query resulted schema', async () =>
  {
    const schema = await querySchema({ version: VERSION });

    mockFetch(fetch, BOOK_RESPONSE);
    const bookResult = await graphql(schema, '{ Gateway_Book_randomBook { title } }');

    expect(bookResult.data['Gateway_Book_randomBook'].title).toEqual(BOOK_RESPONSE.data.randomBook.title);
  });
});