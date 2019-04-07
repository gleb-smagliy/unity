import { effects } from '../../../saga-runner';
import { processReference } from './process-reference';

export function* extractMetadataSaga({ servicesHash, metadataName })
{
  const references = yield effects.call(servicesHash.getMetadata, { name: metadataName });
  const referenceMetadataModels = [];

  for(let reference of references)
  {
    const referenceMetadataModel = yield effects.call(processReference, { reference, servicesHash });
    referenceMetadataModels.push(referenceMetadataModel);
  }

  return {
    success: true,
    payload: referenceMetadataModels
  }
}