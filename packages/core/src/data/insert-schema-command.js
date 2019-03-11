import { composeResultsAsync } from '../operation-result/compose-results-async';

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