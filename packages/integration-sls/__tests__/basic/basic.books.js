const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = `
  type Book {
    id: ID!
    title: String!
    description: String!
  }

  type Query {
    bookById(id: Int!): Book!
  }
`;

const book = {
  id: 'book_abcd',
  title: 'Foo',
  description: 'Bar'
};

const createResolvers = () => ({
  Query: {
    bookById: jest.fn().mockResolvedValue(book)
  }
});

const verifyData = (data, alias = 'bookById') =>
  expect(data[alias].id).toEqual(book.id);

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
    verifyData,
    verifyResolvers: expectedArgs => verifyResolvers(resolvers, expectedArgs)
  };
};