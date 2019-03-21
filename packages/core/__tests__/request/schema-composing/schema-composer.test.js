import { graphql } from 'graphql';

import { buildSchemaComposer } from "../../../src/request/schema-composing/schema-composer";
import { PLUGINS_NAMES, createSuccessfulMocks } from '../../fake-plugins';
import { createSuccessfulStorage } from '../../fake-storage';
import {AUTHOR_RESPONSE, BOOK_RESPONSE, getBestTitle, mockFetch} from "../../fake-data";
import fetch from "node-fetch";

const VERSION = 'abcd-edzx';

const composeSchema = async ({
  storage = createSuccessfulStorage(),
  plugins = createSuccessfulMocks(),
  version = VERSION
}) => await buildSchemaComposer({
  storage,
  ...plugins
})({ version });

describe('schemaComposer', () =>
{
  beforeEach(() =>
  {
    jest.resetAllMocks();
    jest.mock('node-fetch', () => jest.fn());
  });
  afterEach(() => jest.unmock('node-fetch'));

  it('should return failure if storage failed', async () =>
  {
    const storage = {
      queries: {
        ...createSuccessfulStorage().queries,
        getSchemaByVersion: jest.fn().mockReturnValue({ success: false, error: 'some error'})
      }
    };

    const composeResult = await composeSchema({ storage });

    expect(composeResult).toBeFailed();
  });

  it('should call storage.getSchemaByVersion with passed version', async () =>
  {
    const storage = createSuccessfulStorage();

    await composeSchema({ storage, version: VERSION });

    expect(storage.queries.getSchemaByVersion).toHaveBeenCalledWith({ version: VERSION });
  });

  it('should be able to query composed schema', async () =>
  {
    const composeResult = await composeSchema({ version: VERSION });

    expect(composeResult).toBeSuccessful();

    mockFetch(fetch, BOOK_RESPONSE);
    const bookResult = await graphql(composeResult.payload, '{ Gateway_Book_randomBook { title } }');

    expect(bookResult.data['Gateway_Book_randomBook'].title).toEqual(BOOK_RESPONSE.data.randomBook.title);
  });
});