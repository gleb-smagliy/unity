import { buildSchemaRetriever } from "../../../src/request/schema-retrieval";

const retrieveSchema = async ({ getServicesByVersion, getMetadataByVersion }, version) =>
{
  const retriever = buildSchemaRetriever({ storage: { getServicesByVersion, getMetadataByVersion }});

  return await retriever({ version });
};

describe('schemaRetriever', () =>
{
  const version = 'abcd';

    it('should return failure if getServicesByVersion returns failure', async () =>
  {
    const getServicesByVersion = jest.fn().mockReturnValue({ success: false, error: 'some error'});
    const getMetadataByVersion = jest.fn().mockReturnValue({ success: true, payload: {} });

    const result = await retrieveSchema({ getMetadataByVersion, getServicesByVersion }, version);

    expect(result).toBeFailed();
  });

  it('should return failure if getMetadataByVersion returns failure', async () =>
  {
    const getServicesByVersion = jest.fn().mockReturnValue({ success: true, payload: {} });
    const getMetadataByVersion = jest.fn().mockReturnValue({ success: false, error: 'some error'});

    const result = await retrieveSchema({ getMetadataByVersion, getServicesByVersion }, version);

    expect(result).toBeFailed();
  });

  it('should return failure if both storage queries return failure', async () =>
  {
    const getServicesByVersion = jest.fn().mockReturnValue({ success: false, error: 'some error'});
    const getMetadataByVersion = jest.fn().mockReturnValue({ success: false, error: 'some error'});

    const result = await retrieveSchema({ getMetadataByVersion, getServicesByVersion }, version);

    expect(result).toBeFailed();
  });

  it('should call getMetadataByVersion with right version argument', async () =>
  {
    const getServicesByVersion = jest.fn().mockReturnValue({ success: true, payload: {} });
    const getMetadataByVersion = jest.fn().mockReturnValue({ success: true, payload: {} });

    await retrieveSchema({ getMetadataByVersion, getServicesByVersion }, version);

    expect(getMetadataByVersion).toHaveBeenCalledWith({ version });
  });

  it('should call getServicesByVersion with right version argument', async () =>
  {
    const getServicesByVersion = jest.fn().mockReturnValue({ success: true, payload: {} });
    const getMetadataByVersion = jest.fn().mockReturnValue({ success: true, payload: {} });

    await retrieveSchema({ getMetadataByVersion, getServicesByVersion }, version);

    expect(getServicesByVersion).toHaveBeenCalledWith({ version });
  });

  it('should return success with services and metadata if storage queries return successful results', async () =>
  {
    const services = [{ id: 'service_1'}, { id: 'service_2'}];
    const metadata = { somePlugin: { key: 1 }, otherPlugin: { key: 2 }};

    const getServicesByVersion = jest.fn().mockReturnValue({ success: true, payload: services });
    const getMetadataByVersion = jest.fn().mockReturnValue({ success: true, payload: metadata });

    const result = await retrieveSchema({ getMetadataByVersion, getServicesByVersion }, version);

    expect(result).toBeSuccessful({
      services,
      metadata
    });
  });
});