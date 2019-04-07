import { getSubType } from './get-sub-type';

export function* getSourceKeys({ schema, typeObject, fieldName })
{
  const sourceField = typeObject.getFields()[fieldName];

  if(typeof(sourceField) !== 'object' || sourceField === null)
  {
    return {
      success: false,
      error: `ExtractReferenceMetadata: source field ${fieldName} is not present on ${typeObject}`
    };
  }

  const keyName = sourceField.name;
  const keyType = sourceField.type;
  const keySubType = getSubType(keyType);

  return {
    success: true,
    payload: {
      keys: [keyName],
      sourceKeySubtype: keySubType,
      sourceKeyType: keyType
    }
  };
}