import { useRef, forwardRef } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import type {
  CallbackProps,
  Config,
  InjectedViewportProps,
  Options,
} from './types';
import useInViewport from './useInViewport';

import { noop, defaultOptions, defaultConfig } from './constants';

function handleViewport<
  TElement extends HTMLElement,
  TProps extends InjectedViewportProps<TElement>,
>(
  TargetComponent: React.ComponentType<TProps>,
  options: Options = defaultOptions,
  config: Config = defaultConfig,
) {
  const ForwardedRefComponent = forwardRef<TElement, TProps>((props, ref) => {
    const refProps = {
      forwardedRef: ref,
      // pass both ref/forwardedRef for class component for backward compatibility
    };
    return <TargetComponent {...props} {...refProps} />;
  });

  const InViewport = ({
    onEnterViewport = noop,
    onLeaveViewport = noop,
    ...restProps
  }: Omit<TProps, keyof InjectedViewportProps<TElement>> & CallbackProps) => {
    const node = useRef<TElement>(null);
    const { inViewport, enterCount, leaveCount } = useInViewport(
      node,
      options,
      config,
      {
        onEnterViewport,
        onLeaveViewport,
      },
    );

    const props = {
      ...restProps,
      inViewport,
      enterCount,
      leaveCount,
    } as React.PropsWithoutRef<TProps>;

    return <ForwardedRefComponent {...props} ref={node} />;
  };

  const name = (TargetComponent as React.FC).displayName
    || (TargetComponent as React.FC).name
    || 'Component';
  InViewport.displayName = `handleViewport(${name})`;

  return hoistNonReactStatic(InViewport, ForwardedRefComponent);
}

export default handleViewport;
