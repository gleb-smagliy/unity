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

      if(!result.success)
      {
        return result;
      }

      step = generator.next(result.payload);
    }
  }

  return step.value;
};