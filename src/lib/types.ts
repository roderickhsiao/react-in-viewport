import type { RefObject } from 'react';

export type Config = {
  disconnectOnLeave?: boolean;
  /**
   * Whether the element is observed at all. Defaults to `true`.
   *
   * Setting it to `false` unobserves the element; setting it back to `true`
   * observes it again. It exists for the case where the consumer is the one
   * driving the scroll — a tab click that smooth-scrolls to a section — and
   * does not want the sections crossed on the way there reported as visits.
   *
   * Resuming reconciles rather than replays: re-observing delivers the
   * element's *current* state, so a transition that happened while paused is
   * reported once, on resume, and the intermediate ones never at all.
   *
   * Only honoured by the `useInViewport` hook: `handleViewport` captures its
   * config at wrap time, so a value passed there can never change.
   *
   * Interaction with `disconnectOnLeave`: `enabled` is the outer switch. Once
   * `disconnectOnLeave` has fired, flipping `enabled` back on starts a fresh
   * observation — an explicit request to be enabled is taken at face value.
   */
  enabled?: boolean;
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
