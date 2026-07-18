import { initToaster } from '../vanilla';
import { subscribeHistory } from '../core';
import type { Position, WissConfig, Toast } from '../core/types';
import { readable } from 'svelte/store';

/**
 * Svelte wrapper for the wiss toast system.
 *
 * Since we can't ship a `.svelte` component from a pure Vite library
 * build (that would require the Svelte compiler plugin), we export a
 * simple `createToaster` action/function that the consumer calls from
 * their own component's `onMount`.
 *
 * ### Usage (Svelte 3/4)
 * ```svelte
 * <script>
 *   import { onMount } from 'svelte';
 *   import { createToaster } from '@ejcp/wiss/svelte';
 *   import { toast } from '@ejcp/wiss';
 *
 *   onMount(() => createToaster({ position: 'bottom-right', theme: 'dark' }));
 * </script>
 *
 * <button on:click={() => toast.success('¡Hecho!')}>Notify</button>
 * ```
 *
 * ### Usage (Svelte 5)
 * ```svelte
 * <script>
 *   import { createToaster } from '@ejcp/wiss/svelte';
 *   import { toast } from '@ejcp/wiss';
 *
 *   $effect(() => createToaster({ position: 'bottom-right', theme: 'dark' }));
 * </script>
 *
 * <button onclick={() => toast.success('¡Hecho!')}>Notify</button>
 * ```
 */
export function createToaster(config?: WissConfig): void {
  initToaster(config);
}

export const toastHistory = readable<Toast[]>([], (set) => {
  return subscribeHistory(set);
});

export type { WissConfig, Position } from '../core/types';
