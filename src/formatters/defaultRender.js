import { isArray, isObject, stringify } from '../utils';

export default (ast) => {
  const iterAst = (tree, depth) => {
    const currentDepth = depth + 1;
    const rendered = Object.values(tree).reduce((acc, treeValue) => {
      const {
        name, status, type, value, valuePrev, children,
      } = treeValue[0];
      const renderIndent = (property) => {
        const defaultIndent = ' '.repeat(4 * currentDepth);
        const objectIndent = ' '.repeat(4 * (currentDepth + 1));
        const nestedIndent = ' '.repeat(currentDepth === 1 ? 2 : 3 * currentDepth + currentDepth - 2);
        switch (property) {
          case 'unchanged':
            return defaultIndent;
          case 'removed':
            return `${nestedIndent}- `;
          case 'added':
            return `${nestedIndent}+ `;
          case 'changed':
            return (sign) => `${nestedIndent}${sign} `;
          case 'object':
            return objectIndent;
          default:
            return nestedIndent;
        }
      };
      const formatObj = (item) => {
        const parsedItem = JSON.parse(item);
        if (isArray(parsedItem)) {
          const formatedArr = parsedItem.map((el) => `${renderIndent('object')}${el}`);
          return `[\n${formatedArr.join('\n')}\n${renderIndent('unchanged')}]`;
        }
        if (isObject(parsedItem)) {
          const formatedObj = Object.keys(parsedItem).map((objKey) => `${renderIndent('object')}${objKey}: ${stringify(parsedItem[objKey])}`);
          return `{\n${formatedObj.join('\n')}\n${renderIndent('unchanged')}}`;
        }
        return stringify(item);
      };

      if (type === 'children') {
        return [...acc, `${renderIndent(status)}${name}: {\n${iterAst(children, currentDepth)}\n${renderIndent('unchanged')}}`];
      }

      if (status === 'changed') {
        return [...acc, `${renderIndent(status)('+')}${name}: ${formatObj(JSON.stringify(valuePrev))}`,
          `${renderIndent(status)('-')}${name}: ${formatObj(JSON.stringify(value))}`];
      }
      return [...acc, `${renderIndent(status)}${name}: ${formatObj(JSON.stringify(value || valuePrev))}`];
    }, []);

    return `${rendered.join('\n')}`;
  };

  return `{\n${iterAst(ast, 0)}\n}`;
};
