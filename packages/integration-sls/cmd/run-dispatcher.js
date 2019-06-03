const { startDispatcher } = require('../src/startup');

startDispatcher({ debug: true }).then(({ endpoint }) =>
{
  console.log(`Got endpoint: ${endpoint}`);
});