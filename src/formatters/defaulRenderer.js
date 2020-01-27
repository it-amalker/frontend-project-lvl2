import { isArray, isObject } from '../diff';

export default (ast) => {
  const iterAst = (tree, depth) => {
    const currentDepth = depth + 1;
    const rendered = Object.values(tree).reduce((acc, treeValue) => {
      const {
        name, status, type, value, valuePrev, children,
      } = treeValue[0];
      const getIndent = (property) => {
        switch (property) {
          case 'normal':
            return ' '.repeat(4 * currentDepth);
          case 'object':
            return ' '.repeat(4 * (currentDepth + 1));
          default:
            return ' '.repeat(currentDepth === 1 ? 2 : 3 * currentDepth + currentDepth - 2);
        }
      };
      const indents = {
        unchanged: getIndent('normal'),
        removed: `${getIndent()}- `,
        added: `${getIndent()}+ `,
        changed: (sign) => `${getIndent()}${sign} `,
      };
      const stringify = (str) => (typeof str === 'string' ? str.replace(/(^")|("$)/g, '') : str);
      const formatObj = (item) => {
        const parsedItem = JSON.parse(item);
        if (isArray(parsedItem)) {
          const formatedArr = parsedItem.map((el) => `${getIndent('object')}${el}`);
          return `[\n${formatedArr.join('\n')}\n${getIndent('normal')}]`;
        }
        if (isObject(parsedItem)) {
          const formatedObj = Object.keys(parsedItem).map((objKey) => `${getIndent('object')}${objKey}: ${stringify(parsedItem[objKey])}`);
          return `{\n${formatedObj.join('\n')}\n${getIndent('normal')}}`;
        }
        return stringify(item);
      };

      if (type === 'children') {
        return [...acc, `${indents[status]}${name}: {\n${iterAst(children, currentDepth)}\n${getIndent('normal')}}`];
      }

      if (status === 'changed') {
        return [...acc, `${indents[status]('+')}${name}: ${formatObj(JSON.stringify(valuePrev))}`,
          `${indents[status]('-')}${name}: ${formatObj(JSON.stringify(value))}`];
      }
      return [...acc, `${indents[status]}${name}: ${formatObj(JSON.stringify(value || valuePrev))}`];
    }, []);

    return `${rendered.join('\n')}`;
  };

  return `{\n${iterAst(ast, 0)}\n}`;
};
