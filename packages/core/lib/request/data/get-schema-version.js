"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSchemaVersion = void 0;

const isSpecificationStringValid = specificationString => typeof specificationString === 'string' && specificationString.trim().length > 0;

const getSchemaVersion = async ({
  version,
  tag,
  getVersionByTag
}) => {
  if (!isSpecificationStringValid(version)) {
    if (!isSpecificationStringValid(tag)) {
      return {
        success: false,
        error: `Could not retrieve schema: version <${version}> and tag <${tag}> are not valid`
      };
    }

    return await getVersionByTag({
      tag
    });
  }

  return {
    success: true,
    payload: {
      version,
      args: {}
    }
  };
};

exports.getSchemaVersion = getSchemaVersion;