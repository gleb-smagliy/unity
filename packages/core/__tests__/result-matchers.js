import { equals } from 'ramda';

export const resultMatchers = {
  toBeSuccessful(result, payload)
  {
    if(result.success !== true)
    {
      return {
        pass: false,
        message: () => `expected <${JSON.stringify(result)}> to have success property equals to true, instead got <${result.success}>`
      }
    }

    if(payload)
    {
      if(!equals(result.payload, payload))
      {
        return {
          pass: false,
          message: () => `expected payload <${JSON.stringify(result.payload)}> to be equal to <${JSON.stringify(payload)}>`
        }
      }
    }

    return {
      pass: true
    }
  },
  toBeFailed(result, error)
  {
    if(result.success !== false)
    {
      return {
        pass: false,
        message: () => `expected <${JSON.stringify(result)}> to have success property equals to false, instead got <${result.success}>`
      }
    }

    if(error)
    {
      if(result.error !== error)
      {
        return {
          pass: false,
          message: () => `expected error <${result.error}> to be equal to <${error}>`
        }
      }
    }

    return {
      pass: true
    }
  }
};