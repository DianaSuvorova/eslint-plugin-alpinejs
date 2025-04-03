# eslint-plugin-alpinejs

An eslint plugin enforcing best practices for [Alpine.js](https://alpinejs.dev/)


## 🚀 Getting Started

### Install

```bash
npm install --save-dev eslint-plugin-alpinejs @html-eslint/parser
```

### ESLint Configuration
Flat Config (ESLint v9+)

```js

// eslint.config.js
import htmlParser from '@html-eslint/parser';
import alpinejs from 'eslint-plugin-alpinejs';

export default [
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: htmlParser,
    },
    plugins: {
      alpinejs,
    },
    rules: {
      'alpinejs/no-raw-dom-access': 'error',
    },
  },
];

```

## Supported Rules

* [alpinejs/no-raw-dom-access](docs/rules/no-raw-dom-access.md)
* [alpinejs/no-unused-xrefs](docs/rules/no-unused-xrefs.md)
* [alpinejs/prefer-template-x-if](docs/prefer-template-x-if.md)
