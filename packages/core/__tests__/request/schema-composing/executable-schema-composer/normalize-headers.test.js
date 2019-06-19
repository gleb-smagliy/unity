import { normalizeHeaders } from "../../../../src/request/schema-composing/executable-schema-composer/normalize-headers";

const testCases = [
  {
    should: 'return empty headers when headers are undefined',
    input: undefined,
    expectedOutput: {}
  },
  {
    should: 'leave headers unchanged if merge is not neccesary',
    input: { 'x-api-key': 'abc', 'x-user-id': '123' },
    expectedOutput: { 'x-api-key': 'abc', 'x-user-id': '123' }
  },
  {
    should: 'make headers lower case',
    input: { 'X-Api-Key': 'abc' },
    expectedOutput: { 'x-api-key': 'abc' }
  },
  {
    should: 'omit default headers (e.g. host, content-type)',
    input: { 'host': 'unknown', 'Content-Type': 'application/json' },
    expectedOutput: { },
  },
];

describe('normalizeHeaders', () =>
{
  for(const testCase of testCases)
  {
    const { should, input, expectedOutput } = testCase;

    it(`should ${should}`, () =>
    {
      expect(normalizeHeaders(input)).toEqual(expectedOutput);
    });
  }
});