const { makeExecutableSchema } = require('graphql-tools');
const { } = require('graphql-tag');

const typeDefs = `
  type Author {
    id: ID!
    firstName: String!
    lastName: String!
  }

  type Query {
    authorById(id: ID!): Author!
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

const verifyData = (data, alias = 'authorById') =>
  expect(data[alias]).toEqual(author);

const verifyResolvers = (resolvers, expectedArgs) =>
{
  expect(resolvers.Query.authorById).toHaveBeenCalled();
  const actualArgs = resolvers.Query.authorById.mock.calls[0][1];

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
    verifyResolvers: expectedArgs => verifyResolvers(resolvers, expectedArgs),
    verifyData
  };
};