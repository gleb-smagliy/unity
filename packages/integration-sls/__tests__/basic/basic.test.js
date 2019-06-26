const gql = require('graphql-tag');
const { startDispatcher } = require('../../src/startup');
const { registerNewService, registerAndCommit } = require('../utils/register-service');
const { executeQuery } = require('../utils/execute-query');
const { createSchema: authorsSchema } = require('./basic.authors');
const { createSchema: booksSchema } = require('./basic.books');

jest.setTimeout(20000);

describe('Dispatcher on AWS (without using metadata)', () =>
{
  let dispatcher = null;
  let services = [];

  beforeEach(async () =>
  {
    dispatcher = await startDispatcher({ debug: false });
  });

  afterEach(() =>
  {
    dispatcher.close();
    services.forEach(s => s.close());
  });

  it('should register service without metadata successfully', async () =>
  {
    const registration = await registerNewService(dispatcher, { skipMetadata: true }, { schema: authorsSchema().schema });
    services.push(registration.service);

    const { result } = registration;

    expect(result.success).toEqual(true);
  });

  it('should register and commit service without metadata successfully', async () =>
  {
    const registration = await registerAndCommit(dispatcher, { skipMetadata: true }, { schema: authorsSchema().schema });
    services.push(registration.service);

    const { result } = registration;

    expect(result.success).toEqual(true);
  });

  it('should allow to query without alias single registered service', async () =>
  {
    const variables = { id: 12345 };
    const { verifyData, verifyResolvers, schema } = authorsSchema();
    const registration = await registerAndCommit(dispatcher, { skipMetadata: true }, { schema });
    services.push(registration.service);

    const result = await executeQuery({
      endpoint: dispatcher.endpoint,
      query: gql`
        query AuthorById($id: Int!) {
          authorById(id: $id) { id firstName lastName }
        }
      `,
      variables
    });

    expect(result.errors).toEqual(undefined);
    verifyData(result.data);
    verifyResolvers(variables);
  });

  it('should allow to query with alias single registered service', async () =>
  {
    const variables = { id: 12345 };
    const { verifyData, verifyResolvers, schema } = authorsSchema();
    const registration = await registerAndCommit(dispatcher, { skipMetadata: true }, { schema });
    services.push(registration.service);

    const result = await executeQuery({
      endpoint: dispatcher.endpoint,
      query: gql`
        query AuthorById($id: Int!) {
          result: authorById(id: $id) { id firstName lastName }
        }
      `,
      variables
    });

    expect(result.errors).toEqual(undefined);
    verifyData(result.data, 'result');
    verifyResolvers(variables);
  });

  it('should allow to query without alias two registered services', async () =>
  {
    const variables = { bookId: 12345, authorId: 54321 };
    const authors = authorsSchema();
    const books = booksSchema();

    const authorsRegistration = await registerAndCommit(dispatcher, { skipMetadata: true }, { schema: authors.schema });
    services.push(authorsRegistration.service);

    const booksRegistration = await registerAndCommit(dispatcher, { skipMetadata: true }, { schema: books.schema });
    services.push(booksRegistration.service);

    const result = await executeQuery({
      endpoint: dispatcher.endpoint,
      query: gql`
        query TestQuery($bookId: Int!, $authorId: Int!) {
          authorById(id: $authorId) { id firstName lastName }
          bookById(id: $bookId) { id description title }
        }
      `,
      variables
    });

    expect(result.errors).toEqual(undefined);
    authors.verifyData(result.data);
    books.verifyData(result.data);
    authors.verifyResolvers({ id: variables.authorId });
    books.verifyResolvers({ id: variables.bookId });
  });

  it('should allow to query with aliases two registered services', async () =>
  {
    const variables = { bookId: 12345, authorId: 54321 };
    const authors = authorsSchema();
    const books = booksSchema();

    const authorsRegistration = await registerAndCommit(dispatcher, { skipMetadata: true }, { schema: authors.schema });
    services.push(authorsRegistration.service);

    const booksRegistration = await registerAndCommit(dispatcher, { skipMetadata: true }, { schema: books.schema });
    services.push(booksRegistration.service);

    const result = await executeQuery({
      endpoint: dispatcher.endpoint,
      query: gql`
        query TestQuery($bookId: Int!, $authorId: Int!) {
          author: authorById(id: $authorId) { id firstName lastName }
          book: bookById(id: $bookId) { id description title }
        }
      `,
      variables
    });

    expect(result.errors).toEqual(undefined);
    authors.verifyData(result.data, 'author');
    books.verifyData(result.data, 'book');
    authors.verifyResolvers({ id: variables.authorId });
    books.verifyResolvers({ id: variables.bookId });
  });

  it('should pass headers to downstream service', async () =>
  {
    const variables = { id: 12345 };
    const headers = { 'x-account-id': '123', 'x-user-id': '321' };
    const { verifyHeaders, schema } = authorsSchema();
    const registration = await registerAndCommit(dispatcher, { skipMetadata: true }, { schema });
    services.push(registration.service);

    const result = await executeQuery({
      endpoint: dispatcher.endpoint,
      query: gql`
        query AuthorById($id: Int!) {
          result: authorById(id: $id) { id firstName lastName }
        }
      `,
      headers,
      variables
    });

    expect(result.errors).toEqual(undefined);
    verifyHeaders(headers);
  });

  it('should merge headers and make it lower-case', async () =>
  {
    const variables = { id: 12345 };
    const headers = {
      'Content-Type': 'application/json',
      'content-type': 'application/json',
      'x-user-id': '123',
      'X-User-Id': '321'
    };

    const { verifyHeaders, schema } = authorsSchema();
    const registration = await registerAndCommit(dispatcher, { skipMetadata: true }, { schema });
    services.push(registration.service);

    const result = await executeQuery({
      endpoint: dispatcher.endpoint,
      query: gql`
        query AuthorById($id: Int!) {
          result: authorById(id: $id) { id firstName lastName }
        }
      `,
      headers,
      variables
    });

    expect(result.errors).toEqual(undefined);
    verifyHeaders({
      'content-type': 'application/json',
      'x-user-id': '321'
    });
  });

  it('should pass registration-time headers to downstream service', async () =>
  {
    const variables = { id: 12345 };
    const registrationHeaders = { 'x-api-key': 'api_key_abcd' };

    const { verifyHeaders, schema } = authorsSchema();

    const registration = await registerAndCommit(dispatcher, { skipMetadata: true, headers: registrationHeaders }, { schema });
    services.push(registration.service);

    const result = await executeQuery({
      endpoint: dispatcher.endpoint,
      query: gql`
        query AuthorById($id: Int!) {
          result: authorById(id: $id) { id firstName lastName }
        }
      `,
      variables
    });

    expect(result.errors).toEqual(undefined);
    verifyHeaders(registrationHeaders);
  });
});