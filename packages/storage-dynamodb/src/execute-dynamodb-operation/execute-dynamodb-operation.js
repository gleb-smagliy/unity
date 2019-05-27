const identity = value => value;

const toResult = (payload) => ({
  success: true,
  payload
});

export const execute = async (operation, {
  transformPayload = identity,
  transformError = identity,
  transformResult = toResult
} = {}) =>
{
  try
  {
    const result = await operation.promise();

    return transformResult(transformPayload(result.Items));
  }
  catch(err)
  {
    console.log(err.stack);

    return {
      success: false,
      error: transformError(err)
    };
  }
};