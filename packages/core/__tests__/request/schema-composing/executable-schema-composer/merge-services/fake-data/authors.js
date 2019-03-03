import { buildFakeClientSchema } from '../../../../../fake-schema';

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

const AUTHOR_URI = 'http://localhost/authors';

export const authorService =
{
  id: 'Author',
  uri: AUTHOR_URI,
  schema: AUTHOR_SCHEMA
};