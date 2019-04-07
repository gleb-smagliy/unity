import { ReferencesMetadataExtractor } from '../../src/references-metadata-extractor/src/references-metadata-extractor';
import { createServicesHash } from './create-services-hash';
import { validSchema, validMetadata } from './valid-schema';

const metadataName = 'ref';

describe('ReferencesMetadataExtractor', () =>
{
  it('should extract reference metadata successfully with valid schema and valid schema metadata', async () =>
  {
    const extractor = new ReferencesMetadataExtractor({ metadataName });
    const servicesHash = createServicesHash(validSchema, validMetadata);

    const result = await extractor.extractMetadata({ servicesHash });

    expect(result).toBeSuccessful();
  });

  it('should extract valid reference metadata model when valid schema and valid schema metadata passed', async () =>
  {
    const extractor = new ReferencesMetadataExtractor({ metadataName });
    const servicesHash = createServicesHash(validSchema, validMetadata);

    const result = await extractor.extractMetadata({ servicesHash });

    expect(result).toBeSuccessful([{
      sourceType: 'Availability',
      targetKeys: ['ids'],
      targetQuery: {
        name: 'membershipLevelsByIds'
      },
      sourceKeys: ['membershipLevelIds'],
      aliasField: {
        type: '[MembershipLevel]',
        name: 'levels'
      }
    }]);
  });

  it('should return failure when arguments are not valid', async () =>
  {
    const extractor = new ReferencesMetadataExtractor({ metadataName });
    const servicesHash = createServicesHash(validSchema, {
      ...validMetadata,
      arguments: []
    });

    const result = await extractor.extractMetadata({ servicesHash });

    expect(result).toBeFailed();
  });

  it('should return failure when schema does not contain source object', async () =>
  {
    const schema = `
      type MembershipLevel { id: ID! }
    
      type Availability_New { membershipLevelIds: [ID!] }
    
      type Query { membershipLevelsByIds(ids: [ID!]): [MembershipLevel] }
    `;

    const extractor = new ReferencesMetadataExtractor({ metadataName });
    const servicesHash = createServicesHash(schema, validMetadata);

    const result = await extractor.extractMetadata({ servicesHash });

    expect(result).toBeFailed();
  });

  it('should return failure when schema does not contain target query', async () =>
  {
    const schema = `
      type MembershipLevel { id: ID! }
    
      type Availability { membershipLevelIds: [ID!] }
    
      type Query { membershipLevelsByIds_V2(ids: [ID!]): [MembershipLevel] }
    `;

    const extractor = new ReferencesMetadataExtractor({ metadataName });
    const servicesHash = createServicesHash(schema, validMetadata);

    const result = await extractor.extractMetadata({ servicesHash });

    expect(result).toBeFailed();
  });

  it('should return failure when target query contains no arguments', async () =>
  {
    const schema = `
      type MembershipLevel { id: ID! }
    
      type Availability { membershipLevelIds: [ID!] }
    
      type Query { membershipLevelsByIds: [MembershipLevel] }
    `;

    const extractor = new ReferencesMetadataExtractor({ metadataName });
    const servicesHash = createServicesHash(schema, validMetadata);

    const result = await extractor.extractMetadata({ servicesHash });

    expect(result).toBeFailed();
  });

  it('should return failure when target query does not accept list', async () =>
  {
    const schema = `
      type MembershipLevel { id: ID! }
    
      type Availability { membershipLevelIds: [ID!] }
    
      type Query { membershipLevelsByIds(ids: ID!): [MembershipLevel] }
    `;

    const extractor = new ReferencesMetadataExtractor({ metadataName });
    const servicesHash = createServicesHash(schema, validMetadata);

    const result = await extractor.extractMetadata({ servicesHash });

    expect(result).toBeFailed();
  });

  it('should return failure when source key does not exists', async () =>
  {
    const schema = `
      type MembershipLevel { id: ID! }
    
      type Availability { membershipLevelIds_V2: [ID!] }
    
      type Query { membershipLevelsByIds(ids: [ID!]): [MembershipLevel] }
    `;

    const extractor = new ReferencesMetadataExtractor({ metadataName });
    const servicesHash = createServicesHash(schema, validMetadata);

    const result = await extractor.extractMetadata({ servicesHash });

    expect(result).toBeFailed();
  });

  it('should return failure when source key sub type does not match target key sub type', async () =>
  {
    const schema = `
      type MembershipLevel { id: ID! }
    
      type Availability { membershipLevelIds: [ID!] }
    
      type Query { membershipLevelsByIds(ids: [Int!]): [MembershipLevel] }
    `;

    const extractor = new ReferencesMetadataExtractor({ metadataName });
    const servicesHash = createServicesHash(schema, validMetadata);

    const result = await extractor.extractMetadata({ servicesHash });

    expect(result).toBeFailed();
  });
});