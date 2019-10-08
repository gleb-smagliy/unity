const AWSXRay = require('aws-xray-sdk-core');

const isPromise = obj =>
  !!obj && (typeof(obj) === 'object' || typeof(obj) === 'function') && typeof(obj.then) === 'function';

module.exports.createTracer = ({ logger } = {}) => {
  if(logger)
  {
    AWSXRay.setLogger(logger);
  }

  return {
    wrap: (operationName, func) => (...args) =>
    {
      let result;

      AWSXRay.captureAsyncFunc(operationName, (subsegment) =>
      {
        result = func(...args);

        if (!subsegment) { return; }

        if (isPromise(result))
        {
          result
            .then(() =>
            {
              subsegment.close();
            })
            .catch((error) =>
            {
              subsegment.close(error);
            });
        }
        else
        {
          subsegment.close();
        }
      });

      return result;
    },
    addAnnotation: (key, value) =>
    {
      AWSXRay.getSegment().addAnnotation(key, value);
      // console.log(`addAnnotation(${key}:${value})`);
    },
    addMetadata: (key, value, namespace) =>
    {
      AWSXRay.getSegment().addMetadata(key, value, namespace);
      // console.log(`addMetadata(${key}:${value})`);
    }
  };
};