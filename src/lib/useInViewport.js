// React hooks
import { useEffect, useRef, useState } from 'react';
import { findDOMNode } from 'react-dom';

const useInViewport = (target, options, config = { disconnectOnLeave: false }, props) => {
  const { onEnterViewport, onLeaveViewport } = props;
  const [, forceUpdate] = useState();

  const observer = useRef();

  const inViewportRef = useRef(false);
  const intersected = useRef(false);

  const enterCountRef = useRef(0);
  const leaveCountRef = useRef(0);

  function startObserver() {
    if (target.current && observer.current) {
      const node = findDOMNode(target.current);
      if (node) {
        observer.current.observe(node);
      }
    }
  }

  function stopObserver() {
    if (target.current && observer.current) {
      const node = findDOMNode(target.current);
      if (node) {
        observer.current.unobserve(node);
        observer.current.disconnect();
        observer.current = null;
      }
    }
  }

  function handleIntersection(entries) {
    const entry = entries[0] || {};
    const { isIntersecting, intersectionRatio } = entry;
    const isInViewport = typeof isIntersecting !== 'undefined' ? isIntersecting : intersectionRatio > 0;

    // enter
    if (!intersected.current && isInViewport) {
      intersected.current = true;
      onEnterViewport && onEnterViewport();
      enterCountRef.current += 1;
      inViewportRef.current = isInViewport;
      forceUpdate(isInViewport);
      return;
    }

    // leave
    if (intersected.current && !isInViewport) {
      intersected.current = false;
      onLeaveViewport && onLeaveViewport();
      if (config.disconnectOnLeave && observer.current) {
        // disconnect obsever on leave
        observer.current.disconnect();
      }
      leaveCountRef.current += 1;
      inViewportRef.current = isInViewport;
      forceUpdate(isInViewport);
    }
  }

  function initIntersectionObserver() {
    if (!observer.current) {
      // $FlowFixMe
      observer.current = new IntersectionObserver(handleIntersection, options);
    }
  }

  useEffect(
    () => {
      // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
      initIntersectionObserver();
      startObserver();

      return () => {
        stopObserver();
      };
    },
    [target, options, config, onEnterViewport, onLeaveViewport]
  );

  return {
    inViewport: inViewportRef.current,
    enterCount: enterCountRef.current,
    leaveCount: leaveCountRef.current
  };
};

export default useInViewport;
