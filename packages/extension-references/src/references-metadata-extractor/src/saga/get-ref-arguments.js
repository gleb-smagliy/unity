const getMetadataArgument = (args, name) =>
{
  const arg = args.find(a => a.name === name);

  if(typeof(arg) !== 'object')
  {
    return {
      success: false,
      error: `Arguments <${args}> does not contain argument <${name}>`
    }
  }

  return {
    success: true,
    payload: arg.value
  };
};

export const getRefArguments = (args) =>
{
  const aliasNameArg = getMetadataArgument(args, 'as');

  if(!aliasNameArg.success)
  {
    return aliasNameArg;
  }

  const queryArg = getMetadataArgument(args, 'query');

  if(!queryArg.success)
  {
    return queryArg;
  }

  return {
    success: true,
    payload: {
      aliasName: aliasNameArg.payload,
      query: queryArg.payload
    }
  };
};