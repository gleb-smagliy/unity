import { graphql } from 'graphql';
import { buildSchemaComposer } from "../../../src/request/schema-composing";
import { createSuccessfulMocks } from '../../fake-plugins';
import { createSuccessfulStorage } from '../../fake-storage';
import {BOOK_RESPONSE, mockFetch} from "../../fake-data";
import fetch from "node-fetch";

const VERSION = 'abcd-edzx';

const createComposer = ({
  storage = createSuccessfulStorage(),
  plugins = createSuccessfulMocks(),
  version = VERSION,
  cache
}) => buildSchemaComposer({
  storage,
  cache,
  ...plugins
});

describe.only('schemaComposer', () =>
{
  beforeEach(() =>
  {
    jest.resetAllMocks();
    jest.mock('node-fetch', () => jest.fn());
  });
  afterEach(() => jest.unmock('node-fetch'));

  it('should call storage with version on the first call if caching is enabled', async () =>
  {
    const storage = createSuccessfulStorage({
      cache: true
    });

    const composeSchema = createComposer({ storage, cache: false });
    const composeResult = await composeSchema({ version: VERSION });

    expect(composeResult).toBeSuccessful();
    expect(storage.getServicesByVersion).toHaveBeenCalledWith({ version: VERSION });
    expect(storage.getMetadataByVersion).toHaveBeenCalledWith({ version: VERSION });
  });

  it('should call storage with version on the first call if caching is disabled', async () =>
  {
    const storage = createSuccessfulStorage();

    const composeSchema = createComposer({ storage, cache: false });
    const composeResult = await composeSchema({ version: VERSION });

    expect(composeResult).toBeSuccessful();
    expect(storage.getServicesByVersion).toHaveBeenCalledWith({ version: VERSION });
    expect(storage.getMetadataByVersion).toHaveBeenCalledWith({ version: VERSION });
  });

  it('should call storage with version on the second call if caching is disabled', async () =>
  {
    const storage = createSuccessfulStorage();

    const composeSchema = createComposer({ storage, cache: false });

    const composeResult1 = await composeSchema({ version: VERSION });
    const composeResult2 = await composeSchema({ version: VERSION });

    expect(composeResult1).toBeSuccessful();
    expect(composeResult2).toBeSuccessful();

    expect(storage.getServicesByVersion).toHaveBeenCalledWith({ version: VERSION });
    expect(storage.getMetadataByVersion).toHaveBeenCalledWith({ version: VERSION });
    expect(storage.getServicesByVersion).toHaveBeenCalledTimes(2);
    expect(storage.getMetadataByVersion).toHaveBeenCalledTimes(2);
  });

  it.only('should not call storage with version on the second call if caching is enabled', async () =>
  {
    const storage = createSuccessfulStorage();

    const composeSchema = createComposer({ storage, cache: true });

    const composeResult1 = await composeSchema({ storage, version: VERSION });
    const composeResult2 = await composeSchema({ storage, version: VERSION });

    expect(composeResult1).toBeSuccessful();
    expect(composeResult2).toBeSuccessful();

    expect(storage.getServicesByVersion).toHaveBeenCalledWith({ version: VERSION });
    expect(storage.getMetadataByVersion).toHaveBeenCalledWith({ version: VERSION });
    expect(storage.getServicesByVersion).toHaveBeenCalledTimes(1);
    expect(storage.getMetadataByVersion).toHaveBeenCalledTimes(1);
  });

  it('should be able to query composed schema if cache is enabled', async () =>
  {
    const composeSchema = createComposer({ cache: true });

    const composeResult = await composeSchema({ version: VERSION });

    expect(composeResult).toBeSuccessful();

    mockFetch(fetch, BOOK_RESPONSE);
    const bookResult = await graphql(composeResult.payload, '{ Gateway_Book_randomBook { title } }');

    expect(bookResult.data['Gateway_Book_randomBook'].title).toEqual(BOOK_RESPONSE.data.randomBook.title);
  });

  it('should be able to query composed schema if cache is disabled', async () =>
  {
    const composeSchema = createComposer({ cache: false });

    const composeResult = await composeSchema({ version: VERSION });

    expect(composeResult).toBeSuccessful();

    mockFetch(fetch, BOOK_RESPONSE);
    const bookResult = await graphql(composeResult.payload, '{ Gateway_Book_randomBook { title } }');

    expect(bookResult.data['Gateway_Book_randomBook'].title).toEqual(BOOK_RESPONSE.data.randomBook.title);
  });
});