import { EFFECTS } from './effects';

const isPromise = value => typeof(value.then) === 'function';

const isGenerator = value => typeof(value.next) === 'function';

const getResult = async (value) =>
{
  switch(true)
  {
    case isPromise(value):
      return await value;
    case isGenerator(value):
      return await runSaga(value);
    default:
      return value;
  }

};

const isOperationResult = value => typeof(value.success) === 'boolean';

export const runSaga = async (generator) =>
{
  let step = generator.next();
  let result = {
    success: true
  };

  while(!step.done)
  {
    const stepValue = step.value;

    if(stepValue.operation === EFFECTS.CALL)
    {
      result = await getResult(stepValue.func(...stepValue.args));

      let nextStepArg = result;

      if(isOperationResult(result))
      {
        if(!result.success)
        {
          return result;
        }

        nextStepArg = result.payload;
      }

      step = generator.next(nextStepArg);
    }
  }

  return step.value;
};