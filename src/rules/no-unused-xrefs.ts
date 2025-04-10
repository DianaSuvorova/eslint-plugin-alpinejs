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
            const validJs = `const data = ${expression}`
            try {
              const jsAst = espree.parse(validJs, {
                ecmaVersion: 2022,
                sourceType: 'script',
              });
              walkSimple(jsAst as any, {
                MemberExpression(node: any) {
                  if (
                    node.object?.type === 'MemberExpression'
                  ) {
                    const obj = node.object?.object
                    const prop = node.object?.property
                    if (
                      // this.$refs.menu
                      obj?.object?.type === "ThisExpression" &&
                      obj?.property?.type === "Identifier" && 
                      obj?.property?.name === "$refs" &&
                      prop?.type === "Identifier"
                    ) {
                      usedRefs.add(prop.name);
                    }

                  if (
                    // $refs.menu.
                    obj?.type === "Identifier" &&
                    obj?.name === "$refs" &&
                    prop?.type === "Identifier"
                  ) {
                    usedRefs.add(prop.name);
                  }
                } if (
                  // setup($refs.box)
                  node?.object?.type === 'Identifier' &&
                  node?.object?.name === '$refs' && 
                  node?.property?.type === 'Identifier' 
                ) {
                  usedRefs.add(node.property.name);
                }
  
                },
              });
            } catch (e) {
              console.log(e);
              console.log('did we get here');
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
