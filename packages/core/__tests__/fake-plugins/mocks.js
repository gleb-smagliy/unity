import {exampleExtensionBuilder, exampleGatewayTransformer, exampleServiceTransformer,PLUGINS_NAMES} from "./create-plugins";
import {extensions, gatewayTransformations, servicesTransformations} from "../fake-data";

export const createSuccessfulMocks = () => {
  const metadata = {
    [PLUGINS_NAMES.EXTENSION_BUILDER]: { extensionBuilderKey: 'extension_builder_value' },
    [PLUGINS_NAMES.GATEWAY_TRANSFORMER]: { gatewayTransformerKey: 'gateway_transformer_value' },
    [PLUGINS_NAMES.SERVICE_TRANSFORMER]: { serviceTransformerKey: 'service_transformer_value' },
  };

  const extensionBuilder = exampleExtensionBuilder({
    success: true,
    extensions,
    name: PLUGINS_NAMES.EXTENSION_BUILDER
  });

  const gatewayTransformer = exampleGatewayTransformer({
    success: true,
    transforms: gatewayTransformations,
    name: PLUGINS_NAMES.GATEWAY_TRANSFORMER
  });

  const serviceTransformer = exampleServiceTransformer({
    success: true,
    transforms: servicesTransformations,
    name: PLUGINS_NAMES.SERVICE_TRANSFORMER
  });

  return {
    extensionBuilders: [extensionBuilder],
    gatewaySchemaTransformers: [gatewayTransformer],
    serviceSchemaTransformers: [serviceTransformer],
    metadata
  }
};