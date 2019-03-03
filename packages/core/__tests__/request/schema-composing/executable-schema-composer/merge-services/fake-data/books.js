import { buildFakeClientSchema } from '../../../../../fake-schema';

const BOOK_SCHEMA = buildFakeClientSchema(`
  type Book {
    title: String!
  }
  
  type Query {
    randomBook: Book!
  }
`);

export const BOOK_RESPONSE = {
  data: {
    randomBook: {
      title: 'The house that John Doe built'
    }
  }
};

const BOOK_URI = 'http://localhost/books';

export const bookService =
{
  id: 'Book',
  uri: BOOK_URI,
  schema: BOOK_SCHEMA
};