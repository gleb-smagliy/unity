export class TypesRegistry
{
  constructor()
  {
    this.types = {};
  }

  getProperty = (type, getter) =>
  {
    const typeName = type.name;

    if(typeof(this.types[typeName]) !== 'object' || this.types[typeName] === null)
    {
      return false;
    }

    return getter(this.types[typeName]);
  };

  setBanned = (type) =>
  {
    const typeName = type.name;
    const prevRecord = this.types[typeName] || {};

    this.types[typeName] = {
      ...prevRecord,
      visited: true,
      banned: true
    };
  };

  setVisited = (type) =>
  {
    const typeName = type.name;
    const prevRecord = this.types[typeName] || {};

    this.types[typeName] = {
      ...prevRecord,
      visited: true
    };
  };

  isVisited = (type) => this.getProperty(type, t => !!t.visited);
  isBanned = (type) => this.getProperty(type, t => !!t.banned);
}