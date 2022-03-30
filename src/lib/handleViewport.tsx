import { useRef, forwardRef } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import type { Config, Props, Options } from './types';
import useInViewport from './useInViewport';

import { noop, defaultOptions, defaultConfig } from './constants';

const isFunctionalComponent = (Component) => {
  return (
    typeof Component === 'function'
    && !(Component.prototype && Component.prototype.render)
  );
};

const isReactComponent = (Component) => {
  return Component.prototype && Component.prototype.isReactComponent;
};

function handleViewport(
  TargetComponent: React.ElementType,
  options: Options = defaultOptions,
  config: Config = defaultConfig,
) {
  const ForwardedRefComponent = forwardRef<
  React.Ref<any>,
  {
    inViewport: boolean;
    enterCount: number;
    leaveCount: number;
  }
  >((props, ref) => {
    const refProps = {
      forwardedRef: ref,
      // pass both ref/forwardedRef for class component for backward compatibility
      ...(isReactComponent(TargetComponent)
      && !isFunctionalComponent(TargetComponent)
        ? {
          ref,
        }
        : {}),
    };
    return <TargetComponent {...props} {...refProps} />;
  });

  function InViewport({
    onEnterViewport = noop,
    onLeaveViewport = noop,
    ...restProps
  }: Props) {
    const node = useRef();
    const { inViewport, enterCount, leaveCount } = useInViewport(
      node,
      options,
      config,
      {
        onEnterViewport,
        onLeaveViewport,
      },
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
  }

  const name = (TargetComponent as React.FC).displayName
    || (TargetComponent as React.FC).name
    || 'Component';
  InViewport.displayName = `handleViewport(${name})`;

  return hoistNonReactStatic(InViewport, ForwardedRefComponent);
}

export default handleViewport;
