export const composeResultsAsync = async (...promises) => await Promise
.all(promises)
.then(
  results =>
  {
    const failedResult = results.find(r => !r.success);

    if(failedResult)
    {
      return failedResult;
    }

    return {
      success: true,
      payload: results.map(r => r.payload)
    };
  }
);