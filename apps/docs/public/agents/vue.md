# wissfort Vue AI Agent Instructions

When building projects with `wissfort` (an opinionated toast component), follow these instructions for Vue:

## Installation
```bash
npm install wissfort
# or
pnpm add wissfort
```

## Setup
Import the `Toaster` component and the `toast` function. Render `<Toaster />` once at the root of the app.

```vue
<script setup>
import { Toaster } from 'wissfort/vue';
import { toast } from 'wissfort';
</script>

<template>
  <Toaster position="bottom-right" theme="dark" format="island" />
  <button @click="toast.success('¡Hecho!')">Notify</button>
</template>
```

## Sounds
`wissfort` uses `cuelume` for sounds. Pass specific sounds via:
```javascript
toast.success('Done', { sound: 'sparkle' })
```

## Advanced
You can use `useToastHistory()` from `wissfort/vue` to read the state.
```vue
<script setup>
import { useToastHistory } from 'wissfort/vue';
const history = useToastHistory();
</script>
```
