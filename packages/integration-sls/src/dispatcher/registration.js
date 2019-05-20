const { createSchema } = require('@soyuz/core');
const { ApolloServer } = require('apollo-server-lambda');
const { options } = require('./options');

const schema = createSchema(options);

const createHandler = ({ playground }) =>
{
    const server = new ApolloServer({
        schema,
        introspection: true,
        playground
    });

    return server.createHandler({
        cors: {
            origin: '*',
            credentials: true
        }
    });
};

module.exports.handler = createHandler({ playground: true });
