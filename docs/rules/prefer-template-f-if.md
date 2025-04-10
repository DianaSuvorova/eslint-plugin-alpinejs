# prefer-template-x-if

❌ Disallow using `x-if` on non-`<template>` elements in Alpine.js.

✅ Enforces using `<template x-if>` for conditional rendering, which is the recommended way to avoid DOM mutation issues.

---

## 🔧 Rule Details

When using `x-if`, Alpine.js removes and re-adds elements from the real DOM — not a virtual DOM. This means:

- Applying `x-if` to regular elements (like `<div>` or `<span>`) may cause issues with transitions, layout shifts, or reactivity.
- Wrapping conditionals in `<template>` ensures clean and predictable behavior.

---

❌ Incorrect

```html
<div x-if="isVisible">Content</div>
```

```html
<span x-if="shouldShow">Text</span>
```

```html
<custom-component x-if="enabled"></custom-component>
```


✅ Correct

```html
<template x-if="isVisible">
  <div>Content</div>
</template>
```

```html
<template x-if="shouldShow">
  <span>Text</span>
</template>

```