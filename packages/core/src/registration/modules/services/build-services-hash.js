import { ServicesHash } from './services-hash';

const servicesReducer = (hash, service) => ({
  ...hash,
  [service.id]: service
});

export const buildServicesHash = ({
  services,
  version,
  upsert,
  transform
}) =>
{
  const fullServicesList = [
    ...services,
    upsert
  ];

  const hashingServices = transform(
    fullServicesList.reduce(servicesReducer, {})
  );

  if(!hashingServices.success)
  {
    return hashingServices;
  }

  const servicesHash = hashingServices.payload;

  return {
    success: true,
    payload: new ServicesHash({ servicesHash, version })
  }
};