"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildExecutableSchemaComposer = void 0;

var _buildCompositeGatewayTransformer = require("./build-composite-gateway-transformer");

var _buildCompositeServiceTransformer = require("./build-composite-service-transformer");

var _buildCompositeExtensionBuilder = require("./build-composite-extension-builder");

var _mergeServices = require("./merge-services");

const buildExecutableSchemaComposer = options => {
  const extensionsBuilder = (0, _buildCompositeExtensionBuilder.buildCompositeExtensionBuilder)(options.extensionBuilders);
  const servicesTransformer = (0, _buildCompositeServiceTransformer.buildCompositeServicesTransformer)(options.serviceSchemaTransformers);
  const gatewayTransformer = (0, _buildCompositeGatewayTransformer.buildCompositeGatewayTransformer)(options.gatewaySchemaTransformers);
  return ({
    services,
    metadata
  }) => {
    const schemaSpecification = {
      services,
      metadata
    };
    const buildServicesTransformations = servicesTransformer(schemaSpecification);
    if (!buildServicesTransformations.success) return buildServicesTransformations;
    const buildExtensions = extensionsBuilder(schemaSpecification);
    if (!buildExtensions.success) return buildExtensions;
    const buildGatewayTransformations = gatewayTransformer(schemaSpecification);
    if (!buildGatewayTransformations.success) return buildGatewayTransformations;
    return (0, _mergeServices.mergeServices)(services, {
      servicesTransformations: buildServicesTransformations.payload,
      extensions: buildExtensions.payload,
      gatewayTransformations: buildGatewayTransformations.payload
    });
  };
};

exports.buildExecutableSchemaComposer = buildExecutableSchemaComposer;