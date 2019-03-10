const servicesReducer = (hash, service) => ({
  ...hash,
  [service.id]: service
});

export const buildServicesHash = ({
  services,
  upsert,
  transform
}) =>
{
  const fullServicesList = [
    ...services,
    upsert
  ];

  return transform(
    fullServicesList.reduce(servicesReducer, {})
  );
};