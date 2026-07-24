# wissfort Vanilla AI Agent Instructions

When building projects with `wissfort` (an opinionated toast component), follow these instructions to get the best results.

## Installation
```bash
npm install wissfort
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
