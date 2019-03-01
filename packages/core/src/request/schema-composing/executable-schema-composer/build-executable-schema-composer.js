import { buildCompositeServicesTransformer } from './build-composite-services-transformer';
import { buildCompositeExtensionBuilder } from './build-composite-extension-builder';
import { buildCompositeGatewaySchemaTransformer } from './build-composite-gateway-transformer';
import { mergeServices } from './merge-services';

export const buildExecutableSchemaComposer = (options) =>
{
  const extensionsBuilder = buildCompositeExtensionBuilder(options.extensionBuilders);
  const servicesTransformer = buildCompositeServicesTransformer(options.serviceSchemaTransformers);
  const gatewayTransformer = buildCompositeGatewaySchemaTransformer(options.gatewaySchemaTransformers);

  return ({ services, metadata }) =>
  {
    const schemaSpecification = { services, metadata };

    const servicesTransformations = servicesTransformer(schemaSpecification);
    const extensions = extensionsBuilder(schemaSpecification);
    const gatewayTransformations = gatewayTransformer(schemaSpecification);

    return mergeServices(services, {
      servicesTransformations,
      extensions,
      gatewayTransformations
    });
  };
};