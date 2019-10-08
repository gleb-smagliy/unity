const { createLogger, transports, format } = require('winston');
const { serilogFormatter } = require('./serilog-formatter');

const options = {
  transports: [
    new transports.Console()
  ],
  format: format.combine(
    format.timestamp(),
    serilogFormatter(),
    format.json()
  )
};

module.exports.createLoggerBuilder = (optionsOverride = {}) => () => createLogger({
  ...options,
  ...optionsOverride
});