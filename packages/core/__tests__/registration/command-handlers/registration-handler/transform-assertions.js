const toServiceDefinition = service => ({
  service: {
    id: service.id,
    schema: service.schema
  }
});

export const expectServiceToBeTransformeed = (getTransforms, service) =>
  expect(getTransforms).toHaveBeenCalledWith(toServiceDefinition(service));

export const expectServiceNotToBeTransformeed = (getTransforms, service) =>
  expect(getTransforms).not.toHaveBeenCalledWith(toServiceDefinition(service));