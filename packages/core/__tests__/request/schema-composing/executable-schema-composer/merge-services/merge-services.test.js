import { mergeServices } from "../../../../../src/request/schema-composing/executable-schema-composer/merge-services";
import { authorService, AUTHOR_RESPONSE } from './fake-data/authors';
import { bookService, BOOK_RESPONSE } from './fake-data/books';
import { extensions, getBestTitle } from './fake-data/extensions';
import { gatewayTransformations, servicesTransformations } from './fake-data/transforms';
import { mockFetch } from './fake-data/mock-fetch';
import { graphql } from 'graphql';
import fetch from 'node-fetch';

const mergeExampleSchema = ({
  services = [authorService],
  contextSetter,
  servicesTransformations = [],
  gatewayTransformations = [],
  extensions = {
    typeDefs: [],
    resolvers: []
  }
} = {}) => mergeServices(services, {
  contextSetter,
  servicesTransformations,
  gatewayTransformations,
  extensions
});

describe('makeServiceSchema', () =>
{
  beforeEach(() =>
  {
    jest.resetAllMocks();
    jest.mock('node-fetch', () => jest.fn());
  });
  afterEach(() => jest.unmock('node-fetch'));

  it('should be able to execute query to the merged schema without transforms and extensions', async () =>
  {
    const mergeResult = mergeExampleSchema();

    expect(mergeResult.success).toBeTruthy();

    mockFetch(fetch, AUTHOR_RESPONSE);
    const queryResult = await graphql(mergeResult.payload, '{ randomAuthor { id, name } }');

    expect(queryResult).toEqual(AUTHOR_RESPONSE);
  });

  it('should be able to execute query to the merged schema with extensions', async () =>
  {
    const mergeResult = mergeExampleSchema({ extensions });

    expect(mergeResult.success).toBeTruthy();

    mockFetch(fetch, AUTHOR_RESPONSE);
    const queryResult = await graphql(mergeResult.payload, '{ randomAuthor { bestTitle } }');

    expect(queryResult.data.randomAuthor.bestTitle)
      .toEqual(getBestTitle(AUTHOR_RESPONSE.data.randomAuthor.name));
  });

  it('should be able to execute query to the merged schema with gateway transforms', async () =>
  {
    const mergeResult = mergeExampleSchema({ gatewayTransformations });

    expect(mergeResult.success).toBeTruthy();

    mockFetch(fetch, AUTHOR_RESPONSE);
    const queryResult = await graphql(mergeResult.payload, '{ Gateway_randomAuthor { name } }');

    expect(queryResult.data['Gateway_randomAuthor'].name).toEqual(AUTHOR_RESPONSE.data.randomAuthor.name);
  });

  it('should be able to execute query to the merged schema with service transforms', async () =>
  {
    const mergeResult = mergeExampleSchema({
      services: [authorService, bookService],
      servicesTransformations
    });

    expect(mergeResult.success).toBeTruthy();

    mockFetch(fetch, AUTHOR_RESPONSE);
    const authorResult = await graphql(mergeResult.payload, '{ Author_randomAuthor { name } }');

    mockFetch(fetch, BOOK_RESPONSE);
    const bookResult = await graphql(mergeResult.payload, '{ Book_randomBook { title } }');

    expect(authorResult.data['Author_randomAuthor'].name).toEqual(AUTHOR_RESPONSE.data.randomAuthor.name);
    expect(bookResult.data['Book_randomBook'].title).toEqual(BOOK_RESPONSE.data.randomBook.title);
  });

  it('should be able to execute query to the merged schema with extensions and all transforms', async () =>
  {
    const mergeResult = mergeExampleSchema({
      services: [authorService, bookService],
      servicesTransformations,
      gatewayTransformations,
      extensions
    });

    expect(mergeResult.success).toBeTruthy();

    mockFetch(fetch, AUTHOR_RESPONSE);
    const authorResult = await graphql(mergeResult.payload, '{ Gateway_Author_randomAuthor { name, bestTitle } }');

    mockFetch(fetch, BOOK_RESPONSE);
    const bookResult = await graphql(mergeResult.payload, '{ Gateway_Book_randomBook { title } }');

    expect(authorResult.data['Gateway_Author_randomAuthor'].name).toEqual(AUTHOR_RESPONSE.data.randomAuthor.name);
    expect(authorResult.data['Gateway_Author_randomAuthor'].bestTitle).toEqual(getBestTitle(AUTHOR_RESPONSE.data.randomAuthor.name));
    expect(bookResult.data['Gateway_Book_randomBook'].title).toEqual(BOOK_RESPONSE.data.randomBook.title);
  });

  it('should make a call to the remote service', async () =>
  {
    const mergeResult = mergeExampleSchema();

    expect(mergeResult.success).toBeTruthy();

    mockFetch(fetch, AUTHOR_RESPONSE);
    const authorResult = await graphql(mergeResult.payload, '{ randomAuthor { name } }');

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should make a call to the remote service if extension is queried', async () =>
  {
    const mergeResult = mergeExampleSchema({ extensions });

    expect(mergeResult.success).toBeTruthy();

    mockFetch(fetch, AUTHOR_RESPONSE);
    const queryResult = await graphql(mergeResult.payload, '{ randomAuthor { bestTitle } }');

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should enchance request using contextSetter if it is specified', async () =>
  {
    const mergeResult = mergeExampleSchema({
      contextSetter: () => ({ headers: { 'X-Test': 1 }})
    });

    expect(mergeResult.success).toBeTruthy();

    mockFetch(fetch, AUTHOR_RESPONSE);
    const authorResult = await graphql(mergeResult.payload, '{ randomAuthor { name } }');

    expect(fetch.mock.calls[0][1].headers['X-Test']).toEqual(1);
  });
});