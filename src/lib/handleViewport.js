// HOC for handleViewport
import React, { useRef, forwardRef } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import useInViewport from './useInViewport';

const noop = () => {};

function handleViewport(TargetComponent, options, config = { disconnectOnLeave: false }) {
  const ForwardedRefComponent = forwardRef((props, ref) => {
    return <TargetComponent {...props} forwardedRef={ref} />;
  });

  const InViewport = ({ onEnterViewport = noop, onLeaveViewport = noop, ...restProps }, ref) => {
    const node = useRef();
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
      <ForwardedRefComponent
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

  return hoistNonReactStatic(InViewport, ForwardedRefComponent);
}

export default handleViewport;
