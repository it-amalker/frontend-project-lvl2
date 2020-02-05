import _ from 'lodash';

const genDiff = (object1, object2) => {
  const commonKeys = _.union(_.keys(object1), _.keys(object2));
  const ast = commonKeys.sort().map((key) => {
    const node = {
      name: key,
      type: 'regular',
      status: '',
      valueBefore: '',
      valueAfter: '',
    };
    const buildNode = (obj1, obj2) => {
      const value1 = obj1[key];
      const value2 = obj2[key];
      const nodeCondition = {
        valueRemoved: { check: value1 && !value2 && value2 !== '' },
        valueAdded: { check: !value1 && value2 && value1 !== '' },
        valueUnchanged: { check: value1 === value2 && !_.isObject(value1) && !_.isObject(value2) },
        valueIsArray: { check: _.isArray(value1) && _.isArray(value2) },
        valueIsObject: { check: _.isObject(value1) && _.isObject(value2) },
      };
      switch (_.findKey(nodeCondition, 'check')) {
        case 'valueRemoved':
          return { ...node, status: 'removed', valueBefore: value1 };
        case 'valueAdded':
          return { ...node, status: 'added', valueAfter: value2 };
        case 'valueUnchanged':
          return {
            ...node, status: 'unchanged', valueBefore: value1, valueAfter: value2,
          };
        case 'valueIsArray':
          return {
            ...node, status: _.isEqual(value1, value2) ? 'unchanged' : 'changed', valueBefore: value1, valueAfter: value2,
          };
        case 'valueIsObject':
          return {
            ...node, type: 'children', status: 'unchanged', children: genDiff(value1, value2),
          };
        default:
          return {
            ...node, status: 'changed', valueBefore: value1, valueAfter: value2,
          };
      }
    };
    return buildNode(object1, object2);
  });
  return ast;
};

export default genDiff;
