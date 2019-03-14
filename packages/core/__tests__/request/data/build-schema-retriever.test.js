import { buildSchemaRetriever } from "../../../src/request/data";
import { createSuccessfulStorage, services, METADATA } from '../../fake-storage';

const retrieveSchema = async ({ getSchemaByVersion }, version) =>
{
  const retriever = buildSchemaRetriever({ storage: { queries: { getSchemaByVersion }}});

  return await retriever({ version });
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
});