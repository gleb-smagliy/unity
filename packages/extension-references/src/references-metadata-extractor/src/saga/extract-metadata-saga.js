import { effects } from '../../../saga-runner';
import { getRefArguments } from './get-ref-arguments';

function* getTargetKeys({ schema, query })
{
  return {
    success: true,
    payload: {
      keys: ['ids'],
      targetKeySubtype: 'ID!',
      targetKeyType: '[ID!]'
    }
  };
}

function* getSourceKeys({ schema, typeObject, fieldName })
{
  return {
    success: true,
    payload: {
      keys: ['levelsIds'],
      sourceKeySubtype: 'ID!',
      sourceKeyType: '[ID!]'
    }
  };
}

function* getAliasField({ targetKeysDefinition, sourceKeysDefinition, aliasName })
{
  return {
    success: true,
    payload: {
      name: aliasName,
      type: '[Level]'
    }
  };
}

function* processReference({ reference, servicesHash })
{
  const {
    typeName,
    fieldName,
    args
  } = reference;

  const { aliasName, query } = yield effects.call(getRefArguments(args));

  const schema = servicesHash.getTransformedClientSchema();

  const { typeObject } = yield effects.call(getSource, { schema, typeName });
  const targetKeysDefinition = yield effects.call(getTargetKeys, { schema, query });
  const sourceKeysDefinition = yield effects.call(getSourceKeys, { schema, typeObject, fieldName });

  const aliasField = effects.call(getAliasField, { targetKeysDefinition, sourceKeysDefinition, aliasName });

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
        type: aliasField.type,
        name: aliasField.name
      }
    }
  }
}

export function* extractMetadataSaga({ servicesHash, metadataName })
{
  const references = yield effects.call(servicesHash.getMetadata, { name: metadataName });
  const metadatas = [];

  for(let reference of references)
  {
    const { metadata } = yield call(processReference, { reference, servicesHash });
    metadatas.push(metadata);
  }

  return {
    success: true,
    payload: metadatas
  }
}