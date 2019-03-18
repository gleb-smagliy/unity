import { CASES } from './cases';
import { getTransforms } from '../../src/metadata-subgraph-filter/metadata-subgraph-filter';
import { DEFAULT_OPTIONS } from '../../src/graphql-schema-builder/graphql-schema-builder';
import { transformSchema } from 'graphql-tools';
import { buildSchema } from 'graphql';

const getTypeFields = type => type === undefined || type === null ? [] : Object.keys(type.getFields());

const getRootFields = schema => ({
  Query: getTypeFields(schema.getQueryType()),
  Mutation: getTypeFields(schema.getMutationType()),
  Subscription: getTypeFields(schema.getSubscriptionType()),
});

const getSchemaTypes = schema => Object.keys(schema.getTypeMap());

describe('metadata subgraph filter', () =>
{
  for(let testCase of CASES)
  {
    let run = testCase.skip ? it.skip : it;
    run = testCase.only ? it.only : run;

    run(testCase.description, () =>
    {
      const inputSchema = buildSchema(testCase.input);
      const transforms = getTransforms({
        schema: inputSchema,
        metadataQueryName: testCase.metadataQueryName || DEFAULT_OPTIONS.metadataQueryName
      });

      const expectedSchema = buildSchema(testCase.expected);
      const actualSchema = transformSchema(inputSchema, transforms);

      expect(getRootFields(actualSchema)).toEqual(getRootFields(expectedSchema));
      expect(getSchemaTypes(actualSchema)).toEqual(getSchemaTypes(expectedSchema));
    });
  }
});