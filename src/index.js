import React, { useState, useEffect, useRef, forwardRef } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { findDOMNode } from 'react-dom';

function handleViewport(TargetComponent, options, config = { disconnectOnLeave: false }) {
  const ForwardedRefComponent: AbstractComponent<*> = forwardRef((props, ref) => (
    <TargetComponent {...props} forwardedRef={ref} />
  ));

  const InViewport = (props: Props) => {
    const { onEnterViewport, onLeaveViewport, ...otherProps } = props;

    const [inViewport, setInViewport] = useState(false);
    const [enterCount, setEnterCount] = useState(0);
    const [leaveCount, setLeaveCount] = useState(0);
    const observer = useRef();
    const intersected = useRef(false);
    const node = useRef();

    function startObserver() {
      if (node.current && observer.current) {
        observer.current.observe(findDOMNode(node.current));
      }
    }

    function stopObserver() {
      if (node.current && observer.current) {
        observer.current.unobserve(findDOMNode(node.current));
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
        if (config.disconnectOnLeave) {
          // disconnect obsever on leave
          observer && observer.current.disconnect();
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
      [ForwardedRefComponent]
    );

    useEffect(() => {
      // reset observer on update, to fix race condition that when observer init,
      // the element is not in viewport, such as in animation
      if (!intersected.current && !inViewport) {
        if (observer.current && node.current) {
          observer.current.unobserve(findDOMNode(node.current));
          observer.current.observe(findDOMNode(node.current));
        }
      }
    });

    return (
      <ForwardedRefComponent
        {...otherProps}
        inViewport={inViewport}
        enterCount={enterCount}
        leaveCount={leaveCount}
        ref={node}
      />
    );
  };

  return hoistNonReactStatic(InViewport, ForwardedRefComponent);
}

export default handleViewport;
