import { tryGetPluginMetadata } from "../../../../src/request/schema-composing/executable-schema-composer/get-plugin-metadata";

describe('tryGetPluginMetadata', () =>
{
  it('should return success for existing name', () =>
  {
    const pluginMetadata = {};

    const metadatas = {
      'SomePlugin': pluginMetadata
    };

    const getMetadataResult = tryGetPluginMetadata(metadatas, 'SomePlugin');

    expect(getMetadataResult.success).toEqual(true);
    expect(getMetadataResult.payload).toBe(pluginMetadata)
  });

  it('should return failure when plugin name is not present in the dictionary', () =>
  {
    const metadatas = {
      'SomePlugin': {}
    };

    const getMetadataResult = tryGetPluginMetadata(metadatas, 'not_existing_plugin');

    expect(getMetadataResult.success).toEqual(false);
    expect(getMetadataResult.error).toEqual(expect.any(String));
  });

  it('should return failure when plugin metadata is not an object', () =>
  {
    const metadatas = {
      'SomePlugin': 123
    };

    const getMetadataResult = tryGetPluginMetadata(metadatas, 'SomePlugin');

    expect(getMetadataResult.success).toEqual(false);
    expect(getMetadataResult.error).toEqual(expect.any(String));
  });
});