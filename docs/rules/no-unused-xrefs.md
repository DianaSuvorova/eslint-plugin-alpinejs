# no-unused-x-ref

❌ Disallow unused `x-ref` attributes that are not accessed via `$refs` in Alpine.js expressions.

✅ Encourages clean, maintainable code by removing dead references.

## 🔧 Rule Details
This rule checks for `x-ref="foo"` attributes that are never used via `$refs.foo` in any Alpine directive like `@click`, `x-init`, `x-show`, etc.

Removing unused refs helps reduce cognitive overhead and avoid misleading markup.

❌ Incorrect

```html
<!-- x-ref defined, but never used -->
<input x-ref="unusedInput">
```

✅ Correct

```html
<!-- Used via $refs -->
<input x-ref="username">
<button @click="$refs.username.focus()">Focus</button>
```

```html
<!-- Used in x-init -->
<div x-ref="panel" x-init="$refs.panel.scrollIntoView()"></div>
```

```html
<!-- Passed to a custom method -->
<div x-ref="box" x-init="setup($refs.box)"></div>

```
