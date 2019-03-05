import { bookService, authorService } from '../fake-data';
import { PLUGINS_NAMES } from '../fake-plugins';

export const services = [bookService, authorService];

export const METADATA = {
  [PLUGINS_NAMES.EXTENSION_BUILDER]: { key: 1 },
  [PLUGINS_NAMES.SERVICE_TRANSFORMER]: { key: 2 },
  [PLUGINS_NAMES.GATEWAY_TRANSFORMER]: { key: 3 }
};

export const createSuccessfulStorage = () => ({
  getServicesByVersion: jest.fn().mockReturnValue({ success: true, payload: services }),
  getMetadataByVersion: jest.fn().mockReturnValue({ success: true, payload: METADATA })
});