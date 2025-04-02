# no-raw-dom-access

❌ Disallow raw DOM access (document.querySelector, getElementById, etc.) inside Alpine.js directives like @click, x-init, etc.

✅ Recommend using Alpine's built-in x-ref and $refs instead.

🔧 Rule Details

This rule discourages raw DOM access inside Alpine.js directives and encourages using x-ref for cleaner, declarative code.

❌ Incorrect

```html
<button @click="document.querySelector('#myInput').focus()">Click</button>
```

✅ Correct

```html
<input x-ref="myInput">
<button @click="$refs.myInput.focus()">Click</button>
```