import _ from 'lodash';
import parse from './parsers';

const isObject = (...items) => items.every((obj) => obj instanceof Object);
const isArray = (...items) => items.every((arr) => Array.isArray(arr));

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

const render = (ast) => {
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

export default (pathToFile1, pathToFile2) => {
  const object1 = parse(pathToFile1);
  const object2 = parse(pathToFile2);

  return render(diff(object1, object2));
};
