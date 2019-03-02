const getName = plugin => plugin.name || plugin.constructor.name;

export const tryGetName = plugin =>
{
  const name = getName(plugin);

  if(name === null || name === undefined || typeof(name) !== 'string')
  {
    return {
      success: false,
      error: 'Plugin name is not defined'
    }
  }

  return {
    success: false,
    payload: name
  }
};