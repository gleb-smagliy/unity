import { tryGetPluginMetadata } from "../../../src/plugins/utils/get-plugin-metadata";

describe('tryGetPluginMetadata', () =>
{
  it('should return success for existing name', () =>
  {
    const pluginMetadata = {};

    const metadatas = {
      'SomePlugin': pluginMetadata
    };

    expect(tryGetPluginMetadata(metadatas, 'SomePlugin'))
      .toBeSuccessful(pluginMetadata);
  });

  it('should return failure when plugin name is not present in the dictionary', () =>
  {
    const metadatas = {
      'SomePlugin': {}
    };

    expect(tryGetPluginMetadata(metadatas, 'not_existing_plugin'))
      .toBeFailed();
  });

  it('should return failure when plugin metadata is not an object', () =>
  {
    const metadatas = {
      'SomePlugin': 123
    };

    expect(tryGetPluginMetadata(metadatas, 'SomePlugin'))
      .toBeFailed();
  });
});