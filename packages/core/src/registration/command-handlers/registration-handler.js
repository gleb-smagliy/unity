export class ServiceRegistrationCommandHander
{
  constructor(options)
  {
    this.options = options;
  }

  execute = (command) =>
  {
    const { id, schemaBuilder: schemaBuilderName } = command;
    // const schemaBuilder = options.schemaBuilder.find(b => );
    const { storage: { getServicesByVersion, getMetadataByVersion }} = this.options;


  }
}