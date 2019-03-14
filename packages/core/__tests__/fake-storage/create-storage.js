import { bookService, authorService } from '../fake-data';
import { PLUGINS_NAMES } from '../fake-plugins';

const DEFAULT_SERVICES = [bookService, authorService];

export const services = DEFAULT_SERVICES;

export const METADATA = {
  [PLUGINS_NAMES.EXTENSION_BUILDER]: { key: 1 },
  [PLUGINS_NAMES.SERVICE_TRANSFORMER]: { key: 2 },
  [PLUGINS_NAMES.GATEWAY_TRANSFORMER]: { key: 3 }
};

export const RETURN_VERSION = 'aaaa-bbbb';

export const createSuccessfulStorage = ({ services = DEFAULT_SERVICES } = {}) => ({
  queries: {
    getServicesByVersion: jest.fn().mockReturnValue({ success: true, payload: services }),
    // getMetadataByVersion: jest.fn().mockReturnValue({ success: true, payload: METADATA }),
    getSchemaByVersion: jest.fn().mockReturnValue({
      success: true,
      payload: {
        pluginsMetadata: METADATA,
        services
      }
    }),
    getVersionByTag: jest.fn().mockResolvedValue({ success: true, payload: RETURN_VERSION })
  },
  commands: {
    insertSchema: jest.fn().mockReturnValue({ success: true }),
    upsertTag: jest.fn().mockResolvedValue({ success: true, payload: RETURN_VERSION }),
  }
});