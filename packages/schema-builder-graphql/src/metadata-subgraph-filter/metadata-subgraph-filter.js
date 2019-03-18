import { FilterRootFields, FilterTypes } from 'graphql-tools';
import {
  isInterfaceType,
  isObjectType,
  isAbstractType,
  isScalarType,
  getNamedType
} from 'graphql';

const QUERY_OPERATION = 'Query';

const removeRootField = ({ metadataQueryName, schema }) =>
  new FilterRootFields((operation, fieldName) => operation.toLowerCase() !== QUERY_OPERATION || fieldName !== metadataQueryName);

const getFieldType = field => field.type;

const removeTypesSubgraph = ({ metadataQueryName, schema }) =>
{
  const types = [];
  const visitedTypes = {};
  const bannedTypes = {};

  const query = schema.getQueryType().getFields()[metadataQueryName];

  if(query !== undefined)
  {
    const returnType = schema.getType(query.type);
    types.push(query.type);
  }

  while(types.length > 0)
  {
      const type = getNamedType(types.shift());

      if(type === undefined)
      {
        continue;
      }

      if(isScalarType(type) || visitedTypes[type.name] !== undefined)
      {
        visitedTypes[type.name] = 1;
        continue;
      }

      if(isAbstractType(type))
      {
        const possibleTypes = schema.getPossibleTypes(type);

        for(let possibleType of possibleTypes)
        {
          types.push(possibleType);
        }

        visitedTypes[type.name] = 1;
        bannedTypes[type.name] = 1;
        continue;
      }

      const fields = type.getFields();

      for(let field of Object.values(fields))
      {
        types.push(schema.getType(field.type));
      }

      if(isObjectType(type))
      {
        const interfaces = type.getInterfaces();

        for(let typeInterface of interfaces)
        {
          types.push(schema.getType(typeInterface));
        }
      }

      bannedTypes[type.name] = 1;
      visitedTypes[type.name] = 1;
  }

  return new FilterTypes(type => bannedTypes[type.name] === undefined);
};

export const getTransforms = ({ metadataQueryName, schema }) => [
  removeRootField({ metadataQueryName, schema }),
  removeTypesSubgraph({ metadataQueryName, schema })
];