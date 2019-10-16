// HOC for handleViewport
import React, { useRef, forwardRef } from 'react';
import useInViewport from './useInViewport';

const noop = () => {};

function handleViewport(TargetComponent, options, config = { disconnectOnLeave: false }) {
  const InViewport = ({
    onEnterViewport = noop,
    onLeaveViewport = noop,
    ...restProps
  }, ref) => {
    const node = useRef(ref);
    const { inViewport, enterCount, leaveCount } = useInViewport(
      node,
      options,
      config,
      {
        onEnterViewport,
        onLeaveViewport
      }
    );
    
    return (
      <TargetComponent
        {...restProps}
        inViewport={inViewport}
        enterCount={enterCount}
        leaveCount={leaveCount}
        ref={node}
      />
    );
  };

  const name = TargetComponent.displayName || TargetComponent.name || 'Component';
  InViewport.displayName = `handleViewport(${name})`;
  return forwardRef(InViewport);
}

export default handleViewport;
