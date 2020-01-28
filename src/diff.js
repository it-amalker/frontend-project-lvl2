import _ from 'lodash';
import { isArray, isObject } from './utils';

const diff = (object1, object2) => {
  const commonKeys = _.uniq(Object.keys(object1).concat(Object.keys(object2)));

  const ast = commonKeys.sort().reduce((acc, key) => {
    const value1 = object1[key];
    const value2 = object2[key];
    const buildAstNode = (obj1, obj2) => {
      const node = {
        type: '',
        name: key,
        value: '',
        valuePrev: '',
        children: [],
        status: '',
      };
      const compareArray = (arr1, arr2) => arr1.every((el) => arr2.includes(el));
      const isKeyInObj1 = _.has(obj1, key);
      const isKeyInObj2 = _.has(obj2, key);

      if (isKeyInObj1 && isKeyInObj2) {
        if (isObject(value1, value2) && !isArray(value1, value2)) {
          node.status = 'unchanged';
          node.type = 'children';
        } else {
          node.value = value1;
          node.valuePrev = value2;
          if (isArray(value1, value2)) {
            node.status = compareArray(value1, value2) ? 'unchanged' : 'changed';
          } else {
            node.status = node.value === node.valuePrev ? 'unchanged' : 'changed';
          }
        }
      }
      if (isKeyInObj1 && !isKeyInObj2) {
        node.value = value1;
        node.status = 'removed';
      }
      if (!isKeyInObj1 && isKeyInObj2) {
        node.valuePrev = value2;
        node.status = 'added';
      }
      return node;
    };

    const astNode = buildAstNode(object1, object2);
    if (!acc[key]) {
      acc[key] = [];
    }
    if (astNode.type === 'children') {
      const child1 = value1;
      const child2 = value2;
      acc[key].push({ ...astNode, children: diff(child1, child2) });
    } else {
      acc[key].push(astNode);
    }
    return acc;
  }, {});

  return ast;
};

export default diff;
