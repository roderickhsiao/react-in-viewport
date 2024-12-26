import {
  type RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

import { defaultOptions, defaultConfig, defaultProps } from './constants';

import type { Config, CallbackProps, Options } from './types';

const defaultMutationObserverOption = {
  attributes: true,
  childList: true,
  subtree: true,
};

const useInViewport = (
  target: RefObject<HTMLElement | null>,
  options: Options = defaultOptions,
  config: Config = defaultConfig,
  props: CallbackProps = defaultProps,
) => {
  const { onEnterViewport, onLeaveViewport } = props;
  const [, forceUpdate] = useState<boolean>();

  const observer = useRef<IntersectionObserver>(undefined);

  const inViewportRef = useRef<boolean>(false);
  const intersected = useRef<boolean>(false);

  const enterCountRef = useRef<number>(0);
  const leaveCountRef = useRef<number>(0);
  // State to track when target is available
  const [isTargetReady, setIsTargetReady] = useState(Boolean(target.current));

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
    const isInViewport = typeof isIntersecting !== 'undefined'
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
  }, [target.current, options, config, onEnterViewport, onLeaveViewport]);

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
