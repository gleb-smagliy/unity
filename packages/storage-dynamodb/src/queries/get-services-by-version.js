export const getSchemaByVersion = async () =>
{
  const pluginName = 'some_plugin';

  return {
    success: true,
    payload: [
      { id: 'User', schema: {} }
    ]
  };
};