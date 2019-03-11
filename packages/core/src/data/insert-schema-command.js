import { composeResultsAsync } from '../common-modules/operation-result';

export const buildInsertSchemaCommand = ({ insertServices, insertMetadata }) => async ({ version, services, metadata }) =>
{
  const result = await composeResultsAsync(
    insertServices({ version, services }),
    insertMetadata({ version, metadata }),
  );

  if(!result.success)
  {
    return result;
  }

  return {
    success: true
  }
};