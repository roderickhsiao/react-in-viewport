import type { Config, Props, Options } from './types';

export const defaultOptions: Options = {};
export const defaultConfig: Config = { disconnectOnLeave: false };
export const noop = () => {};
export const defaultProps: Props = {
  onEnterViewport: noop,
  onLeaveViewport: noop,
};
