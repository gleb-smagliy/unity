import { buildExecutableSchemaComposer } from "../../../../../src/request/schema-composing/executable-schema-composer";

const successResult = (payload) => ({
  success: true,
  payload
});

const errorResult = () => ({
  success: false,
  error: 'unknown error'
});

export const exampleExtensionBuilder = ({ success, name, extensions }) => ({
  name,
  buildSchemaExtensions: jest.fn().mockReturnValue(success ? successResult(extensions) : errorResult())
});

export const exampleGatewayTransformer = ({ success, name, transforms }) => ({
  name,
  getTransforms: jest.fn().mockReturnValue(success ? successResult(transforms) : errorResult())
});

export const exampleServiceTransformer = ({ success, name, transforms }) => ({
  name,
  getTransforms: jest.fn().mockImplementation(({ service }) => {
    if(!success) return errorResult();

    return successResult(transforms[service.id]);
  })
});

export const composeExampleSchema = ({
  services,
  metadata,
  extensionBuilders = [],
  serviceSchemaTransformers = [],
  gatewaySchemaTransformers = []
} = {}) =>
{
  const composer = buildExecutableSchemaComposer({
    extensionBuilders,
    serviceSchemaTransformers,
    gatewaySchemaTransformers
  });

  return composer({ services, metadata });
};