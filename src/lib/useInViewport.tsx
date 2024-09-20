import React, { useCallback, useEffect, useRef, useState } from 'react';

import { defaultOptions, defaultConfig, defaultProps } from './constants';

import type { Config, CallbackProps, Options } from './types';

const useDOMObserver = (
  ref: React.RefObject<HTMLElement>,
  onChange: (mutations: MutationRecord[]) => void,
  options: MutationObserverInit = {
    attributes: true,
    childList: true,
    subtree: true,
  }
) => {
  useEffect(() => {
    const currentElement = ref.current;
    let observer: MutationObserver;
    if (currentElement) {
      observer = new MutationObserver(onChange);

      // Start observing the DOM element for mutations
      observer.observe(currentElement, options);
    }

    // Cleanup function to stop observing when the component unmounts
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [ref, onChange, options]);
};

const useInViewport = (
  target: React.RefObject<HTMLElement>,
  options: Options = defaultOptions,
  config: Config = defaultConfig,
  props: CallbackProps = defaultProps
) => {
  const { onEnterViewport, onLeaveViewport } = props;
  const [, forceUpdate] = useState<boolean>();

  const observer = useRef<IntersectionObserver>();

  const inViewportRef = useRef<boolean>(false);
  const intersected = useRef<boolean>(false);

  const enterCountRef = useRef<number>(0);
  const leaveCountRef = useRef<number>(0);

  function startObserver({ observerRef }) {
    const targetRef = target.current;
    if (targetRef) {
      const node = targetRef;
      if (node) {
        observerRef?.observe(node);
      }
    }
  }

  function stopObserver({ observerRef }) {
    const targetRef = target.current;
    if (targetRef) {
      const node = targetRef;
      if (node) {
        observerRef?.unobserve(node);
      }
    }

    observerRef?.disconnect();
    observer.current = null;
  }

  const handleIntersection: IntersectionObserverCallback = (entries) => {
    const entry = entries[0] || ({} as IntersectionObserverEntry);
    const { isIntersecting, intersectionRatio } = entry;
    const isInViewport =
      typeof isIntersecting !== 'undefined'
        ? isIntersecting
        : intersectionRatio > 0;

    // enter
    if (!intersected.current && isInViewport) {
      intersected.current = true;
      onEnterViewport?.();
      enterCountRef.current += 1;
      inViewportRef.current = isInViewport;
      forceUpdate(isInViewport);
      return;
    }

    // leave
    if (intersected.current && !isInViewport) {
      intersected.current = false;
      onLeaveViewport?.();
      if (config.disconnectOnLeave && observer.current) {
        // disconnect observer on leave
        observer.current.disconnect();
      }
      leaveCountRef.current += 1;
      inViewportRef.current = isInViewport;
      forceUpdate(isInViewport);
    }
  };

  function initIntersectionObserver({ observerRef }) {
    if (!observerRef) {
      observer.current = new IntersectionObserver(handleIntersection, options);
      return observer.current;
    }
    return observerRef;
  }

  const attachObserver = useCallback(({ observerRef }) => {
    startObserver({
      observerRef,
    });

    return () => {
      stopObserver({
        observerRef,
      });
    };
  }, []);

  const handleMutation = useCallback(() => {
    const observerRef = observer.current;
    attachObserver({ observerRef });
  }, []);

  useEffect(() => {
    let observerRef = observer.current;
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    observerRef = initIntersectionObserver({ observerRef });

    attachObserver({ observerRef });
  }, [options, config, onEnterViewport, onLeaveViewport]);

  // handles when ref changes
  useDOMObserver(target, handleMutation);

  return {
    inViewport: inViewportRef.current,
    enterCount: enterCountRef.current,
    leaveCount: leaveCountRef.current,
  };
};

export default useInViewport;
