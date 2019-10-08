const { format } = require('winston');

const DEFAULT_TRANSOFRMS = {
  timestamp: '@timestamp',
  level: '@log_level',
  message: '@mt'
};

const serilogFormat = format((info, opts) =>
{
  Object.keys(opts.transform).forEach(key =>
  {
    if(info[key])
    {
      info[opts.transform[key]] = info[key];
      delete info[key];
    }
  });

  if(typeof(info.meta) === 'object')
  {
    Object.keys(info.meta).forEach(key =>
    {
      info[key] = info.meta[key];
    });

    delete info.meta;
  }

  return info;
});

const serilogFormatter = (opts = {}) =>
{
  const mergedOpts = {
    ...opts,
    transform: {
      ...DEFAULT_TRANSOFRMS,
      ...(opts.transform || {})
    }
  };

  return serilogFormat(mergedOpts);
};

module.exports = {
  serilogFormatter
};