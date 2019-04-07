import { tryGetName } from "../../../common-modules/plugins";

export const extractMetadataForPlugins = async ({ plugins, servicesHash }) =>
{
  const metadata = {};

  for(let plugin of plugins)
  {
    const name = tryGetName(plugin).payload;
    const extractor = plugin.getMetadataExtractor();

    const extractMetadataResult = await extractor.extractMetadata({ servicesHash });

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