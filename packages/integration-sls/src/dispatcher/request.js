const { buildExecutableSchemaQuery, schemaContextEnhancer, composeContextEnhancers, tracing } = require('@soyuz/core');
const { ApolloServer } = require('apollo-server-lambda');
const { options } = require('./options');
const { getTag, getVersion } = require('./utils');
const { createTracer } = require('./console-tracer');

const tracer = createTracer();

tracing.configure({
  trace: true,
  logLevel: 'INFO',
  tracer
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

        schemaQuery({ tag, version })
            .then(createHandler)
            .then(handler => handler(event, context, callback));
    }
};

module.exports.handler = createHandler(options, { playground: true });