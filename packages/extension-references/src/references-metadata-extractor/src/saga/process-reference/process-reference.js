import { effects } from "../../../../saga-runner";
import { getReferenceArguments } from "./get-reference-arguments";
import { getSourceKeys } from './get-source-keys';
import { getSourceObject } from './get-source-object';
import { getTargetKeys } from './get-target-keys';
import { getAliasField } from './get-alias-field';

export function* processReference({ reference, servicesHash })
{
  const {
    typeName,
    fieldName,
    arguments: args
  } = reference;

  const schema = yield effects.call(servicesHash.getTransformedClientSchema);

  const { aliasName, query } = yield effects.call(getReferenceArguments, args);
  const { typeObject } = yield effects.call(getSourceObject, { schema, typeName });

  const targetKeysDefinition = yield effects.call(getTargetKeys, { schema, query });
  const sourceKeysDefinition = yield effects.call(getSourceKeys, { schema, typeObject, fieldName });

  const aliasField = yield effects.call(getAliasField, { targetKeysDefinition, sourceKeysDefinition, aliasName, typeObject  });

  const { keys: targetKeys } = targetKeysDefinition;
  const { keys: sourceKeys } = sourceKeysDefinition;

  return {
    success: true,
    payload: {
      sourceType: typeName,
      targetKeys,
      targetQuery: {
        name: query
      },
      sourceKeys,
      aliasField: {
        type: aliasField.type.toString(),
        name: aliasField.name
      }
    }
  }
}