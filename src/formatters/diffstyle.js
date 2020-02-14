import _ from 'lodash';
import { stringify } from '../utils';

const getIndent = (status, depth) => {
  const defaultIndent = ' '.repeat(4 * depth);
  const nestedIndent = ' '.repeat(depth === 1 ? 2 : 3 * depth + depth - 2);
  return status === 'unchanged' ? defaultIndent : nestedIndent;
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
    const renderedResult = tree.map((node) => {
      const {
        name, status, type, valueBefore, valueAfter, children,
      } = node;
      const renderNode = (nodeStatus) => {
        const indent = getIndent(nodeStatus, currentDepth);
        if (type === 'children') {
          return `${indent}${name}: {\n${iterAst(children, currentDepth)}\n${indent}}`;
        }
        switch (nodeStatus) {
          case 'added':
            return `${indent}+ ${name}: ${renderValue(valueAfter, currentDepth)}`;
          case 'removed':
            return `${indent}- ${name}: ${renderValue(valueBefore, currentDepth)}`;
          case 'changed':
            return `${indent}+ ${name}: ${renderValue(valueAfter, currentDepth)}\n${indent}- ${name}: ${renderValue(valueBefore, currentDepth)}`;
          case 'unchanged':
            return `${indent}${name}: ${renderValue(valueBefore, currentDepth)}`;
          default:
            throw new Error(`Unknown ${status} status`);
        }
      };
      return renderNode(status);
    });
    return `${renderedResult.join('\n')}`;
  };
  return `{\n${iterAst(ast, 0)}\n}`;
};
