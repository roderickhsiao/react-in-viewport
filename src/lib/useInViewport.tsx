import {
  type RefObject, useEffect, useRef, useState,
} from 'react';

import { defaultOptions, defaultConfig, defaultProps } from './constants';

import type { Config, CallbackProps, Options } from './types';

const defaultMutationObserverOption = {
  childList: true,
  subtree: true,
};

const useInViewport = (
  target: RefObject<HTMLElement | null>,
  options: Options = defaultOptions,
  config: Config = defaultConfig,
  props: CallbackProps = defaultProps,
) => {
  const [, forceUpdate] = useState<boolean>();

  const observer = useRef<IntersectionObserver>(undefined);

  // Keep the newest callbacks, options and config in refs so the observer
  // effect can depend on their *values* rather than their identities. Without
  // this, a consumer passing inline literals — `options={{ rootMargin: '0px' }}`
  // or `onEnterViewport={() => …}`, both of which the README examples use —
  // tears down and rebuilds the IntersectionObserver on every single render.
  const callbacksRef = useRef(props);
  callbacksRef.current = props;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const configRef = useRef(config);
  configRef.current = config;

  const inViewportRef = useRef<boolean>(false);
  const intersected = useRef<boolean>(false);

  const enterCountRef = useRef<number>(0);
  const leaveCountRef = useRef<number>(0);
  // State to track when target is available
  const [isTargetReady, setIsTargetReady] = useState(Boolean(target.current));

  // Value identities for the observer inputs. `root` is an element and stays a
  // dependency of its own; `rootMargin` and `threshold` are serialisable.
  const optionsKey = `${options.rootMargin ?? ''}|${JSON.stringify(options.threshold ?? null)}`;
  const configKey = String(config.disconnectOnLeave);

  function startObserver({
    observerRef,
  }: {
    observerRef: IntersectionObserver | undefined;
  }) {
    const targetRef = target.current;
    if (targetRef) {
      const node = targetRef;
      if (node) {
        observerRef?.observe(node);
      }
    }
  }

  function stopObserver({
    observerRef,
  }: {
    observerRef: IntersectionObserver | undefined;
  }) {
    const targetRef = target.current;
    if (targetRef) {
      const node = targetRef;
      if (node) {
        observerRef?.unobserve(node);
      }
    }

    observerRef?.disconnect();
    observer.current = undefined;
  }

  const handleIntersection: IntersectionObserverCallback = (entries) => {
    // A single delivery can carry several entries for the same target when the
    // observer coalesces changes that happened between two deliveries. The last
    // one is the current state; acting on `entries[0]` fires the callback for a
    // state the element has already left, and never applies the real one.
    const entry = entries.at(-1);
    if (!entry) {
      return;
    }

    const { isIntersecting, intersectionRatio } = entry;
    const isInViewport = typeof isIntersecting !== 'undefined'
      ? isIntersecting
      : intersectionRatio > 0;

    // enter
    if (!intersected.current && isInViewport) {
      intersected.current = true;
      callbacksRef.current.onEnterViewport?.();
      enterCountRef.current += 1;
      inViewportRef.current = isInViewport;
      forceUpdate(isInViewport);
      return;
    }

    // leave
    if (intersected.current && !isInViewport) {
      intersected.current = false;
      callbacksRef.current.onLeaveViewport?.();
      if (configRef.current.disconnectOnLeave && observer.current) {
        // disconnect observer on leave
        observer.current.disconnect();
      }
      leaveCountRef.current += 1;
      inViewportRef.current = isInViewport;
      forceUpdate(isInViewport);
    }
  };

  function initIntersectionObserver({
    observerRef,
  }: {
    observerRef: IntersectionObserver | undefined;
  }) {
    if (!observerRef) {
      observer.current = new IntersectionObserver(
        handleIntersection,
        optionsRef.current,
      );
      return observer.current;
    }
    return observerRef;
  }

  useEffect(() => {
    let observerRef = observer.current;
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    observerRef = initIntersectionObserver({ observerRef });

    startObserver({
      observerRef,
    });

    return () => {
      stopObserver({
        observerRef,
      });
    };
    // `options.root` is an element, so it is compared by identity; the rest of
    // the observer inputs are compared by value via `optionsKey`/`configKey`.
    // The callbacks are deliberately absent — `handleIntersection` reads them
    // from `callbacksRef`, so a new inline function does not rebuild the
    // observer.
  }, [isTargetReady, options.root, optionsKey, configKey]);

  // Use MutationObserver to detect when `target.current` becomes non-null
  // only at start up
  useEffect(() => {
    const currentElement = target.current;
    let mutationObserver: MutationObserver | null = null;

    // MutationObserver callback to check when the target ref is assigned
    const handleOnChange = () => {
      if (target.current && !isTargetReady) {
        setIsTargetReady(true);
        if (mutationObserver) {
          mutationObserver.disconnect();
        }
      }
    };

    if (currentElement) {
      setIsTargetReady(true); // If target is already available, mark it ready
    } else {
      // Observe changes to detect when `target.current` becomes non-null
      mutationObserver = new MutationObserver(handleOnChange);
      mutationObserver.observe(document.body, defaultMutationObserverOption);
    }

    // Cleanup function to stop observing when the component unmounts
    return () => {
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
    };
  }, [target.current]);

  return {
    inViewport: inViewportRef.current,
    enterCount: enterCountRef.current,
    leaveCount: leaveCountRef.current,
  };
};

export default useInViewport;
