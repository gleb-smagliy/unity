export const toServicesHash = ({ services, upsert }) =>
{
  const fullServicesList = [
    ...services,
    upsert
  ];

  return fullServicesList
    .reduce((acc, service) => ({ ...acc, [service.id]: service }), {});
};