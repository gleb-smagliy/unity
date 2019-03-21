import { buildFakeClientSchema } from '../fake-schema';

const AUTHOR_SCHEMA = buildFakeClientSchema(`
  type Author {
    id: ID!
    name: String!
  }
  
  type Query {
    randomAuthor: Author!
  }
`);

export const AUTHOR_RESPONSE = {
  data: {
    randomAuthor: {
      id: "1",
      name: 'Jack'
    }
  }
};

const AUTHOR_ENDPOINT = 'http://localhost/authors';

export const authorService =
{
  id: 'Author',
  endpoint: AUTHOR_ENDPOINT,
  args: {},
  schema: AUTHOR_SCHEMA
};

export const createAuthorService = (overrides = {}) => ({
  ...authorService,
  ...overrides
});