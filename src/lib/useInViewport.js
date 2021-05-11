/* USAGE getNode function:

const Parent =  (props) => {
  //stuff
  return (
    <Child
      onEnterViewport={() => console.log("enter")}
      onLeaveViewport={() => console.log("leave")}
    />
  )
};

const Child = ({onEnterViewport, onLeaveViewport, ...props}) => {
  const options = {//stuff};
  const {inViewport, enterCount, leaveCount, getNode} = useInViewport(
    undefined, options, { disconnectOnLeave: true }, {onEnterViewport, onLeaveViewport}
  );
  useEffect(() => {
    console.log("currently in viewport: " + inViewport);
    console.log("times entered: " + enterCount);
    console.log("times left: " + leaveCount);
  }, [inViewport, enterCount, leaveCount])

  return (
    <div ref={getNode} />
  )
};

*/
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { findDOMNode } from 'react-dom';

const useInViewport = (target, options, config = { disconnectOnLeave: false }, props) => {
  const [node, setNode] = useState(null);

  // When target is provided, set node by finding DOM node.
  useMemo(() => {
    if (target && target.current) {
      setNode(findDOMNode(target.current));
    }
  }, [target.current]);

  // When target isn't provided, allow node setting by 'getNode'
  const getNode = useCallback(myNode => {
    if (!target && (myNode !== null)) {
      setNode(myNode);
    }
  }, []);

  const { onEnterViewport, onLeaveViewport } = props;
  const [, forceUpdate] = useState();

  const observer = useRef();

  const inViewportRef = useRef(false);
  const intersected = useRef(false);

  const enterCountRef = useRef(0);
  const leaveCountRef = useRef(0);

  function startObserver() {
    if (node && observer.current) {
      observer.current.observe(node);
    }
  }

  function stopObserver() {
    if (node && observer.current) {
      observer.current.unobserve(node);
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
    [node, options, config, onEnterViewport, onLeaveViewport]
  );

  return {
    inViewport: inViewportRef.current,
    enterCount: enterCountRef.current,
    leaveCount: leaveCountRef.current,
    getNode
  };
};

export default useInViewport;
