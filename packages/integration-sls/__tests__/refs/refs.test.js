const gql = require('graphql-tag');
const { startDispatcher } = require('../../src/startup');
const { registerNewService, registerAndCommit } = require('../utils/register-service');
const { executeQuery } = require('../utils/execute-query');
const { createSchema: authorsSchema } = require('./refs.authors');
const { createSchema: booksSchema, books } = require('./refs.books');

jest.setTimeout(20000);

describe('Dispatcher on AWS (using metadata)', () =>
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

  it('should register single service with metadata successfully', async () =>
  {
    const registration = await registerNewService(dispatcher, { skipMetadata: false }, { schema: booksSchema().schema });
    services.push(registration.service);

    const { result } = registration;

    expect(result.success).toEqual(true);
  });

  it('should register two services with many to many refs', async () =>
  {
    const booksRegistration = await registerAndCommit(dispatcher, { skipMetadata: false }, { schema: booksSchema().schema });
    services.push(booksRegistration.service);

    const authorsRegistration = await registerAndCommit(dispatcher, { skipMetadata: false }, { schema: authorsSchema().schema });
    services.push(authorsRegistration.service);

    expect(authorsRegistration.result.success).toEqual(true);
    expect(booksRegistration.result.success).toEqual(true);
  });

  it('should return data from referenced service when ref is queried', async () =>
  {
    const booksRegistration = await registerAndCommit(dispatcher, { skipMetadata: false }, { schema: booksSchema().schema, port: 2777});
    services.push(booksRegistration.service);

    const authorsRegistration = await registerAndCommit(dispatcher, { skipMetadata: false }, { schema: authorsSchema().schema });
    services.push(authorsRegistration.service);

    const result = await executeQuery({
      endpoint: dispatcher.endpoint,
      query: gql`
        query TestQuery($authorId: Int!) {
          author: authorById(id: $authorId) {
           id 
           books { id title description } 
          }
        }
      `,
      variables: { authorId: 1 }
    });

    console.log('result:', JSON.stringify(result));

    expect(result.data.author.books).toEqual(books);
  });

  it('should return data with one to one reference', async () =>
  {
    const booksRegistration = await registerAndCommit(dispatcher, { skipMetadata: false }, { schema: booksSchema().schema, port: 2777});
    services.push(booksRegistration.service);

    const authorsRegistration = await registerAndCommit(dispatcher, { skipMetadata: false }, { schema: authorsSchema().schema });
    services.push(authorsRegistration.service);

    const result = await executeQuery({
      endpoint: dispatcher.endpoint,
      query: gql`
        query TestQuery($authorId: Int!) {
          author: authorById(id: $authorId) {
           id 
           topBook { id title description }
          }
        }
      `,
      variables: { authorId: 1 }
    });

    expect(result.data.author.topBook).toEqual(books[0]);
  });

  it('should add x-soyuz-ref=1 header to the request', async () =>
  {
    const { schema: booksServiceSchema, resolvers: booksResolvers } = booksSchema();

    const booksRegistration = await registerAndCommit(dispatcher, { skipMetadata: false }, { schema: booksServiceSchema, port: 2777});
    services.push(booksRegistration.service);

    const authorsRegistration = await registerAndCommit(dispatcher, { skipMetadata: false }, { schema: authorsSchema().schema });
    services.push(authorsRegistration.service);

    const result = await executeQuery({
      endpoint: dispatcher.endpoint,
      query: gql`
        query TestQuery($authorId: Int!) {
          author: authorById(id: $authorId) {
           id 
           topBook { id title description }
          }
        }
      `,
      variables: { authorId: 1 }
    });

    expect(booksResolvers.Query.topBooksByAuthorsIds.mock.calls[0][2].headers['x-soyuz-ref']).toEqual('1');
  });
});