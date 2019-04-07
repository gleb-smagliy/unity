export const model = {
  aliasField: {
    name: 'levels',
    type: '[Level]'
  },
  sourceType: 'Availability',
  sourceKeys: ['levelsIds'],
  targetKeys: ['ids'],
  targetQuery: {
    name: 'membershipLevelsByIds',
    returnType: '[Level]'
  }
};