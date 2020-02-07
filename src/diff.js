import _ from 'lodash';

const buildAst = (object1, object2) => {
  const commonKeys = _.union(_.keys(object1), _.keys(object2));
  const buildNode = (key, obj1, obj2) => {
    const node = {
      name: key,
      type: 'regular',
      status: 'unchanged',
      valueBefore: '',
      valueAfter: '',
    };
    const value1 = obj1[key];
    const value2 = obj2[key];
    const isKeyInObj1 = _.has(obj1, key);
    const isKeyInObj2 = _.has(obj2, key);
    const conditions = {
      valueRemoved: { check: isKeyInObj1 && !isKeyInObj2 },
      valueAdded: { check: !isKeyInObj1 && isKeyInObj2 },
      valueHasChildren: {
        check: _.isObject(value1) && _.isObject(value2)
        && !_.isArray(value1) && !_.isArray(value2),
      },
      valueUnchanged: { check: _.isEqual(value1, value2) },
    };
    switch (_.findKey(conditions, 'check')) {
      case 'valueRemoved':
        return { ...node, status: 'removed', valueBefore: value1 };
      case 'valueAdded':
        return { ...node, status: 'added', valueAfter: value2 };
      case 'valueUnchanged':
        return { ...node, valueBefore: value1, valueAfter: value2 };
      case 'valueHasChildren':
        return { ...node, type: 'children', children: buildAst(value1, value2) };
      default:
        return {
          ...node, status: 'changed', valueBefore: value1, valueAfter: value2,
        };
    }
  };
  return commonKeys.sort().map((currentKey) => buildNode(currentKey, object1, object2));
};

export default buildAst;
