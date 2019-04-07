import {buildServicesByTagQuery} from "../../../data";
import {effects} from "../../../common-modules/saga-runner";
import {buildServicesHash} from "../../modules/services";

export function* buildingServicesHashByTagSaga({ tag, upsert, transform, storage })
{
  const getServicesByTag = buildServicesByTagQuery(storage.queries);

  const { version, services } = yield effects.call(getServicesByTag, { tag });

  const servicesHash = yield effects.call(buildServicesHash, {
    services,
    version,
    upsert,
    transform
  });

  // servicesHash.setPluginsMetadata(servicesHash);

  return {
    success: true,
    payload: servicesHash
  }
}