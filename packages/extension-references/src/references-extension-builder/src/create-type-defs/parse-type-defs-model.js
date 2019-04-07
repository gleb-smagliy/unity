export const parseTypeDefsModel = (model) =>
{
  if(typeof(model.aliasField) !== 'object')
  {
    return {
      success: false,
      error: `ReferencesExtensionBuilder: Expected model.aliasField to be an object, but got: ${typeof(model.aliasField)}`
    };
  }

  if(typeof(model.aliasField.name) !== 'string')
  {
    return {
      success: false,
      error: `ReferencesExtensionBuilder: Expected model.aliasField.name to be a string, but got: ${model.aliasField.name}`
    };
  }

  if(typeof(model.aliasField.type) !== 'string')
  {
    return {
      success: false,
      error: `ReferencesExtensionBuilder: Expected model.aliasField.type to be a string, but got: ${model.aliasField.type}`
    };
  }

  if(typeof(model.sourceType) !== 'string')
  {
    return {
      success: false,
      error: `ReferencesExtensionBuilder: Expected model.sourceType to be a string, but got: ${model.sourceType}`
    };
  }

  return {
    success: true,
    payload: {
      sourceType: model.sourceType,
      aliasName: model.aliasField.name,
      aliasType: model.aliasField.type
    }
  }
};