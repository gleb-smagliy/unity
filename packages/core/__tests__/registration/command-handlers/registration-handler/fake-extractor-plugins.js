export const DEFAULT_NAME = 'some_extractor_plugin';
export const SOME_METADATA = { key: 'value' };

const createMetadataExtractor = ({ success }) =>
{
  const payload = success ? SOME_METADATA : undefined;
  const error = success ? undefined : 'some_error';

  return {
    extractMetadata: jest.fn().mockResolvedValue({ success, payload, error })
  };
};

export const createSuccessfulExtractorPlugin = ({ name = DEFAULT_NAME } = {}) => {

  const metadataExtractor = createMetadataExtractor({ success: true });

  return {
    name,
    metadataExtractor,
    getMetadataExtractor: jest.fn().mockReturnValue(metadataExtractor)
  }
};

export const createFailedExtractorPlugin = ({ name = DEFAULT_NAME } = {}) => {

  const metadataExtractor = createMetadataExtractor({ success: false });

  return {
    name,
    metadataExtractor,
    getMetadataExtractor: jest.fn().mockReturnValue(metadataExtractor)
  }
};