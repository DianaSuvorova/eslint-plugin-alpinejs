import { TSESLint } from '@typescript-eslint/utils';
import * as espree from 'espree';
import { simple as walkSimple } from 'acorn-walk';
import type { Tag, Attribute } from '@html-eslint/types';

const rule: TSESLint.RuleModule<'unusedRef', []> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Flags unused x-ref bindings in Alpine templates',
    },
    messages: {
      unusedRef: 'x-ref "{{refName}}" is not used anywhere in Alpine expressions.',
    },
    schema: [],
  },

  defaultOptions: [],

  create(context) {
    const refs = new Map<string, Attribute>();
    const expressions: string[] = [];

    return {
        Tag(node: Tag) {
          for (const attr of node.attributes ?? []) {
            if (attr.type !== 'Attribute') continue;
            const name = attr.key?.value;
            const value = attr.value?.value;
            if (!name || !value) continue;
    
            if (name === 'x-ref') {
              refs.set(value, attr);
            }
    
            if (name.startsWith('@') || name.startsWith('x-')) {
              expressions.push(value);
            }
          }
        },
    
        'Program:exit'() {
          const usedRefs = new Set<string>();
    
          for (const expression of expressions) {
            try {
              const jsAst = espree.parse(expression, {
                ecmaVersion: 2022,
                sourceType: 'script',
              });
    
              walkSimple(jsAst as any, {
                MemberExpression(node: any) {
                  if (
                    node.object?.type === 'Identifier' &&
                    node.object.name === '$refs' &&
                    node.property?.type === 'Identifier'
                  ) {
                    usedRefs.add(node.property.name);
                  }
    
                  if (
                    node.object?.type === 'MemberExpression' &&
                    node.object.object?.type === 'Identifier' &&
                    node.object.object.name === '$refs' &&
                    node.object.property?.type === 'Identifier'
                  ) {
                    usedRefs.add(node.object.property.name);
                  }
                },
              });
            } catch {
              // ignore bad expressions
            }
          }
    
          for (const [refName, node] of refs.entries()) {
            if (!usedRefs.has(refName)) {
              context.report({
                node,
                messageId: 'unusedRef',
                data: { refName },
              });
            }
          }
        },
      }
    }
};

export default rule;
