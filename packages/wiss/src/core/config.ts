import type { Position, WissConfig } from './types';

export interface ResolvedConfig {
  position: Position;
  duration: number;
  theme: 'sileo' | 'daisy';
  offset: number;
}

const defaultConfig: ResolvedConfig = {
  position: 'bottom-right',
  duration: 4000,
  theme: 'sileo',
  offset: 16,
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
    offset: next.offset ?? config.offset,
  };
}
