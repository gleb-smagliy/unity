const successResult = (payload) => ({
  success: true,
  payload
});

const errorResult = () => ({
  success: false,
  error: 'unknown error'
});

export const PLUGINS_NAMES = {
  EXTENSION_BUILDER: 'EXTENSION_BUILDER',
  GATEWAY_TRANSFORMER: 'GATEWAY_TRANSFORMER',
  SERVICE_TRANSFORMER: 'SERVICE_TRANSFORMER'
};

export const exampleExtensionBuilder = ({ success, name = PLUGINS_NAMES.EXTENSION_BUILDER, extensions }) => ({
  name,
  buildSchemaExtensions: jest.fn().mockReturnValue(success ? successResult(extensions) : errorResult())
});

export const exampleGatewayTransformer = ({ success, name = PLUGINS_NAMES.GATEWAY_TRANSFORMER, transforms }) => ({
  name,
  getTransforms: jest.fn().mockReturnValue(success ? successResult(transforms) : errorResult())
});

export const exampleServiceTransformer = ({ success = true, name = PLUGINS_NAMES.SERVICE_TRANSFORMER, transforms } = {}) => ({
  name,
  getTransforms: jest.fn().mockImplementation(({ service }) => {
    if(!success) return errorResult();

    return successResult(transforms[service.id]);
  })
});