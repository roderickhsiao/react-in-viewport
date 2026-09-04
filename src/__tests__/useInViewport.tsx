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

beforeEach(() => {
  observerCallback = undefined;
  constructions = 0;
  mockDisconnect.mockClear();
  (
    global as unknown as { IntersectionObserver: unknown }
  ).IntersectionObserver = jest.fn((cb: IOCallback) => {
    observerCallback = cb;
    constructions += 1;
    return {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: mockDisconnect,
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
function renderProbe(props: ProbeProps = {}) {
  let rerender: (n: number) => void = () => {};

  const Probe = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [, setN] = useState(0);
    rerender = setN;

    useInViewport(
      ref,
      props.inline ? { rootMargin: '0px' } : props.options,
      props.inline ? { disconnectOnLeave: false } : props.config,
      props.inline
        ? { onEnterViewport: () => {}, onLeaveViewport: () => {} }
        : props.callbacks,
    );

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
