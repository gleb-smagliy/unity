import { FilterRootFields, FilterTypes } from 'graphql-tools';
import {
  isObjectType,
  isAbstractType,
  isScalarType,
  getNamedType,
  isInputType
} from 'graphql';

const QUERY_OPERATION = 'Query';

const isRootLevelType = (type, schema) =>
  type === schema.getQueryType() || type === schema.getMutationType() || type === schema.getSubscriptionType();

const removeRootField = ({ metadataQueryName }) =>
  new FilterRootFields((operation, fieldName) => operation !== QUERY_OPERATION || fieldName !== metadataQueryName);


const getFieldArgsTypes = field => field.args.map(a => a.type);

const removeTypesSubgraph = ({ metadataQueryName, schema }) =>
{
  const types = [];
  const visitedTypes = {};
  const bannedTypes = {};

  const query = schema.getQueryType().getFields()[metadataQueryName];

  if(query !== undefined)
  {
    types.push(query.type);
    types.push(...getFieldArgsTypes(query))
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
        if(!isRootLevelType(field.type, schema))
        {
          types.push(field.type);
        }

        if(!isInputType(type))
        {
          types.push(...getFieldArgsTypes(field));
        }
      }

      if(isObjectType(type))
      {
        const interfaces = type.getInterfaces();

        for(let typeInterface of interfaces)
        {
          types.push(typeInterface);
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