const { spawn } = require('child_process');

const cp = spawn('node', ['--preserve-symlinks', './node_modules/serverless/bin/serverless', 'offline', 'start', '--offlinePort 3003']);

cp.stdout.on('data', d => console.log(d.toString()));

cp.stderr.on('data', d => console.error(d.toString()));

cp.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});