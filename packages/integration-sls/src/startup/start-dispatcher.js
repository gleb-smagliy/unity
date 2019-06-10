const { spawn } = require('child_process');
const { findFreePort } = require('./get-free-port');
const wait = require('waait');

const MAX_TRIES = 15;
const WAIT_INTERVAL = 1000;

const getEndpoint = port => `http://localhost:${port}`;
const getStartedPattern = endpoint => `Offline listening on ${endpoint}`;

const startDispatcher = async ({ port, debug = false } = {}) =>
{
  let tries = 0;
  let shouldClose = false;
  let stdOut = '';
  let stdErr = '';

  const offlinePort = await findFreePort(port || 3001);
  const dynamodbPort = await findFreePort(offlinePort + 1);
  const endpoint = getEndpoint(offlinePort);
  const pattern = getStartedPattern(endpoint);

  debug && console.log('get free offline port:', offlinePort);
  debug && console.log('get free dynamodb port:', dynamodbPort);

  const cp = spawn('node', ['--preserve-symlinks', './node_modules/serverless/bin/serverless', 'offline', 'start', '--offlinePort', offlinePort, '--dynamodbPort', dynamodbPort]);

  cp.stdout.on('data', d =>
  {
    const data = d.toString();

    debug && console.log(data);
    stdOut += data;
  });

  cp.stderr.on('data', d =>
  {
    const data = d.toString();

    console.error(data);

    shouldClose = true;
    stdErr += data;
  });

  cp.on('close', (code) =>
  {
    if(code !== null)
    {
      shouldClose = true;
      console.log(`child process on ${endpoint} exited with code ${code}`);
    }
  });

  while(tries < MAX_TRIES)
  {
    switch(true)
    {
      case stdOut.indexOf(pattern) !== -1:
      {
        return {
          close: () => {
            cp.kill();
          },
          registerEndpoint: `${endpoint}/register`,
          endpoint
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