const OPERATIONS = {
  CALL: 'EFFECTS/CALL'
};

const call = (func, ...args) => ({
  operation: OPERATIONS.CALL,
  func,
  args
});

export const effects = {
  call
};

export const runSaga = async (generator) =>
{
  let step = generator.next();
  let result = {
    success: true
  };

  while(!step.done)
  {
    const stepValue = step.value;

    if(stepValue.operation === OPERATIONS.CALL)
    {
      const returned = stepValue.func(...stepValue.args);

      result = typeof(returned.then) === 'function' ? await returned : returned;

      if(!result.success)
      {
        return result;
      }

      step = generator.next(result.payload);
    }
  }

  return step.value;
};