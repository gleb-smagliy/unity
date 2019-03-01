const isSpecificationStringValid = specificationString =>
  typeof(specificationString) !== 'string' || specificationString.trim().length == 0

export const getSchemaVersion = async ({ version, tag, getVersionByTag}) =>
{
  if(!isSpecificationStringValid(version))
  {
    if(!isSpecificationStringValid(tag))
    {
      throw new Error(`Could not retrieve schema: version <${version}> and tag <${tag}> are not valid`);
    }

    return await getVersionByTag({ tag });
  }

  return version;
};