import type { Position, WissConfig } from './types';

export interface ResolvedConfig {
  position: Position;
  duration: number;
  theme: 'light' | 'dark';
  format: 'classic' | 'island';
  offset: number;
  progressBar: boolean;
}

const defaultConfig: ResolvedConfig = {
  position: 'bottom-right',
  duration: 4000,
  theme: 'dark',
  format: 'classic',
  offset: 16,
  progressBar: false,
};

let config: ResolvedConfig = { ...defaultConfig };

export function getConfig(): ResolvedConfig {
  return config;
}

export function setConfig(next: WissConfig): void {
  config = {
    position: next.position ?? config.position,
    duration: next.duration ?? config.duration,
    theme: next.theme ?? config.theme,
    format: next.format ?? config.format,
    offset: next.offset ?? config.offset,
    progressBar: next.progressBar ?? config.progressBar,
  };
}
