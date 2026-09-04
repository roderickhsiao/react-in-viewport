import { useRef, useState } from 'react';
import { render, act } from '@testing-library/react';

import useInViewport from '../lib/useInViewport';
import type { CallbackProps, Config, Options } from '../lib/types';

// Controlled IntersectionObserver mock. Unlike the HOC suite's mock this one
// also counts constructions, so tests can assert the observer is not rebuilt.
type IOCallback = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver,
) => void;

let observerCallback: IOCallback | undefined;
let constructions = 0;
const mockDisconnect = jest.fn();
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();

beforeEach(() => {
  observerCallback = undefined;
  constructions = 0;
  mockDisconnect.mockClear();
  mockObserve.mockClear();
  mockUnobserve.mockClear();
  (
    global as unknown as { IntersectionObserver: unknown }
  ).IntersectionObserver = jest.fn((cb: IOCallback) => {
    observerCallback = cb;
    constructions += 1;
    // A torn-down observer delivers nothing. Without this the mock keeps the
    // callback reachable and `deliver` can reach an observer the hook dropped.
    const stop = () => {
      if (observerCallback === cb) {
        observerCallback = undefined;
      }
    };
    return {
      observe: mockObserve,
      unobserve: (...args: unknown[]) => {
        mockUnobserve(...args);
        stop();
      },
      disconnect: (...args: unknown[]) => {
        mockDisconnect(...args);
        stop();
      },
    };
  });
});

const entry = (isIntersecting: boolean) => ({
  isIntersecting,
  intersectionRatio: isIntersecting ? 1 : 0,
}) as IntersectionObserverEntry;

/** Fire one delivery carrying the given entries, in order. */
const deliver = (...entries: IntersectionObserverEntry[]) => {
  act(() => {
    // The observer argument is unused by the hook.
    observerCallback?.(entries, {} as IntersectionObserver);
  });
};

type ProbeProps = {
  options?: Options;
  config?: Config;
  callbacks?: CallbackProps;
  /** When true, pass fresh object/function literals on every render. */
  inline?: boolean;
};

/** Renders a hook consumer and exposes a re-render trigger. */
let latest: ReturnType<typeof useInViewport> | undefined;
let renderCount = 0;

function renderProbe(props: ProbeProps = {}) {
  let rerender: (n: number) => void = () => {};
  latest = undefined;
  renderCount = 0;

  const Probe = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [, setN] = useState(0);
    rerender = setN;

    latest = useInViewport(
      ref,
      props.inline ? { rootMargin: '0px' } : props.options,
      props.inline ? { disconnectOnLeave: false } : props.config,
      props.inline
        ? { onEnterViewport: () => {}, onLeaveViewport: () => {} }
        : props.callbacks,
    );
    renderCount += 1;

    return <div ref={ref} />;
  };

  const utils = render(<Probe />);
  return { ...utils, rerender: (n: number) => act(() => rerender(n)) };
}

describe('useInViewport — latest entry wins', () => {
  it('does not fire enter when the element entered and left within one delivery', () => {
    const onEnterViewport = jest.fn();
    const onLeaveViewport = jest.fn();
    renderProbe({ callbacks: { onEnterViewport, onLeaveViewport } });

    // Net change for a never-entered element is nothing: it was out of view
    // and it still is. Reading `entries[0]` fired a spurious enter here.
    deliver(entry(true), entry(false));

    expect(onEnterViewport).not.toHaveBeenCalled();
    expect(onLeaveViewport).not.toHaveBeenCalled();
  });

  it('fires enter when the current state is in view behind a stale entry', () => {
    const onEnterViewport = jest.fn();
    renderProbe({ callbacks: { onEnterViewport } });

    // Stale "out of view" followed by the current "in view". Reading
    // `entries[0]` saw only the stale one and never reported the entry.
    deliver(entry(false), entry(true));

    expect(onEnterViewport).toHaveBeenCalledTimes(1);
  });

  it('fires leave when the current state is out of view behind a stale entry', () => {
    const onLeaveViewport = jest.fn();
    renderProbe({ callbacks: { onLeaveViewport } });

    deliver(entry(true));
    expect(onLeaveViewport).not.toHaveBeenCalled();

    // Stale "in view" followed by the current "out of view". Reading
    // `entries[0]` matched the already-current state and dropped the leave.
    deliver(entry(true), entry(false));

    expect(onLeaveViewport).toHaveBeenCalledTimes(1);
  });

  it('ignores an empty delivery', () => {
    const onEnterViewport = jest.fn();
    const onLeaveViewport = jest.fn();
    renderProbe({ callbacks: { onEnterViewport, onLeaveViewport } });

    deliver();

    expect(onEnterViewport).not.toHaveBeenCalled();
    expect(onLeaveViewport).not.toHaveBeenCalled();
  });
});

