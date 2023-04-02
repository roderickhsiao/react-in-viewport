export type Config = {
  disconnectOnLeave?: boolean;
};

export type InjectedProps<TElement extends HTMLElement = HTMLElement> = {
  inViewport: boolean;
  enterCount: number;
  leaveCount: number;
  forwardedRef: React.RefObject<TElement>;
};

export type CallbackProps = {
  onEnterViewport?: () => void;
  onLeaveViewport?: () => void;
};

export type Options = IntersectionObserverInit;
