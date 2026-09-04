import type { RefObject } from 'react';

export type Config = {
  disconnectOnLeave?: boolean;
};

export type InjectedViewportProps<TElement extends HTMLElement = HTMLElement> =
  {
    inViewport: boolean;
    enterCount: number;
    leaveCount: number;
    /**
     * Whether the IntersectionObserver has delivered anything yet.
     *
     * `inViewport` starts `false`, which is indistinguishable from an observed
     * "out of view" — so a consumer that derives UI state from the current
     * position (a header that is transparent over a hero, say) cannot tell
     * "not known yet" from "known to be out of view". A page reloaded at a
     * restored mid-page scroll is exactly that case: the first report is
     * out-of-view with no preceding enter, so the enter/leave callbacks stay
     * silent by design and `inViewport` never changes from its initial value.
     *
     * Read this to tell the two apart — `inViewport` is only meaningful once
     * `hasReported` is `true`.
     *
     * Purely additive: existing reads of `inViewport`, `enterCount` and
     * `leaveCount` are unaffected.
     */
    hasReported: boolean;
    readonly forwardedRef: RefObject<TElement>;
  };

export type CallbackProps = {
  onEnterViewport?: VoidFunction;
  onLeaveViewport?: VoidFunction;
};

export type Options = IntersectionObserverInit;
