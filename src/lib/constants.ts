import type { Config, CallbackProps, Options } from './types';

export const defaultOptions: Options = {};
export const defaultConfig: Config = { disconnectOnLeave: false };
export const noop = () => {};
export const defaultProps: CallbackProps = {
  onEnterViewport: noop,
  onLeaveViewport: noop,
};
