"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildServicesByTagQuery = void 0;

const buildServicesByTagQuery = ({
  getVersionByTag,
  getServicesByVersion
}) => async ({
  tag
}) => {
  const versionResult = await getVersionByTag({
    tag
  });

  if (!versionResult.success) {
    return versionResult;
  }

  const version = versionResult.payload;
  const servicesResult = await getServicesByVersion({
    version
  });

  if (!servicesResult.success) {
    return servicesResult;
  }

  return {
    success: true,
    payload: {
      version,
      services: servicesResult.payload
    }
  };
};

exports.buildServicesByTagQuery = buildServicesByTagQuery;