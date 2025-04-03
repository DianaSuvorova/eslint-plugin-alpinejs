import { RuleTester } from '@typescript-eslint/rule-tester';
import { describe, it, afterAll } from 'vitest';
import rule from '../src/rules/no-unused-xrefs';
import htmlParser from '@html-eslint/parser';

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: htmlParser,
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('no-unused-x-ref', rule, {
  valid: [
    {
      name: 'ref is used in $refs access',
      code: `<input x-ref="foo"><button @click="$refs.foo.focus()">Click</button>`,
    },
    {
      name: 'multiple refs used properly',
      code: `
        <div x-ref="section"></div>
        <button @click="$refs.section.scrollIntoView()">Scroll</button>
      `,
    },
    {
      name: 'ref used in x-init',
      code: `<div x-ref="panel" x-init="$refs.panel.classList.add('active')"></div>`,
    },
    {
      name: 'ref accessed in nested call',
      code: `<div x-ref="box"><div x-init="setup($refs.box)"></div></div>`,
    },
    {
      name: 'no refs present at all',
      code: `<button @click="openModal()">Click</button>`,
    },
  ],
  invalid: [
    {
      name: 'unused x-ref in input',
      code: `<input x-ref="unused">`,
      errors: [{ messageId: 'unusedRef', data: { refName: 'unused' } }],
    },
    {
      name: 'multiple unused refs',
      code: `<div x-ref="one"></div><span x-ref="two"></span>`,
      errors: [
        { messageId: 'unusedRef', data: { refName: 'one' } },
        { messageId: 'unusedRef', data: { refName: 'two' } },
      ],
    },
    {
      name: 'used and unused ref mixed',
      code: `<div x-ref="used"></div><span x-ref="unused"></span><button @click="$refs.used"></button>`,
      errors: [{ messageId: 'unusedRef', data: { refName: 'unused' } }],
    },
    {
      name: 'unused ref with other Alpine directives',
      code: `<div x-ref="ghost" x-data="{ foo: true }" x-show="foo"></div>`,
      errors: [{ messageId: 'unusedRef', data: { refName: 'ghost' } }],
    },
  ],
});
