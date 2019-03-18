export const CASES = [
  {
    input: `
      type Query {
        name: String
      }
    `,
    expected: `
      type Query {
        name: String
      }
    `,
    description: 'leave unchanged schema without metadata'
  }
];