describe('useInViewport — observer is not rebuilt per render', () => {
  it('keeps one observer across re-renders with inline options and callbacks', () => {
    const { rerender } = renderProbe({ inline: true });

    const afterMount = constructions;
    rerender(1);
    rerender(2);
    rerender(3);

    expect(constructions).toBe(afterMount);
  });

  it('still calls the newest callback identity after a re-render', () => {
    const first = jest.fn();
    const second = jest.fn();
    let current = first;
    let bump: (n: number) => void = () => {};

    const Probe = () => {
      const ref = useRef<HTMLDivElement>(null);
      const [, setN] = useState(0);
      bump = setN;
      useInViewport(ref, {}, {}, { onEnterViewport: () => current() });
      return <div ref={ref} />;
    };
    render(<Probe />);

    current = second;
    act(() => bump(1));

    deliver(entry(true));

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('rebuilds the observer when an option value actually changes', () => {
    let setMargin: (m: string) => void = () => {};

    const Probe = () => {
      const ref = useRef<HTMLDivElement>(null);
      const [margin, setter] = useState('0px');
      setMargin = setter;
      useInViewport(ref, { rootMargin: margin });
      return <div ref={ref} />;
    };
    render(<Probe />);

    const afterMount = constructions;
    act(() => setMargin('100px'));

    expect(constructions).toBeGreaterThan(afterMount);
  });
});

describe('useInViewport — hasReported', () => {
  it('is false before the observer has delivered anything', () => {
    renderProbe();

    expect(latest?.hasReported).toBe(false);
    expect(latest?.inViewport).toBe(false);
  });

  it('becomes true when the first report is out of view', () => {
    renderProbe();

    // The case a reload at a restored mid-page scroll produces. Previously
    // indistinguishable from the not-yet-reported state: `inViewport` is
    // `false` either way.
    deliver(entry(false));

    expect(latest?.hasReported).toBe(true);
    expect(latest?.inViewport).toBe(false);
  });

  it('becomes true when the first report is in view', () => {
    renderProbe();

    deliver(entry(true));

    expect(latest?.hasReported).toBe(true);
    expect(latest?.inViewport).toBe(true);
  });

  it('does not count the first out-of-view report as a leave', () => {
    const onLeaveViewport = jest.fn();
    renderProbe({ callbacks: { onLeaveViewport } });

    deliver(entry(false));

    // Not a transition — the element never entered. The callbacks stay
    // edge-triggered, so lazy-load consumers see no change in behaviour.
    expect(onLeaveViewport).not.toHaveBeenCalled();
    expect(latest?.leaveCount).toBe(0);
  });

  it('does not disconnect on the first out-of-view report with disconnectOnLeave', () => {
    renderProbe({ config: { disconnectOnLeave: true } });
    // The effect cleanup disconnects on the isTargetReady false→true
    // transition; clear that so this asserts only on intersection handling.
    mockDisconnect.mockClear();

    deliver(entry(false));

    // A below-the-fold element must not disconnect before it has ever been seen.
    expect(mockDisconnect).not.toHaveBeenCalled();
  });

  it('still fires enter normally after an initial out-of-view report', () => {
    const onEnterViewport = jest.fn();
    renderProbe({ callbacks: { onEnterViewport } });

    deliver(entry(false));
    deliver(entry(true));

    expect(onEnterViewport).toHaveBeenCalledTimes(1);
    expect(latest?.inViewport).toBe(true);
    expect(latest?.enterCount).toBe(1);
  });

  it('costs exactly one render to publish the initial out-of-view state', () => {
    renderProbe();

    const before = renderCount;
    deliver(entry(false));
    const afterFirstReport = renderCount;

    // A second identical report is not a change and must not re-render.
    deliver(entry(false));

    expect(afterFirstReport - before).toBe(1);
    expect(renderCount).toBe(afterFirstReport);
  });
});

describe('useInViewport — config.enabled pauses observation', () => {
  /** Renders a consumer whose `enabled` can be toggled from the test. */
  function renderTogglable(initial = true) {
    let setEnabled: (on: boolean) => void = () => {};
    const onEnterViewport = jest.fn();
    const onLeaveViewport = jest.fn();

    const Probe = () => {
      const ref = useRef<HTMLDivElement>(null);
      const [enabled, setter] = useState(initial);
      setEnabled = setter;

      useInViewport(ref, {}, { enabled }, { onEnterViewport, onLeaveViewport });

      return <div ref={ref} />;
    };

    render(<Probe />);
    return {
      onEnterViewport,
      onLeaveViewport,
      setEnabled: (on: boolean) => act(() => setEnabled(on)),
    };
  }

  it('observes by default when config omits enabled', () => {
    const onEnterViewport = jest.fn();
    renderProbe({
      config: { disconnectOnLeave: true },
      callbacks: { onEnterViewport },
    });

    // `enabled` is absent here, not false — the element must still be observed.
    deliver(entry(true));

    expect(onEnterViewport).toHaveBeenCalledTimes(1);
  });

  it('does not observe when mounted with enabled false', () => {
    renderTogglable(false);

    expect(constructions).toBe(0);
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('unobserves when enabled flips to false', () => {
    const { setEnabled } = renderTogglable();
    const observedAtMount = mockObserve.mock.calls.length;
    const unobservedAtMount = mockUnobserve.mock.calls.length;

    setEnabled(false);

    expect(mockUnobserve.mock.calls.length).toBe(unobservedAtMount + 1);
    expect(mockObserve.mock.calls.length).toBe(observedAtMount);
  });

  it('reports nothing while paused', () => {
    const { onEnterViewport, setEnabled } = renderTogglable();
    setEnabled(false);

    // Nothing is observed, so the browser has nothing to deliver — this is the
    // tab-click case: sections crossed mid-scroll are never reported.
    deliver(entry(true));

    expect(onEnterViewport).not.toHaveBeenCalled();
  });

  it('observes again when enabled flips back to true', () => {
    const { setEnabled } = renderTogglable();
    const afterMount = constructions;
    const observedAtMount = mockObserve.mock.calls.length;

    setEnabled(false);
    setEnabled(true);

    expect(constructions).toBe(afterMount + 1);
    expect(mockObserve.mock.calls.length).toBe(observedAtMount + 1);
  });

  it('reconciles to the current state on resume rather than replaying', () => {
    const { onEnterViewport, onLeaveViewport, setEnabled } = renderTogglable();

    deliver(entry(true));
    expect(onEnterViewport).toHaveBeenCalledTimes(1);

    setEnabled(false);
    setEnabled(true);

    // Re-observing delivers the element's current state. It left while paused,
    // so the net change is reported once, now — not once per section crossed.
    deliver(entry(false));

    expect(onLeaveViewport).toHaveBeenCalledTimes(1);
    expect(onEnterViewport).toHaveBeenCalledTimes(1);
  });

  it('does not re-fire enter on resume when the element never moved', () => {
    const { onEnterViewport, onLeaveViewport, setEnabled } = renderTogglable();

    deliver(entry(true));
    setEnabled(false);
    setEnabled(true);

    // Still in view: the resume delivery matches the state the hook already
    // holds, so it is not a transition and nothing fires.
    deliver(entry(true));

    expect(onEnterViewport).toHaveBeenCalledTimes(1);
    expect(onLeaveViewport).not.toHaveBeenCalled();
  });
});
