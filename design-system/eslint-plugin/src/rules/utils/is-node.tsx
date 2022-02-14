import type { Rule } from 'eslint';
import type {
  CallExpression,
  Expression,
  TaggedTemplateExpression,
  // eslint-disable-next-line import/no-unresolved
} from 'estree';

export const isDecendantOfGlobalToken = (node: Rule.Node): boolean => {
  if (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'token'
  ) {
    return true;
  }

  if (node.parent) {
    return isDecendantOfGlobalToken(node.parent);
  }

  return false;
};

export const isDecendantOfType = (
  node: Rule.Node,
  type: Rule.Node['type'],
  skipNode = true,
): boolean => {
  if (!skipNode && node.type === type) {
    return true;
  }

  if (node.parent) {
    return isDecendantOfType(node.parent, type, false);
  }

  return false;
};

export const isDecendantOfStyleJsxAttribute = (node: Rule.Node): boolean => {
  // @ts-ignore
  if (node.type === 'JSXAttribute') {
    return true;
  }

  if (node.parent) {
    return isDecendantOfStyleJsxAttribute(node.parent);
  }

  return false;
};

export const isStyledTemplateNode = (
  node?: Expression | null,
): node is TaggedTemplateExpression =>
  node?.type === 'TaggedTemplateExpression' &&
  node.tag.type === 'MemberExpression' &&
  node.tag.object.type === 'Identifier' &&
  node.tag.object.name === 'styled';

export const isStyledObjectNode = (
  node?: Expression | null,
): node is CallExpression =>
  node?.type === 'CallExpression' &&
  node.callee.type === 'MemberExpression' &&
  node.callee.object.type === 'Identifier' &&
  node.callee.object.name === 'styled';

export const isDecendantOfStyleBlock = (node: Rule.Node): boolean => {
  if (node.type === 'VariableDeclarator') {
    if (node.id.type !== 'Identifier') {
      return false;
    }

    if (
      // @ts-ignore typeAnnotation is not defined by types
      node.id.typeAnnotation &&
      // @ts-ignore typeAnnotation is not defined by types
      node.id.typeAnnotation.typeAnnotation.type === 'GenericTypeAnnotation'
    ) {
      // @ts-ignore Name is not defined by types
      const typeName = node.id.typeAnnotation.typeAnnotation.id.name;
      const hasCSSType = ['CSSProperties', 'CSSObject'].some((el) =>
        typeName.includes(el),
      );

      if (hasCSSType) {
        return true;
      }
    }

    // @ts-ignore Name is not defined in types
    const varName = node.id.name.toLowerCase();

    return ['style', 'css', 'theme'].some((el) => varName.includes(el));
  }

  if (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'css'
  ) {
    return true;
  }

  if (isStyledTemplateNode(node as Expression)) {
    return true;
  }

  if (
    node.type === 'TaggedTemplateExpression' &&
    node.tag.type === 'Identifier' &&
    node.tag.name === 'css'
  ) {
    return true;
  }

  if (node.parent) {
    return isDecendantOfStyleBlock(node.parent);
  }

  return false;
};

export const isChildOfType = (node: Rule.Node, type: Rule.Node['type']) =>
  node.parent.type === type;

/**
 * Given a node, walk up the tree until there is no parent OR a common ancestor of the correct type is found
 */
export const getClosestNodeOfType = (
  node: Rule.Node,
  type: Rule.NodeTypes,
): Rule.Node => {
  if (!node) {
    return node;
  }

  if (node.type === type) {
    return node;
  }

  return getClosestNodeOfType(node.parent, type);
};
