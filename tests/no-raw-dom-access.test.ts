import { RuleTester } from '@typescript-eslint/rule-tester';
import { describe, it, afterAll } from 'vitest';
import rule from '../src/rules/no-raw-dom-access';
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

ruleTester.run('no-raw-dom-access', rule, {
  valid: [
    {
      name: 'allows $refs usage',
      code: `<button @click="$refs.foo.focus()">Click</button>`,
    },
    {
      name: 'uses x-ref with $refs correctly',
      code: `<input x-ref="myInput"><button @click="$refs.myInput.focus()">Click</button>`,
    },
    {
      name: 'raw DOM in <script> block is allowed',
      code: `<script>document.querySelector('#ok')</script>`,
    },
    {
      name: 'uses custom function with document',
      code: `<button @click="handle(document)">Click</button>`,
    },
  ],
  invalid: [
    {
      name: 'flags document.querySelector in @click',
      code: `<button @click="document.querySelector('#foo')">Click</button>`,
      errors: [{ messageId: 'noRawDom' }],
    },
    {
      name: 'flags getElementById in @click',
      code: `<button @click="document.getElementById('foo')">Click</button>`,
      errors: [{ messageId: 'noRawDom' }],
    },
    {
      name: 'flags multiple raw DOM calls in x-init',
      code: `<div x-init="document.querySelector('#a'); document.getElementById('b')"></div>`,
      errors: [
        { messageId: 'noRawDom' },
        { messageId: 'noRawDom' },
      ],
    },
    {
      name: 'flags raw DOM access inside conditional expression',
      code: `<div x-show="document.querySelector('.visible') !== null"></div>`,
      errors: [{ messageId: 'noRawDom' }],
    },
    {
      name: 'flags nested DOM access in method call',
      code: `<div x-init="foo(document.querySelector('#bar'))"></div>`,
      errors: [{ messageId: 'noRawDom' }],
    },
    {
      name: 'flags querySelectorAll',
      code: `<button @click="document.querySelectorAll('.btn').forEach(el => el.click())"></button>`,
      errors: [{ messageId: 'noRawDom' }],
    },
  ],
});
