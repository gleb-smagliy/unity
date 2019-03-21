import { buildSchemaRetriever } from "../../../src/request/data";
import { createSuccessfulStorage, services, METADATA } from '../../fake-storage';
import { authorService, bookService, createAuthorService, createBookService } from '../../fake-data';

const retrieveSchema = async ({ getSchemaByVersion }, version, globalArgs = {}) =>
{
  const retriever = buildSchemaRetriever({ storage: { queries: { getSchemaByVersion }}});

  return await retriever({ version, args: globalArgs });
};

describe('schemaRetriever', () =>
{
  const version = 'abcd';

  it('should return failure if getSchemaByVersion return failure', async () =>
  {
    const getSchemaByVersion = jest.fn().mockResolvedValue({ success: false, error: 'some error'});

    const result = await retrieveSchema({ getSchemaByVersion }, version);

    expect(result).toBeFailed();
  });

  it('should call getSchemaByVersion with right version argument', async () =>
  {
    const storage = createSuccessfulStorage();

    await retrieveSchema(storage.queries, version);

    expect(storage.queries.getSchemaByVersion).toHaveBeenCalledWith({ version });
  });

  it('should return success with services and metadata if storage queries return successful results', async () =>
  {
    const storage = createSuccessfulStorage();

    const result = await retrieveSchema(storage.queries, version);

    expect(result).toBeSuccessful({
      services,
      pluginsMetadata: METADATA
    });
  });

  it('should replace placeholders in endpoint with global args', async () =>
  {
    const services = [
      createAuthorService({ endpoint: 'http://localhost/[stage]/author' }),
      createBookService({ endpoint: 'http://localhost/[stage]/book' }),
    ];
    const storage = createSuccessfulStorage({ services });

    const result = await retrieveSchema(storage.queries, version, { stage: 'prod' });

    expect(result).toBeSuccessful();

    const actualBookService = result.payload.services.find(s => s.id === bookService.id);
    const actualAuthorService = result.payload.services.find(s => s.id === authorService.id);

    expect(actualAuthorService.endpoint).toEqual('http://localhost/prod/author');
    expect(actualBookService.endpoint).toEqual('http://localhost/prod/book');
  });

  it('should replace placeholders in endpoint with service args', async () =>
  {
    const services = [
      createAuthorService({ endpoint: 'http://localhost/[stage]/author', args: { stage: 'prod' }}),
      createBookService({ endpoint: 'http://localhost/[stage]/book', args: { stage: 'test' } }),
    ];
    const storage = createSuccessfulStorage({ services });

    const result = await retrieveSchema(storage.queries, version, { });

    expect(result).toBeSuccessful();

    const actualBookService = result.payload.services.find(s => s.id === bookService.id);
    const actualAuthorService = result.payload.services.find(s => s.id === authorService.id);

    expect(actualAuthorService.endpoint).toEqual('http://localhost/prod/author');
    expect(actualBookService.endpoint).toEqual('http://localhost/test/book');
  });

  it('should replace placeholders in endpoint with mixed service and global args', async () =>
  {
    const services = [
      createAuthorService({ endpoint: 'http://localhost/[stage]/[authorServiceId]', args: { authorServiceId: 'author' }}),
      createBookService({ endpoint: 'http://localhost/[stage]/[bookServiceId]', args: { bookServiceId: 'book' } }),
    ];
    const storage = createSuccessfulStorage({ services });

    const result = await retrieveSchema(storage.queries, version, { stage: 'prod' });

    expect(result).toBeSuccessful();

    const actualBookService = result.payload.services.find(s => s.id === bookService.id);
    const actualAuthorService = result.payload.services.find(s => s.id === authorService.id);

    expect(actualAuthorService.endpoint).toEqual('http://localhost/prod/author');
    expect(actualBookService.endpoint).toEqual('http://localhost/prod/book');
  });

  it('should replace placeholders in endpoint with mixed service and global args, giving priority to global args', async () =>
  {
    const services = [
      createAuthorService({ endpoint: 'http://localhost/[stage]/author', args: { stage: 'test' }}),
      createBookService({ endpoint: 'http://localhost/[stage]/book', args: { stage: 'test' } }),
    ];
    const storage = createSuccessfulStorage({ services });

    const result = await retrieveSchema(storage.queries, version, { stage: 'prod' });

    expect(result).toBeSuccessful();

    const actualBookService = result.payload.services.find(s => s.id === bookService.id);
    const actualAuthorService = result.payload.services.find(s => s.id === authorService.id);

    expect(actualBookService.endpoint).toEqual('http://localhost/prod/book');
    expect(actualAuthorService.endpoint).toEqual('http://localhost/prod/author');
  });

  it('should return error if some placeholders left unreplaced', async () =>
  {
    const services = [
      createAuthorService({ endpoint: 'http://localhost/[stage]/[author]', args: { stage: 'test' }}),
      createBookService({ endpoint: 'http://localhost/[stage]/book', args: { stage: 'test' } }),
    ];
    const storage = createSuccessfulStorage({ services });

    const result = await retrieveSchema(storage.queries, version, { stage: 'prod' });

    expect(result).toBeFailed();
  });

  it('should return original endpoint if no endpoint placeholders present but some args are passed', async () =>
  {
    const services = [
      createAuthorService({ endpoint: 'http://localhost/author', args: { stage: 'test' }}),
      createBookService({ endpoint: 'http://localhost/book', args: { stage: 'test' } }),
    ];
    const storage = createSuccessfulStorage({ services });

    const result = await retrieveSchema(storage.queries, version, { stage: 'prod' });

    expect(result).toBeSuccessful();

    const actualBookService = result.payload.services.find(s => s.id === bookService.id);
    const actualAuthorService = result.payload.services.find(s => s.id === authorService.id);

    expect(actualAuthorService.endpoint).toEqual('http://localhost/author');
    expect(actualBookService.endpoint).toEqual('http://localhost/book');
  });
});