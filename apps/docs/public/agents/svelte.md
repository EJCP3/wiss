# wissfort Svelte AI Agent Instructions

When building projects with `wissfort` (an opinionated toast component), follow these instructions for Svelte:

## Installation
```bash
npm install wissfort
# or
pnpm add wissfort
```

## Setup
Use the `toaster` function from `wissfort/svelte` in your root layout/component.

### Svelte 5
```svelte
<script>
  import { toaster } from 'wissfort/svelte';
  import { toast } from 'wissfort';

  $effect(() => toaster({ position: 'bottom-right', theme: 'dark', format: 'island' }));
</script>

<button onclick={() => toast.success('¡Hecho!')}>Notify</button>
```

### Svelte 3/4
```svelte
<script>
  import { onMount } from 'svelte';
  import { toaster } from 'wissfort/svelte';
  import { toast } from 'wissfort';

  onMount(() => toaster({ position: 'bottom-right', theme: 'dark', format: 'island' }));
</script>

<button on:click={() => toast.success('¡Hecho!')}>Notify</button>
```

## Sounds
`wissfort` uses `cuelume` for sounds. Pass specific sounds via:
```javascript
toast.success('Done', { sound: 'sparkle' })
```
