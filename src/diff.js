import _ from 'lodash';
import { isObjectAndNotArray } from './utils';

const buildAst = (object1, object2) => {
  const commonKeys = _.union(_.keys(object1), _.keys(object2));
  const buildNode = (key, obj1, obj2) => {
    const node = {
      name: key, type: 'unchanged', valueBefore: '', valueAfter: '',
    };
    const [value1, value2] = [obj1[key], obj2[key]];
    const [isKeyInObj1, isKeyInObj2] = [_.has(obj1, key), _.has(obj2, key)];
    const nodeTypes = {
      removed: { check: isKeyInObj1 && !isKeyInObj2 },
      added: { check: !isKeyInObj1 && isKeyInObj2 },
      children: { check: isObjectAndNotArray(value1, value2) },
      unchanged: { check: _.isEqual(value1, value2) },
    };
    const currentNodeType = _.findKey(nodeTypes, 'check') || 'changed';
    const nodeByNodeType = {
      removed: () => ({ ...node, type: 'removed', valueBefore: value1 }),
      added: () => ({ ...node, type: 'added', valueAfter: value2 }),
      children: () => ({ ...node, type: 'children', children: buildAst(value1, value2) }),
      unchanged: () => ({ ...node, valueBefore: value1, valueAfter: value2 }),
      changed: () => ({
        ...node, type: 'changed', valueBefore: value1, valueAfter: value2,
      }),
    };
    return nodeByNodeType[currentNodeType]();
  };
  return commonKeys.sort().map((currentKey) => buildNode(currentKey, object1, object2));
};

export default buildAst;
