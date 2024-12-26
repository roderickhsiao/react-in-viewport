import type { RefObject } from 'react';

export type Config = {
  disconnectOnLeave?: boolean;
};

export type InjectedViewportProps<TElement extends HTMLElement = HTMLElement> = {
  inViewport: boolean;
  enterCount: number;
  leaveCount: number;
  readonly forwardedRef: RefObject<TElement>;
};

export type CallbackProps = {
  onEnterViewport?: VoidFunction
  onLeaveViewport?: VoidFunction;
};

export type Options = IntersectionObserverInit;
