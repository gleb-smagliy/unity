const { createSchema: booksSchema } = require('./services/books');
const { createSchema: authorsSchema } = require('./services/authors');

module.exports.cases = [
  {
    services: [
      authorsSchema()
    ],
    description: 'Call to single registered service'
  }
];