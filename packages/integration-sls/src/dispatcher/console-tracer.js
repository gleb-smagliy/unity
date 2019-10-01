const isPromise = obj =>
  !!obj && (typeof(obj) === 'object' || typeof(obj) === 'function') && typeof(obj.then) === 'function';

module.exports.createTracer = () => {
  return {
    wrap: (operationName, func) => (...args) =>
    {
      console.log('start operation: ', operationName);

      try {
        const result = func(...args);

        if(isPromise(result))
        {
          result.then(() =>
          {
            console.log('finished async operation:', operationName);
          })
            .catch((e) =>
            {
              console.log(`finished async operation <${operationName}> with error:`, e);
            });
        }
        else
        {
          console.log('finished sync operation:', operationName);
        }
      }
      catch(e)
      {
        console.log(`finished sync operation <${operationName}> with error:`, e);
      }

      return result;
    },
    addAnnotation: (key, value) => {
      console.log(`addAnnotation(${key}:${value})`);
    },
    addMetadata: (key, value) => {
      console.log(`addMetadata(${key}:${value})`);
    },
    log(...args) {
      console.log('LOG:', ...args);
    },
    error(...args) {
      console.log('ERROR:', ...args);
    },
    debug(...args) {
      console.log('DEBUG:', ...args);
    },
    trace(...args) {
      console.log('TRACE:', ...args);
    },
    info(...args) {
      console.log('INFO:', ...args);
    }
  };
};