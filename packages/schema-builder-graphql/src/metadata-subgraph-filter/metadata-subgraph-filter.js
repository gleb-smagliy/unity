import { FilterRootFields } from 'graphql-tools';
import { removeTypesSubgraph } from './remove-types';

const QUERY_OPERATION = 'Query';

const removeRootField = ({ metadataQueryName }) =>
  new FilterRootFields((operation, fieldName) => operation !== QUERY_OPERATION || fieldName !== metadataQueryName);

export const getTransforms = ({ metadataQueryName, schema }) => [
  removeRootField({ metadataQueryName, schema }),
  removeTypesSubgraph({ metadataQueryName, schema })
];