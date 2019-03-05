import {exampleExtensionBuilder, exampleGatewayTransformer, exampleServiceTransformer} from "./create-plugins";
import {extensions, gatewayTransformations, servicesTransformations} from "../fake-data";

export const createSuccessfulMocks = () => {
  const metadata = {
    extensionBuilder: { extensionBuilderKey: 'extension_builder_value' },
    gatewayTransformer: { gatewayTransformerKey: 'gateway_transformer_value' },
    serviceTransformer: { serviceTransformerKey: 'service_transformer_value' },
  };

  const extensionBuilder = exampleExtensionBuilder({
    success: true,
    extensions,
    name: 'extensionBuilder'
  });

  const gatewayTransformer = exampleGatewayTransformer({
    success: true,
    transforms: gatewayTransformations,
    name: 'gatewayTransformer'
  });

  const serviceTransformer = exampleServiceTransformer({
    success: true,
    transforms: servicesTransformations,
    name: 'serviceTransformer'
  });

  return {
    extensionBuilders: [extensionBuilder],
    gatewaySchemaTransformers: [gatewayTransformer],
    serviceSchemaTransformers: [serviceTransformer],
    metadata
  }
};