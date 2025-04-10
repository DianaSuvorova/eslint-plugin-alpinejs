import { TSESLint } from '@typescript-eslint/utils';
import * as espree from 'espree';
import { simple as walkSimple } from 'acorn-walk';
import type { Tag, Attribute } from '@html-eslint/types';

const rule: TSESLint.RuleModule<'noRawDom', []> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforces no raw DOM access within alpinejs attributes',
    },
    fixable: 'code',
    messages: {
      noRawDom: 'No raw dom access. Please use alpinejs refs',
    },
    schema: [],
  },

  defaultOptions: [],

  create(context) {
    return {
      Tag(node: Tag) {
        for (const attr of node.attributes ?? []) {
          if (attr.type !== 'Attribute') continue;
          const name = attr.key?.value;
          const value = attr.value?.value;

          if (!name || !value) continue;
          if (!name.startsWith('@') && !name.startsWith('x-')) continue;

          try {
            const jsAst = espree.parse(value, {
              ecmaVersion: 2022,
              sourceType: 'script',
            });

            walkSimple(jsAst as any, {
              CallExpression(node: any) {
                if (
                  node.callee?.type === 'MemberExpression' &&
                  node.callee.object?.type === 'Identifier' &&
                  node.callee.object.name === 'document' &&
                  ['querySelector', 'getElementById', 'querySelectorAll'].includes(node.callee.property.name)
                ) {
                  context.report({
                    node: attr,
                    messageId: 'noRawDom',
                  });
                }
              },
            });
          } catch {
            // ignore malformed expressions
          }
        }
      },
    };
  },
};

export default rule;
