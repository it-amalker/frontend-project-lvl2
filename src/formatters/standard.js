import _ from 'lodash';
import { stringify } from '../utils';

export default (ast) => {
  const iterAst = (tree, depth) => {
    const currentDepth = depth + 1;
    const renderIndent = (status) => {
      const defaultIndent = ' '.repeat(4 * currentDepth);
      const objectIndent = ' '.repeat(4 * (currentDepth + 1));
      const nestedIndent = ' '.repeat(currentDepth === 1 ? 2 : 3 * currentDepth + currentDepth - 2);
      switch (status) {
        case 'unchanged':
          return defaultIndent;
        case 'removed':
          return `${nestedIndent}- `;
        case 'added':
          return `${nestedIndent}+ `;
        case 'changed':
          return `${nestedIndent}`;
        case 'object':
          return objectIndent;
        default:
          return nestedIndent;
      }
    };
    const renderObj = (item) => {
      if (_.isArray(item)) {
        const mappedArr = item.map((el) => `${renderIndent('object')}${el}`);
        return `[\n${mappedArr.join('\n')}\n${renderIndent('unchanged')}]`;
      }
      if (_.isObject(item)) {
        const mappedObj = Object.entries(item).map(([key, value]) => `${renderIndent('object')}${key}: ${stringify(value)}`);
        return `{\n${mappedObj.join('\n')}\n${renderIndent('unchanged')}}`;
      }
      return stringify(JSON.stringify(item));
    };
    const rendered = tree.map((node) => {
      const {
        name, status, type, valueBefore, valueAfter, children,
      } = node;
      const renderNode = (nodeStatus) => {
        switch (nodeStatus) {
          case 'changed':
            return `${renderIndent(status)}+ ${name}: ${renderObj(valueAfter)}\n${renderIndent(status)}- ${name}: ${renderObj(valueBefore)}`;
          default:
            return `${renderIndent(status)}${name}: ${renderObj(valueBefore || valueAfter)}`;
        }
      };
      return type === 'children'
        ? `${renderIndent(status)}${name}: {\n${iterAst(children, currentDepth)}\n${renderIndent('unchanged')}}`
        : renderNode(status);
    });
    return `${rendered.join('\n')}`;
  };
  return `{\n${iterAst(ast, 0)}\n}`;
};
