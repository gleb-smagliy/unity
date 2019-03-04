export const extensions = {
  typeDefs: [`
    extend type Author
    {
      bestTitle: String!
    }
  `],
  resolvers: [{
    Author: {
      bestTitle: {
        fragment: `... on Author { name }`,
        resolve: author => getBestTitle(author.name)
      }
    }
  }]
};

export const getBestTitle = name => `The house that ${name} built`;