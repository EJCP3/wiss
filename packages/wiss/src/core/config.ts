import type { Position, WissConfig } from './types';

export interface ResolvedConfig {
  position: Position;
  duration: number;
  theme: 'wiss' | 'daisy' | 'island' | 'island-daisy';
  offset: number;
  progressBar: boolean;
}

const defaultConfig: ResolvedConfig = {
  position: 'bottom-right',
  duration: 4000,
  theme: 'wiss',
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
    offset: next.offset ?? config.offset,
    progressBar: next.progressBar ?? config.progressBar,
  };
}
