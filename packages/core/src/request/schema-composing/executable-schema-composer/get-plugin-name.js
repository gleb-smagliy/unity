const getName = plugin => plugin.name || plugin.constructor.name;

export const tryGetName = plugin =>
{
  if(typeof(plugin) !== 'object')
  {
    return {
      success: false,
      error: `Plugin <${plugin}> is not an object`
    }
  }

  const name = getName(plugin);

  if(typeof(name) !== 'string' || name === 'Object')
  {
    return {
      success: false,
      error: 'Plugin name is not defined'
    }
  }

  return {
    success: true,
    payload: name
  }
};