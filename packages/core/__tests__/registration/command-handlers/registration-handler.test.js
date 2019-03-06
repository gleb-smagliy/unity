import { ServiceRegistrationCommandHander } from "../../../src/registration/command-handlers/registration-handler";

describe('ServiceRegistrationCommandHander', () =>
{
  it('should take a lock to register a service', () =>
  {
    throw new Error();
  });

  it.skip('should return a failure if lock is already acquired', () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if specified schema builder is not present in options', () =>
  {
    throw new Error();
  });

  it.skip('should request schema from schema builder according to passed command', () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if schema builder returns failure', () =>
  {
    throw new Error();
  });

  it.skip('should request version by stable tag from storage', () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if cannot take a version by stable tag from storage', () =>
  {
    throw new Error();
  });

  it.skip('should take services by tagged as stable version', () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if cannot take a services', () =>
  {
    throw new Error();
  });

  it.skip('should request service metadata from metadata builder by specified schema builder', () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if metadata builder returns failure', () =>
  {
    throw new Error();
  });

  it.skip('should transform schemas using schema transformers', () =>
  {
    throw new Error();
  });

  it.skip('should extract metadata using metadata extractors for extension builders', () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if extension builder metadata extractor returns failure', () =>
  {
    throw new Error();
  });

  it.skip('should extract metadata using metadata extractors for gateway transformers', () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if gateway transformer metadata extractor returns failure', () =>
  {
    throw new Error();
  });

  it.skip('should save new services using storage', () =>
  {
    throw new Error();
  });

  it.skip('should assign a new version to the services using versioning strategy from options', () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if services could not be saved', () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if services could not be saved', () =>
  {
    throw new Error();
  });

  it.skip('should update lock assigning new version to it', () =>
  {
    throw new Error();
  });

  it.skip('should return failure and release lock if lock version assigning fails', () =>
  {
    throw new Error();
  });

  it.skip('should return new version', () =>
  {
    throw new Error();
  });
});