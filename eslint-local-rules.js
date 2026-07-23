'use strict';

/**
 * @see https://www.npmjs.com/package/eslint-plugin-local-rules
 * @see https://eslint.org/docs/latest/extend/custom-rules
 */
module.exports = {
  'suffix-zod-schemas': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Ensure that any variable containing a Zod schema ends with `Schema`.',
        recommended: false,
      },
      messages: {
        missingSchemaSuffix:
          'Zod schema variables must have names ending with `Schema`.',
      },
      schema: [],
    },

    create(context) {
      function isZodSchema(node) {
        if (
          node.type === 'CallExpression' &&
          node.callee.type === 'MemberExpression'
        ) {
          const obj = node.callee.object;
          if (obj.type === 'Identifier' && obj.name === 'z') {
            return true;
          }
        }

        if (
          node.type === 'NewExpression' &&
          node.callee.type === 'MemberExpression'
        ) {
          const obj = node.callee.object;
          if (obj.type === 'Identifier' && obj.name === 'z') {
            return true;
          }
        }

        return false;
      }

      return {
        VariableDeclarator(node) {
          if (!node.init || node.id.type !== 'Identifier') return;

          const varName = node.id.name;

          if (isZodSchema(node.init)) {
            if (!varName.endsWith('Schema')) {
              context.report({
                node: node.id,
                messageId: 'missingSchemaSuffix',
              });
            }
          }
        },

        ExportNamedDeclaration(node) {
          if (!node.declaration) return;
          if (node.declaration.type !== 'VariableDeclaration') return;

          for (const decl of node.declaration.declarations) {
            if (
              decl.type === 'VariableDeclarator' &&
              decl.id.type === 'Identifier' &&
              decl.init &&
              isZodSchema(decl.init)
            ) {
              if (!decl.id.name.endsWith('Schema')) {
                context.report({
                  node: decl.id,
                  messageId: 'missingSchemaSuffix',
                });
              }
            }
          }
        },
      };
    },
  },
};
