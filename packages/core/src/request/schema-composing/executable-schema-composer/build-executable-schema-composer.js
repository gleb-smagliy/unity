import { buildCompositeGatewayTransformer } from './build-composite-gateway-transformer';
import { buildCompositeServicesTransformer } from './build-composite-service-transformer';
import { buildCompositeExtensionBuilder } from './build-composite-extension-builder';
import { mergeServices } from './merge-services';

export const buildExecutableSchemaComposer = (options) =>
{
  const extensionsBuilder = buildCompositeExtensionBuilder(options.extensionBuilders);
  const servicesTransformer = buildCompositeServicesTransformer(options.serviceSchemaTransformers);
  const gatewayTransformer = buildCompositeGatewayTransformer(options.gatewaySchemaTransformers);

  return ({ services, metadata }) =>
  {
    const schemaSpecification = { services, metadata };

    const buildServicesTransformations = servicesTransformer(schemaSpecification);
    if(!buildServicesTransformations.success) return buildServicesTransformations;

    const buildExtensions = extensionsBuilder(schemaSpecification);
    if(!buildExtensions.success) return buildExtensions;

    const buildGatewayTransformations = gatewayTransformer(schemaSpecification);
    if(!buildGatewayTransformations.success) return buildGatewayTransformations;

    const payload = mergeServices(services, {
      servicesTransformations: buildServicesTransformations.payload,
      extensions: buildExtensions.payload,
      gatewayTransformations: buildGatewayTransformations.payload
    });

    return {
      success: true,
      payload
    }
  };
};