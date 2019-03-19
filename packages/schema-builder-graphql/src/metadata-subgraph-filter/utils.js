import { isInputType, isObjectType, isInterfaceType } from "graphql";

export const getFieldArgsTypes = field => field.args.map(a => a.type);

export const isRootLevelType = (type, schema) =>
  type === schema.getQueryType() || type === schema.getMutationType() || type === schema.getSubscriptionType();

export const canContainFields = (type) => typeof(type.getFields) === 'function';

export const getTypeDependencies = (type, schema) =>
{
  const types = [];
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
    types.push(...type.getInterfaces());
  }

  return types;
};