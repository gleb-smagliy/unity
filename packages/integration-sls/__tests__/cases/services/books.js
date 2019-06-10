const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = `
  type Book {
    id: ID!
    title: String!
    description: String!
  }

  type Query {
    bookById(id: ID!): Book!
  }
`;

const author = {
  id: 'author_abcd',
  firstName: 'John',
  lastName: 'Doe'
};

const createResolvers = () => ({
  Query: {
    authorById: jest.fn().mockResolvedValue(author)
  }
});

const verifyResult = (result, alias = 'authorById') =>
  expect(result.data[alias]).toEqual(author);

const verifyResolvers = (resolvers, expectedArgs) =>
{
  expect(resolvers.Query.bookById).toHaveBeenCalled();
  const actualArgs = resolvers.Query.bookById.mock.calls[0][1];

  expect(actualArgs).toEqual(expectedArgs);
};

module.exports.createSchema = () =>
{
  const resolvers = createResolvers();
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });

  return {
    schema,
    verifyResult,
    verifyResolvers: expectedArgs => verifyResolvers(resolvers, expectedArgs)
  };
};