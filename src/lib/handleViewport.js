// HOC for handleViewport
// eslint-disable-next-line no-unused-vars
import React, { useRef, forwardRef, ReactNode, ComponentType } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import useInViewport from './useInViewport';

import { noop, defaultOptions, defaultConfig } from './constants';

const isFunctionalComponent = Component => {
  return typeof Component === 'function' && !(Component.prototype && Component.prototype.render);
};

const isReactComponent = Component => {
  return Component.prototype && Component.prototype.isReactComponent;
};

/**
 * @template P
 * @param {ReactNode} TargetComponent
 * @param {IntersectionObserverInit} [options = defaultOptions]
 * @param {Object} [config = defaultConfig]
 * @param {boolean} [config.disconnectOnLeave = false]
 * @returns {ComponentType<P & {
      onEnterViewport?: VoidFunction
      onLeaveViewport?: VoidFunction
    }>}
 */
function handleViewport(TargetComponent, options = defaultOptions, config = defaultConfig) {
  const ForwardedRefComponent = forwardRef((props, ref) => {
    const refProps = {
      forwardedRef: ref,
      // pass both ref/forwardedRef for class component for backward compatibility
      ...(isReactComponent(TargetComponent) && !isFunctionalComponent(TargetComponent)
        ? {
          ref
        }
        : {})
    };
    return <TargetComponent {...props} {...refProps} />;
  });

  const InViewport = ({ onEnterViewport = noop, onLeaveViewport = noop, ...restProps }) => {
    const node = useRef();
    const { inViewport, enterCount, leaveCount } = useInViewport(node, options, config, {
      onEnterViewport,
      onLeaveViewport
    });

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
