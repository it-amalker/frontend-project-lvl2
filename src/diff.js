import _ from 'lodash';
import { isArray, compareArray, isExactlyObject } from './utils';

const diff = (object1, object2) => {
  const commonKeys = _.uniq(Object.keys(object1).concat(Object.keys(object2)));
  const ast = commonKeys.sort().reduce((acc, key) => {
    const value1 = object1[key];
    const value2 = object2[key];
    const isValuesAreObjects = isExactlyObject(value1, value2);
    const buildAstNode = (obj1, obj2) => {
      const checkStatus = (arg1, arg2) => {
        if (isArray(arg1, arg2)) {
          return compareArray(value1, value2) ? 'unchanged' : 'changed';
        }
        return arg1 === arg2 ? 'unchanged' : 'changed';
      };
      const nodeProperties = [
        {
          type: isValuesAreObjects ? 'children' : 'regular',
          status: isValuesAreObjects ? 'unchanged' : checkStatus(value1, value2),
          value: isValuesAreObjects ? '' : value1,
          valuePrev: isValuesAreObjects ? '' : value2,
          check: (arg1, arg2) => arg1 && arg2,
        },
        {
          status: 'removed',
          value: value1,
          check: (arg1, arg2) => arg1 && !arg2,
        },
        {
          status: 'added',
          valuePrev: value2,
          check: (arg1, arg2) => !arg1 && arg2,
        },
      ];
      const checkConditions = (arg1, arg2) => nodeProperties.find(({ check }) => check(arg1, arg2));
      const {
        type = '', status, value = '', valuePrev = '',
      } = checkConditions(_.has(obj1, key), _.has(obj2, key));
      return {
        name: key, type, status, value, valuePrev,
      };
    };
    const node = buildAstNode(object1, object2);
    const astNode = node.type === 'children'
      ? { ...node, children: diff(value1, value2) } : node;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(astNode);
    return acc;
  }, {});
  return ast;
};

export default diff;
