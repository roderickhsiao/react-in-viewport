import { PureComponent } from 'react';
import { render, act } from '@testing-library/react';
import { handleViewport } from '../index';
import type { InjectedViewportProps } from '../lib/types';

// Controlled IntersectionObserver mock — lets tests manually fire intersection events
type IOCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void;
let observerCallback: IOCallback | undefined;
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

beforeEach(() => {
  observerCallback = undefined;
  mockObserve.mockClear();
  mockUnobserve.mockClear();
  mockDisconnect.mockClear();
  (global as unknown as { IntersectionObserver: unknown }).IntersectionObserver = jest.fn(
    (cb: IOCallback) => {
      observerCallback = cb;
      return { observe: mockObserve, unobserve: mockUnobserve, disconnect: mockDisconnect };
    },
  );
});

/**
 * DemoClass must attach forwardedRef to a DOM node so IntersectionObserver
 * has a target to observe. Without this, target.current stays null and the
 * observer is never created.
 */
class DemoClass extends PureComponent<InjectedViewportProps<HTMLDivElement>> {
  render() {
    const {
      inViewport, enterCount, leaveCount, forwardedRef,
    } = this.props;
    return (
      <div ref={forwardedRef} style={{ width: '400px', height: '300px' }}>
        <span data-testid="state">
          {inViewport ? 'in viewport' : 'not in viewport'}
        </span>
        <span data-testid="enterCount">{enterCount}</span>
        <span data-testid="leaveCount">{leaveCount}</span>
      </div>
    );
  }
}

/** Helper — fires an intersection event through the captured observer callback */
const triggerIntersection = (isIntersecting: boolean) => {
  act(() => {
    observerCallback?.(
      [{ isIntersecting, intersectionRatio: isIntersecting ? 1 : 0 } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
};

describe('In Viewport', () => {
  it('renders not in viewport initially', () => {
    const TestNode = handleViewport(DemoClass);
    const { getByTestId } = render(<TestNode />);
    expect(getByTestId('state').textContent).toBe('not in viewport');
    expect(getByTestId('enterCount').textContent).toBe('0');
    expect(getByTestId('leaveCount').textContent).toBe('0');
  });

  it('updates to in viewport when element enters', () => {
    const TestNode = handleViewport(DemoClass);
    const { getByTestId } = render(<TestNode />);
    triggerIntersection(true);
    expect(getByTestId('state').textContent).toBe('in viewport');
    expect(getByTestId('enterCount').textContent).toBe('1');
  });

  it('updates to not in viewport when element leaves', () => {
    const TestNode = handleViewport(DemoClass);
    const { getByTestId } = render(<TestNode />);
    triggerIntersection(true);
    triggerIntersection(false);
    expect(getByTestId('state').textContent).toBe('not in viewport');
    expect(getByTestId('leaveCount').textContent).toBe('1');
  });

  it('calls onEnterViewport and onLeaveViewport callbacks', () => {
    const onEnterViewport = jest.fn();
    const onLeaveViewport = jest.fn();
    const TestNode = handleViewport(DemoClass);
    render(<TestNode onEnterViewport={onEnterViewport} onLeaveViewport={onLeaveViewport} />);

    triggerIntersection(true);
    expect(onEnterViewport).toHaveBeenCalledTimes(1);

    triggerIntersection(false);
    expect(onLeaveViewport).toHaveBeenCalledTimes(1);
  });

  it('disconnects observer when disconnectOnLeave is true', () => {
    const TestNode = handleViewport(DemoClass, {}, { disconnectOnLeave: true });
    render(<TestNode />);
    // clear counts from initial mount (isTargetReady false→true transition re-runs the effect)
    mockDisconnect.mockClear();
    triggerIntersection(true);
    triggerIntersection(false);
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('keeps observing after leave when disconnectOnLeave is false', () => {
    const TestNode = handleViewport(DemoClass, {}, { disconnectOnLeave: false });
    const { getByTestId } = render(<TestNode />);
    triggerIntersection(true);
    triggerIntersection(false);
    triggerIntersection(true); // second entry — only possible if observer was not disconnected
    expect(getByTestId('enterCount').textContent).toBe('2');
  });
});
