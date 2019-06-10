const net = require('net');

const findPort = (port, cb) =>
{
  var server = net.createServer();

  server.listen(port, function (err) {
    server.once('close', function () {
      cb(port)
    });
    server.close();
  });

  server.on('error', function (err) {
    findPort(port + 1, cb);
  })
};

module.exports.findFreePort = preferredPort => {
  return new Promise(resolve => {
    findPort(preferredPort, resolve);
  });
};