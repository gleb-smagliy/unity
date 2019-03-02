export const tryGetPluginMetadata = (metadata, pluginName) =>
{
  const pluginMetadata = metadata[name];

  if(typeof(pluginMetadata) !== 'object')
  {
    return {
      success: false,
      error: `Plugin <${name}> metadata is not an object, it is: ${pluginMetadata}`
    };
  }
};