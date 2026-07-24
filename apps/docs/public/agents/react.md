# wissfort React AI Agent Instructions

When building projects with `wissfort` (an opinionated toast component), follow these instructions for React:

## Installation
```bash
npm install wissfort
# or
pnpm add wissfort
```

## Setup
Import the `Toaster` component and the `toast` function. Render `<Toaster />` once at the root of the app.

```tsx
import { Toaster } from 'wissfort/react';
import { toast } from 'wissfort';

function App() {
  return (
    <>
      <Toaster position="bottom-right" theme="dark" format="island" />
      <button onClick={() => toast.success('¡Hecho!')}>Notify</button>
    </>
  );
}
```

## Sounds
`wissfort` uses `cuelume` for sounds. Pass specific sounds via:
```typescript
toast.success('Done', { sound: 'sparkle' })
```

## Advanced
You can use `useToastHistory()` from `wissfort/react` to read the state.
```tsx
import { useToastHistory } from 'wissfort/react';
```
