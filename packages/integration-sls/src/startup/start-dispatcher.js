const { spawn } = require('child_process');
const { findFreePort } = require('./get-free-port');
const wait = require('waait');

const MAX_TRIES = 15;
const WAIT_INTERVAL = 1000;

const getEndpoint = port => `http://localhost:${port}`;
const getStartedPattern = endpoint => `Offline listening on ${endpoint}`;

const startDispatcher = async ({ port = parseInt(Math.random()*10000 + 30000), debug = false } = {}) =>
{
  let tries = 0;
  let shouldClose = false;
  let stdOut = '';
  let stdErr = '';

  const offlinePort = await findFreePort(port);
  const dynamodbPort = await findFreePort(offlinePort + 7);
  const endpoint = getEndpoint(offlinePort);
  const pattern = getStartedPattern(endpoint);

  debug && console.log('get free offline port:', offlinePort);
  debug && console.log('get free dynamodb port:', dynamodbPort);

  const cp = spawn('node', ['--preserve-symlinks', './node_modules/serverless/bin/serverless', 'offline', 'start', '--offlinePort', offlinePort, '--dynamodbPort', dynamodbPort]);

  cp.stdout.on('data', d =>
  {
    const data = d.toString();

    debug && !shouldClose && console.log(data);
    stdOut += data;
  });

  cp.stderr.on('data', d =>
  {
    const data = d.toString();

    console.error(data);

    shouldClose = true;
    stdErr += data;
  });

  while(tries < MAX_TRIES)
  {
    switch(true)
    {
      case stdOut.indexOf(pattern) !== -1:
      {
        return {
          close: () => {
            shouldClose = true;
            cp.kill();
          },
          registerEndpoint: `${endpoint}/register`,
          endpoint: `${endpoint}/request`
        }
      }
      case shouldClose:
        cp.kill();
        throw new Error('Process exited: process error');
      default:
        await wait(WAIT_INTERVAL);
        tries++;
    }
  }

  throw new Error('Process exited: timeout');
};

module.exports = {
  startDispatcher
};