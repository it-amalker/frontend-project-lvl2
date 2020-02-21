import _ from 'lodash';

const buildAst = (object1, object2) => {
  const commonKeys = _.union(_.keys(object1), _.keys(object2));
  const buildNode = (key, obj1, obj2) => {
    const node = {
      name: key,
      type: 'unchanged',
      valueBefore: '',
      valueAfter: '',
    };
    const [value1, value2] = [obj1[key], obj2[key]];
    const [isKeyInObj1, isKeyInObj2] = [_.has(obj1, key), _.has(obj2, key)];
    if (isKeyInObj1 && !isKeyInObj2) {
      return { ...node, type: 'removed', valueBefore: value1 };
    }
    if (!isKeyInObj1 && isKeyInObj2) {
      return { ...node, type: 'added', valueAfter: value2 };
    }
    if (_.isObject(value1) && _.isObject(value2) && !_.isArray(value1) && !_.isArray(value2)) {
      return { ...node, type: 'children', children: buildAst(value1, value2) };
    }
    if (_.isEqual(value1, value2)) {
      return { ...node, valueBefore: value1, valueAfter: value2 };
    }
    return {
      ...node, type: 'changed', valueBefore: value1, valueAfter: value2,
    };
  };
  return commonKeys.sort().map((currentKey) => buildNode(currentKey, object1, object2));
};

export default buildAst;
