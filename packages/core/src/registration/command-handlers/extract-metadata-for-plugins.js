import {tryGetName} from "../../plugins/utils/get-plugin-name";

export const extractMetadataForPlugins = async ({ plugins, args }) =>
{
  const metadata = {};

  for(let plugin of plugins)
  {
    const name = tryGetName(plugin).payload;
    const extractor = plugin.getMetadataExtractor();

    const extractMetadataResult = await extractor.extractMetadata(...args);

    if(!extractMetadataResult.success)
    {
      return extractMetadataResult;
    }

    metadata[name] = extractMetadataResult.payload;
  }

  return {
    success: true,
    payload: metadata
  }
};