import { TSESLint } from '@typescript-eslint/utils';
import type { Tag, Attribute } from '@html-eslint/types';

const rule: TSESLint.RuleModule<'mustUseTemplate', []> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer using <template x-if> instead of applying x-if to normal tags',
    },
    messages: {
      mustUseTemplate: 'Use <template x-if> instead of applying x-if to a <{{tag}}> element.',
    },
    schema: [],
  },

  defaultOptions: [],

  create(context) {
    return {
      Tag(node: Tag) {
        if (node.name === 'template') return;

        for (const attr of node.attributes ?? []) {
          if (attr.type !== 'Attribute') continue;

          const name = attr.key?.value;
          if (name === 'x-if') {
            context.report({
              node: attr,
              messageId: 'mustUseTemplate',
              data: { tag: node.name },
            });
          }
        }
      },
    };
  },
};

export default rule;
