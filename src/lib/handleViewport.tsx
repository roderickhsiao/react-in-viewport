import React, { useRef, forwardRef } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import type { Config, Props, Options } from './types';
import useInViewport from './useInViewport';

import { noop, defaultOptions, defaultConfig } from './constants';

const isFunctionalComponent = (Component: React.ElementType) => {
  return (
    typeof Component === 'function' &&
    !(Component.prototype && Component.prototype.render)
  );
};

const isReactComponent = (Component: React.ComponentClass) => {
  return Component.prototype && Component.prototype.isReactComponent;
};

type InjectedProps = {
  enterCount: number;
  inViewport: boolean;
  leaveCount: number;
};

type RefProps = React.PropsWithRef<{
  forwardedRef?: React.ForwardedRef<any>;
}>;

type OmittedProps = 'onEnterViewport' | 'onLeaveViewport';
type RestPropsRef = Omit<Props, OmittedProps>;

function handleViewport<Props>(
  TargetComponent: React.ElementType | React.ComponentClass,
  options: Options = defaultOptions,
  config: Config = defaultConfig
) {
  const ForwardedRefComponent = forwardRef<
    any,
    InjectedProps & RefProps & RestPropsRef
  >((props, ref) => {
    const refProps: RefProps = {
      forwardedRef: ref,
      // pass both ref/forwardedRef for class component for backward compatibility
      ...(isReactComponent(TargetComponent as React.ComponentClass) &&
      !isFunctionalComponent(TargetComponent)
        ? {
            ref,
          }
        : {}),
    };
    return (
      <TargetComponent
        {...(props as RestPropsRef)}
        {...(refProps as RefProps)}
      />
    );
  });

  function InViewport<Props>({
    onEnterViewport = noop,
    onLeaveViewport = noop,
    ...restProps
  }) {
    const node = useRef<any>();
    const { inViewport, enterCount, leaveCount } = useInViewport(
      node,
      options,
      config,
      {
        onEnterViewport,
        onLeaveViewport,
      }
    );

    const injectedProps: InjectedProps = {
      inViewport,
      enterCount,
      leaveCount,
    };

    return (
      <ForwardedRefComponent {...restProps} {...injectedProps} ref={node} />
    );
  }

  const name =
    (TargetComponent as React.FC).displayName ||
    (TargetComponent as React.FC).name ||
    'Component';
  InViewport.displayName = `handleViewport(${name})`;

  return hoistNonReactStatic(InViewport, ForwardedRefComponent);
}

export default handleViewport;
