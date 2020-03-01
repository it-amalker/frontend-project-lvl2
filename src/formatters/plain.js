import _ from 'lodash';
import { stringify } from '../utils';

const prerenderValue = (item) => (_.isObject(item) ? '[complex value]' : `'${stringify(JSON.stringify(item))}'`);

export default (ast) => {
  const iterAst = (tree, path) => tree.map((node) => {
    const {
      name, type, valueBefore, valueAfter, children,
    } = node;
    const currentPath = path === '' ? `${path}${name}` : `${path}.${name}`;
    const renderNode = (nodeType) => {
      const newValueBefore = prerenderValue(valueBefore);
      const newValueAfter = prerenderValue(valueAfter);
      const nodeByNodeType = {
        children: () => `${iterAst(children, currentPath)}\n`,
        added: () => `Property '${currentPath}' was added with value: ${newValueAfter}\n`,
        removed: () => `Property '${currentPath}' was deleted\n`,
        changed: () => `Property '${currentPath}' was changed. From ${newValueBefore} to ${newValueAfter}\n`,
        unchanged: () => null,
      };
      return nodeByNodeType[nodeType]();
    };
    return renderNode(type);
  }).join('').replace(/\n$/, '');
  return iterAst(ast, '');
};
