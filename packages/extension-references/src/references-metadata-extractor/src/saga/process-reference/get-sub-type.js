import { getNullableType, isListType } from 'graphql';

export const getSubType = (type) =>
{
  const nullableType = getNullableType();

  if(isListType(nullableType))
  {
    return type.ofType;
  }

  return type;
};