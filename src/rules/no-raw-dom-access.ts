import { TSESLint } from '@typescript-eslint/utils';
import * as espree from 'espree';
import { simple as walkSimple } from 'acorn-walk';
import type { Node } from 'estree';
import type { Document, Tag, Attribute } from '@html-eslint/types';

const rule: TSESLint.RuleModule<'noRawDom', []> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Discourage raw DOM access when x-ref could be used',
    },
    messages: {
      noRawDom: 'Avoid using raw DOM access. Use x-ref instead.',
    },
    schema: [],
  },

  defaultOptions: [],

  create(context) {
    return {
      Document(documentNode: Document) {
        for (const child of documentNode.children ?? []) {
          if (child.type !== 'Tag') continue;
          const tag = child as Tag;

          for (const attr of tag.attributes ?? []) {
            if (attr.type !== 'Attribute') continue;
            const attribute = attr as Attribute;

            const name = attribute.key?.value;
            const value = attribute.value?.value;

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
                      node: attribute,
                      messageId: 'noRawDom',
                    });
                  }
                },
              });
            } catch {
              // skip bad expressions
            }
          }
        }
      },
    };
  },
};

export default rule;
