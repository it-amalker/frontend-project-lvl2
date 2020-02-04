import _ from 'lodash';
import { isEquilArrays } from './utils';

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
      if (value1 && !value2 && value2 !== '') {
        return { ...node, status: 'removed', valueBefore: value1 };
      }
      if (!value1 && value2 && value1 !== '') {
        return { ...node, status: 'added', valueAfter: value2 };
      }
      if (value1 === value2 && !_.isObject(value1) && !_.isObject(value2)) {
        return {
          ...node, status: 'unchanged', valueBefore: value1, valueAfter: value2,
        };
      }
      if (_.isArray(value1) && _.isArray(value2)) {
        const statusResult = isEquilArrays(value1, value2) ? 'unchanged' : 'changed';
        return {
          ...node, status: statusResult, valueBefore: value1, valueAfter: value2,
        };
      }
      if (_.isObject(value1) && _.isObject(value2)) {
        return {
          ...node, type: 'children', status: 'unchanged', children: genDiff(value1, value2),
        };
      }
      return {
        ...node, status: 'changed', valueBefore: value1, valueAfter: value2,
      };
    };
    return buildNode(object1, object2);
  });
  return ast;
};

export default genDiff;
