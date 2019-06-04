const { startService } = require('../src/startup');

process.on('SIGINT', process.exit);

startService({ port: 35575 }).then(({ endpoint }) => console.log('endpoint:', endpoint));