import { parseTypeDefsModel } from './parse-type-defs-model';

export const createTypeDefs = (model) =>
{
  const parseResult = parseTypeDefsModel(model);

  if(!parseResult.success)
  {
    return parseResult;
  }

  const { sourceType, aliasName, aliasType } = parseResult.payload;

  const payload = `
    extend type ${sourceType}
    {
      ${aliasName}: ${aliasType}
    }
  `;

  return {
    success: true,
    payload
  }
};