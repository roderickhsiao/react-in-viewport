// React hooks
import { useEffect, useRef, useState } from 'react';
import { findDOMNode } from 'react-dom';

const useInViewport = (target, options, config = { disconnectOnLeave: false }, props) => {
  const { onEnterViewport, onLeaveViewport } = props;

  const [inViewport, setInViewport] = useState(false);
  const [enterCount, setEnterCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const observer = useRef();
  const intersected = useRef(false);

  function startObserver() {
    if (target.current && observer.current) {
      observer.current.observe(findDOMNode(target.current));
    }
  }

  function stopObserver() {
    if (target.current && observer.current) {
      observer.current.unobserve(findDOMNode(target.current));
      observer.current.disconnect();
      observer.current = null;
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
      setInViewport(isInViewport);
      setEnterCount(enterCount + 1);
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
      setInViewport(isInViewport);
      setLeaveCount(leaveCount + 1);
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

  useEffect(() => {
    // reset observer on update, to fix race condition that when observer init,
    // the element is not in viewport, such as in animation
    if (!intersected.current && !inViewport) {
      if (observer.current && target.current) {
        observer.current.unobserve(findDOMNode(target.current));
        observer.current.observe(findDOMNode(target.current));
      }
    }
  });

  return {
    inViewport,
    enterCount,
    leaveCount
  };
};

export default useInViewport;
