const { makeExecutableSchema } = require('graphql-metadata-introspection');

const typeDefs = `
  directive @ref(query: String!, as: String!) on FIELD_DEFINITION

  type Author {
    id: ID!
      @ref(query: "topBooksByAuthorsIds", as: "topBook")
    firstName: String!
    lastName: String!
    booksIds: [ID!] 
      @ref(query: "booksByIds", as: "books")
  }

  type Query {
    authorById(id: Int!): Author!
  }
`;

const author = {
  id: 'author_abcd',
  firstName: 'John',
  lastName: 'Doe',
  booksIds: ['book_a', 'book_b'],
  topBookId: 'book_a'
};

const createResolvers = () => ({
  Query: {
    authorById: jest.fn().mockResolvedValue(author)
  }
});

const verifyData = (data, alias = 'authorById') =>
  expect(data[alias]).toMatchObject(author);

const verifyResolvers = (resolvers, expectedArgs) =>
{
  expect(resolvers.Query.authorById).toHaveBeenCalled();
  const actualArgs = resolvers.Query.authorById.mock.calls[0][1];

  expect(actualArgs).toEqual(expectedArgs);
};

const verifyHeaders = (resolvers, expectedHeaders) =>
{
  expect(resolvers.Query.authorById).toHaveBeenCalled();
  const actualHeaders = resolvers.Query.authorById.mock.calls[0][2].headers;

  expect(actualHeaders).toMatchObject(expectedHeaders);
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
    verifyHeaders: expectedHeaders => verifyHeaders(resolvers, expectedHeaders),
    verifyResolvers: expectedArgs => verifyResolvers(resolvers, expectedArgs),
    verifyData
  };
};