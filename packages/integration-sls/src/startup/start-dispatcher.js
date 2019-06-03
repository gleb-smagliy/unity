const { spawn } = require('child_process');
const fp = require('find-free-port');
const wait = require('waait');

const MAX_TRIES = 15;
const WAIT_INTERVAL = 1000;

const getEndpoint = port => `http://localhost:${port}`;
const getStartedPattern = endpoint => `Offline listening on ${endpoint}`;

const getFreePort = async (preferredPort) =>
{
  if(!preferredPort)
  {
    const [ port ] = await fp(3000);

    return port;
  }

  return preferredPort;
};

const startDispatcher = async ({ port, debug = false } = {}) =>
{
  let tries = 0;
  let shouldClose = false;
  let stdOut = '';
  let stdErr = '';

  const offlinePort = await getFreePort(port);
  const endpoint = getEndpoint(offlinePort);
  const pattern = getStartedPattern(endpoint);

  console.log('get free port:', offlinePort);

  const cp = spawn('node', ['--preserve-symlinks', './node_modules/serverless/bin/serverless', 'offline', 'start', '--offlinePort', offlinePort]);

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
    shouldClose = true;
    console.log(`child process on ${endpoint} exited with code ${code}`);
  });

  while(tries < MAX_TRIES)
  {
    switch(true)
    {
      case stdOut.indexOf(pattern) !== -1:
      {
        return {
          close: () => {
            
          },
          endpoint
        }
      }
      case shouldClose:
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