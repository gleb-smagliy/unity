import { getNamedType, isAbstractType, isScalarType, isObjectType, isInterfaceType, isInputType } from "graphql";
import { FilterTypes } from "graphql-tools";
import { getFieldArgsTypes, getTypeDependencies, canContainFields } from './utils'
import { TypesRegistry } from "./types-registry";

export const removeTypesSubgraph = ({ metadataQueryName, schema }) =>
{
  const types = [];
  const registry = new TypesRegistry();

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

    if(isScalarType(type) || registry.isVisited(type))
    {
      registry.setVisited(type);
      continue;
    }

    if(isAbstractType(type))
    {
      types.push(...schema.getPossibleTypes(type));

      registry.setBanned(type);
      continue;
    }

    if(canContainFields(type))
    {
      types.push(...getTypeDependencies(type, schema));
    }

    registry.setBanned(type);
  }

  return new FilterTypes(type => !registry.isBanned(type));
};