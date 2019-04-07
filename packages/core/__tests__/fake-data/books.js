import { buildFakeClientSchema } from '../fake-schema';
import {authorService} from "./authors";

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

const BOOK_ENDPOINT = 'http://localhost/books';

export const bookService =
{
  id: 'Book',
  endpoint: BOOK_ENDPOINT,
  args: {},
  schema: BOOK_SCHEMA,
  metadata: [{ name: 'ref' }]
};

export const createBookService = (overrides = {}) => ({
  ...bookService,
  ...overrides
});