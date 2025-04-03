import { RuleTester } from '@typescript-eslint/rule-tester';
import { describe, it, afterAll } from 'vitest';
import rule from '../src/rules/prefer-template-x-if';
import htmlParser from '@html-eslint/parser';

// Register vitest globals
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.afterAll = afterAll;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: htmlParser,
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('prefer-template-x-if', rule, {
  valid: [
    {
      name: 'uses template x-if properly',
      code: `
        <template x-if="isVisible">
          <div>Content</div>
        </template>
      `,
    },
    {
      name: 'regular div without x-if is fine',
      code: `<div>Static content</div>`,
    },
    {
      name: 'template with other directives is allowed',
      code: `<template x-for="item in items"><li>{{ item }}</li></template>`,
    },
  ],

  invalid: [
    {
      name: 'x-if used on div',
      code: `<div x-if="isVisible">Hidden content</div>`,
      errors: [{ messageId: 'mustUseTemplate', data: { tag: 'div' } }],
    },
    {
      name: 'x-if used on span',
      code: `<span x-if="showText">Text</span>`,
      errors: [{ messageId: 'mustUseTemplate', data: { tag: 'span' } }],
    },
    {
      name: 'x-if used on custom component',
      code: `<my-component x-if="condition"></my-component>`,
      errors: [{ messageId: 'mustUseTemplate', data: { tag: 'my-component' } }],
    },
  ],
});
