import React, {
  useEffect, useRef, useState,
} from 'react';
import { findDOMNode } from 'react-dom';

import { defaultOptions, defaultConfig, defaultProps } from './constants';

import type { Config, CallbackProps, Options } from './types';

const useInViewport = (
  target: React.RefObject<HTMLElement>,
  options: Options = defaultOptions,
  config : Config = defaultConfig,
  props: CallbackProps = defaultProps,
) => {
  const { onEnterViewport, onLeaveViewport } = props;
  const [, forceUpdate] = useState();

  const observer = useRef<IntersectionObserver>();

  const inViewportRef = useRef<boolean>(false);
  const intersected = useRef<boolean>(false);

  const enterCountRef = useRef<number>(0);
  const leaveCountRef = useRef<number>(0);

  function startObserver({ observerRef }) {
    const targetRef = target.current;
    if (targetRef) {
      const node = findDOMNode(targetRef);
      if (node) {
        observerRef?.observe(node);
      }
    }
  }

  function stopObserver({ observerRef }) {
    const targetRef = target.current;
    if (targetRef) {
      const node = findDOMNode(targetRef);
      if (node) {
        observerRef?.unobserve(node);
      }
    }

    observerRef?.disconnect();
    observer.current = null;
  }

  function handleIntersection(entries) {
    const entry = entries[0] || {};
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
        // disconnect obsever on leave
        observer.current.disconnect();
      }
      leaveCountRef.current += 1;
      inViewportRef.current = isInViewport;
      forceUpdate(isInViewport);
    }
  }

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

  return {
    inViewport: inViewportRef.current,
    enterCount: enterCountRef.current,
    leaveCount: leaveCountRef.current,
  };
};

export default useInViewport;
