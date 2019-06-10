const { startDispatcher } = require('../src/startup');
const gql = require('graphql-tag');
const { registerNewService, registerAndCommit } = require('./register-service');
const { createSchema: authorsSchema } = require('./cases/services/authors');
const { createSchema: booksSchema } = require('./cases/services/books');
const { createClient } = require('./create-client');

jest.setTimeout(20000);

describe('Dispatcher on AWS', () =>
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

    const client = createClient({ endpoint: dispatcher.endpoint });

    const result = await client.query({
      query: gql`
        query AuthorById($id: Int!) {
          authorById(id: $id) { id firstName lastName }
        }
      `, variables
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

    const client = createClient({ endpoint: dispatcher.endpoint });

    const result = await client.query({
      query: gql`
        query AuthorById($id: Int!) {
          result: authorById(id: $id) { id firstName lastName }
        }
      `, variables
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

    const client = createClient({ endpoint: dispatcher.endpoint });

    const result = await client.query({
      query: gql`
        query TestQuery($bookId: Int!, $authorId: Int!) {
          authorById(id: $authorId) { id firstName lastName }
          bookById(id: $bookId) { id description title }
        }
      `, variables
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

    const client = createClient({ endpoint: dispatcher.endpoint });

    const result = await client.query({
      query: gql`
        query TestQuery($bookId: Int!, $authorId: Int!) {
          author: authorById(id: $authorId) { id firstName lastName }
          book: bookById(id: $bookId) { id description title }
        }
      `, variables
    });

    expect(result.errors).toEqual(undefined);
    authors.verifyData(result.data, 'author');
    books.verifyData(result.data, 'book');
    authors.verifyResolvers({ id: variables.authorId });
    books.verifyResolvers({ id: variables.bookId });
  });
});