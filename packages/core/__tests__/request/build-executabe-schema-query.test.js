import { graphql } from 'graphql';
import { buildExecutableSchemaQuery } from "../../src/request/build-executabe-schema-query";
import { PLUGINS_NAMES, createSuccessfulMocks } from '../fake-plugins';
import { createSuccessfulStorage } from '../fake-storage';
import {AUTHOR_RESPONSE, BOOK_RESPONSE, getBestTitle, mockFetch} from "../fake-data";
import fetch from "node-fetch";

const VERSION = 'abcd-edzx';
const TAG = 'v1';

const querySchema = async ({
    queries = createSuccessfulStorage(),
    plugins = createSuccessfulMocks(),
    version = VERSION,
    tag = TAG
 }) => await buildExecutableSchemaQuery({
  storage: {
    queries
  },
  ...plugins
})({ version: VERSION, tag: TAG });

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
      storage: {
        queries: createSuccessfulStorage()
      }
    }))).toEqual('function');
  });

  it('should throw if passed options are invalid', async () =>
  {
    expect(() => buildExecutableSchemaQuery(null)).toThrow();
  });

  it('should throw if schema version could not be retrieved by tag', async () =>
  {
    const queries = {
      getSchemaVersionByTag: jest.fn().mockResolvedValue({ success: false, error: 'db connection error'})
    };

    expect(async () => await querySchema({
      queries,
      version
    })).toThrow();
  });
});