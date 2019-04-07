import { isListType, getNullableType, GraphQLList, GraphQLNonNull, isNullableType } from 'graphql';

const buildAliasType = (sourceKeyType, returnType ) =>
{
  const nullableSourceType = getNullableType(sourceKeyType);
  const nullableTargetType = getNullableType(returnType);
  const isTargetNullable = isNullableType(returnType);

  let aliasType = isListType(nullableTargetType) ? nullableTargetType.ofType : nullableTargetType;
  aliasType = isListType(nullableSourceType) ? GraphQLList(aliasType) : aliasType;
  aliasType = isTargetNullable ? aliasType : GraphQLNonNull(aliasType);

  return aliasType;
};

export function* getAliasField({ targetKeysDefinition, sourceKeysDefinition, aliasName, typeObject })
{
  const { targetKeySubtype, returnType } = targetKeysDefinition;
  const { keys: sourceKeys, sourceKeySubtype, sourceKeyType } = sourceKeysDefinition;

  if(targetKeySubtype.toString() !== sourceKeySubtype.toString())
  {
    return {
      success: false,
      error: `ExtractReferenceMetadata: target key type ${targetKeySubtype} does not match source key type ${sourceKeySubtype} on ${typeObject.name}:${sourceKeys[0].name}`
    };
  }

  if(typeObject.getFields()[aliasName])
  {
    return {
      success: false,
      error: `ExtractReferenceMetadata: type ${typeObject.name} already has ${aliasName} field`
    };
  }

  return {
    success: true,
    payload: {
      name: aliasName,
      type: buildAliasType(sourceKeyType, returnType)
    }
  };
}