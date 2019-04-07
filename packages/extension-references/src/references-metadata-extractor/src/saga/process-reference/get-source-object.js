export function* getSourceObject({ schema, typeName })
{
  const typeObject = schema.getType(typeName);

  if(typeof(typeObject) !== 'object' || typeObject === null)
  {
    return {
      success: false,
      error: `ExtractReferenceMetadata: expected type ${typeName} to be presented in schema, instead got: ${JSON.stringify(typeObject)}`
    };
  }

  return {
    success: true,
    payload: {
      typeObject
    }
  };
}