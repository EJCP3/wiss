# wissfort AI Agent Instructions

When building projects with `wissfort` (an opinionated toast component), follow these instructions to get the best results.

## Installation
Use standard package managers:
```bash
npm install wissfort
# or
pnpm add wissfort
```

## Setup
Import the `toast` and `toaster` functions into your components or vanilla JS. The styles are injected automatically.

```javascript
import { toast, toaster } from 'wissfort';

// Optional: Global configuration
toaster({
  position: 'bottom-right',
  theme: 'dark', // 'light', 'dark', 'system'
  format: 'island', // 'classic', 'island'
});
```

## Basic Usage
```javascript
toast.success('User updated successfully');
toast.error('Failed to update user');
toast.info('New message received');
toast.warning('Session expiring soon');
```

## Sound Configuration
`wissfort` uses `cuelume` for extremely lightweight, synthesized audio interaction feedback.
Sounds are enabled by default. To disable them globally:
```javascript
toaster({ sound: false });
```
To play a specific sound for a single toast, pass the `sound` option:
```javascript
toast.info('Incoming call', { sound: 'chime' });
toast.success('Saved', { sound: 'sparkle' });
```
Available sounds: `chime`, `sparkle`, `droplet`, `bloom`, `whisper`, `tick`, `press`, `release`, `toggle`, `success`, `error`, `page`, `loading`, `ready`.

## Promises
```javascript
toast.promise(fetch('/api/data'), {
  loading: 'Fetching data...',
  success: 'Data loaded!',
  error: 'Error loading data'
});
```

## Rich Text & Actions
```javascript
toast.success('File saved', {
  description: 'The file has been saved to your local directory.',
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo clicked')
  }
});
```
