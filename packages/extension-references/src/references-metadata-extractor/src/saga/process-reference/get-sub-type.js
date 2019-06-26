import { getNullableType, isListType } from 'graphql';

export const getSubType = (type) =>
{
  const nullableType = getNullableType(type);

  if(isListType(nullableType))
  {
    return getNullableType(nullableType.ofType);
  }

  return nullableType;
};