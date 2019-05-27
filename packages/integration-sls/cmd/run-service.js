const { createServer } = require('../src/service');

process.on('SIGINT', process.exit);

createServer({ port: 35575 }).then(({ endpoint }) => console.log('endpoint:', endpoint));