// React hooks
// eslint-disable-next-line no-unused-vars
import { useEffect, useRef, useState, MutableRefObject } from 'react';
import { findDOMNode } from 'react-dom';

import { defaultOptions, defaultConfig, defaultProps } from './constants';
/**
 *
 * @param {MutableRefObject} target
 * @param {IntersectionObserverInit} [options = defaultOptions]
 * @param {Object} [config = defaultConfig]
 * @param {boolean} [config.disconnectOnLeave = false]
 * @param {Object} [props = defaultProps]
 * @param {VoidFunction} [props.onEnterViewport = noop]
 * @param {VoidFunction} [props.onLeaveViewport = noop]
 * @returns {Object} returnObject
 * @returns {boolean} returnObject.inViewport
 * @returns {number} returnObject.enterCount
 * @returns {number} returnObject.leaveCount
 */

const useInViewport = (
  target,
  options = defaultOptions,
  config = defaultConfig,
  props = defaultProps
) => {
  const { onEnterViewport, onLeaveViewport } = props;
  const [, forceUpdate] = useState();

  const observer = useRef();

  const inViewportRef = useRef(false);
  const intersected = useRef(false);

  const enterCountRef = useRef(0);
  const leaveCountRef = useRef(0);

  function startObserver({
    observerRef
  }) {
    const targetRef = target.current;
    if (targetRef) {
      const node = findDOMNode(targetRef);
      if (node) {
        observerRef?.observe(node);
      }
    }
  }

  function stopObserver({
    observerRef
  }) {
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

  function initIntersectionObserver({
    observerRef
  }) {
    if (!observerRef) {
      // $FlowFixMe
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
      observerRef
    });

    return () => {
      stopObserver({
        observerRef
      });
    };
  }, [
    target.current,
    options,
    config,
    onEnterViewport,
    onLeaveViewport,
  ]);

  return {
    inViewport: inViewportRef.current,
    enterCount: enterCountRef.current,
    leaveCount: leaveCountRef.current
  };
};

export default useInViewport;
