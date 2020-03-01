import _ from 'lodash';
import { stringify } from '../utils';

const getIndent = (nodeType, depth) => {
  const defaultIndent = ' '.repeat(4 * depth);
  const nestedIndent = ' '.repeat(depth === 1 ? 2 : 3 * depth + depth - 2);
  return nodeType === 'unchanged' || nodeType === 'children' ? defaultIndent : nestedIndent;
};

const renderValue = (item, depth) => {
  const indent = ' '.repeat(4 * (depth + 1));
  const bracketsIndent = ' '.repeat(4 * depth);
  if (_.isArray(item)) {
    const processedArray = item.map((el) => `${indent}${el}`).join('\n');
    return `[\n${processedArray}\n${bracketsIndent}]`;
  }
  if (_.isObject(item)) {
    const processedColl = Object.entries(item).map(([key, value]) => `${indent}${key}: ${stringify(value)}`).join('\n');
    return `{\n${processedColl}\n${bracketsIndent}}`;
  }
  return stringify(JSON.stringify(item));
};

export default (ast) => {
  const iterAst = (tree, depth) => {
    const currentDepth = depth + 1;
    return tree.map((node) => {
      const {
        name, type, valueBefore, valueAfter, children,
      } = node;
      const renderNode = (nodeType) => {
        const indent = getIndent(nodeType, currentDepth);
        const nodeByNodeType = {
          children: () => `${indent}${name}: {\n${iterAst(children, currentDepth)}\n${indent}}`,
          added: () => `${indent}+ ${name}: ${renderValue(valueAfter, currentDepth)}`,
          removed: () => `${indent}- ${name}: ${renderValue(valueBefore, currentDepth)}`,
          changed: () => `${indent}+ ${name}: ${renderValue(valueAfter, currentDepth)}\n${indent}- ${name}: ${renderValue(valueBefore, currentDepth)}`,
          unchanged: () => `${indent}${name}: ${renderValue(valueBefore, currentDepth)}`,
        };
        return nodeByNodeType[nodeType]();
      };
      return renderNode(type);
    }).join('\n');
  };
  return `{\n${iterAst(ast, 0)}\n}`;
};
