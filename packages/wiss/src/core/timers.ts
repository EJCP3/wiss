import { removeToast } from './store';

interface TimerEntry {
  timer: ReturnType<typeof setTimeout> | null;
  remaining: number;
  startedAt: number;
}

const timers = new Map<string, TimerEntry>();

export function scheduleDismiss(id: string, durationMs: number): void {
  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    return;
  }

  const timer = setTimeout(() => {
    timers.delete(id);
    removeToast(id);
  }, durationMs);

  timers.set(id, { timer, remaining: durationMs, startedAt: Date.now() });
}

export function cancelDismiss(id: string): void {
  const entry = timers.get(id);
  if (!entry) {
    return;
  }

  if (entry.timer !== null) {
    clearTimeout(entry.timer);
  }
  timers.delete(id);
}

export function pauseAll(): void {
  for (const [id, entry] of timers) {
    if (entry.timer === null) {
      continue;
    }

    clearTimeout(entry.timer);
    const elapsed = Date.now() - entry.startedAt;
    const remaining = entry.remaining - elapsed;

    timers.set(id, { timer: null, remaining, startedAt: entry.startedAt });
  }
}

export function resumeAll(): void {
  for (const [id, entry] of timers) {
    if (entry.timer !== null) {
      continue;
    }

    if (entry.remaining <= 0) {
      timers.delete(id);
      removeToast(id);
      continue;
    }

    const startedAt = Date.now();
    const timer = setTimeout(() => {
      timers.delete(id);
      removeToast(id);
    }, entry.remaining);

    timers.set(id, { timer, remaining: entry.remaining, startedAt });
  }
}
