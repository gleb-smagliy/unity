import { extractMetadataSaga } from './saga'
import { runSaga } from '../../saga-runner';

export class ReferencesMetadataExtractor
{
  constructor({ metadataName })
  {
    this.metadataName = metadataName;
  }

  extractMetadata = async ({ servicesHash }) =>
  {
    const saga = extractMetadataSaga({
      servicesHash,
      metadataName: this.metadataName
    });

    return await runSaga(saga);
  };
}