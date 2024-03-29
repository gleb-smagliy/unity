const {
  buildExecutableSchemaQuery,
  schemaContextEnhancer,
  composeContextEnhancers,
  configureTracing,
  getLogger: l
} = require('@soyuz/core');
const { ApolloServer } = require('apollo-server-lambda');
const { options } = require('./options');
const { getTag, getVersion } = require('./utils');
const { createTracer } = require('./xray-tracer');
const { createLoggerBuilder } = require('./serilog-logger');

const createLogger = createLoggerBuilder({ level: process.env.LOG_LEVEL });
const tracer = createTracer({
  logger: createLogger()
});

configureTracing({
  createLogger
});

const createHandlerFactory = ({ playground }) => schema =>
{
  const server = new ApolloServer({
    schema,
    introspection: true,
    playground,
    context: composeContextEnhancers([
      schemaContextEnhancer,
      ({ event }) => ({ headers: event.headers })
    ])
  });

  return server.createHandler({
    cors: {
      origin: '*',
      credentials: true
    }
  });
};

const createHandler = (options, { playground }) =>
{
  const schemaQuery = buildExecutableSchemaQuery(options);
  const createHandler = createHandlerFactory({ playground });

  return (event, context, callback) =>
  {
    let tag = getTag(event);
    const version = getVersion(event);

    if(!tag && !version)
    {
      tag = 'stable'
    }

    l().useLogging(
      () =>
      {
        schemaQuery({ tag, version })
          .then(createHandler)
          .then(handler => handler(event, context, callback));
      }
    );
  }
};

module.exports.handler = createHandler(options, { playground: true });