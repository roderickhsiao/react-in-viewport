import React, { memo, useEffect, useState } from 'react';
import AspectRatio from 'react-aspect-ratio';

import { handleViewport } from '../../index';
import type { InjectedProps } from '../../lib/types';

type IframeFunctionalProps = InjectedProps<HTMLDivElement> & {
  src: string;
  ratio: string;
};

function IframeFunctional(props: IframeFunctionalProps) {
  const {
    inViewport, src, ratio, forwardedRef,
  } = props;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (inViewport && !loaded) {
      setLoaded(true);
    }
  }, [inViewport, loaded]);

  const Component = loaded ? 'iframe' : 'div';
  const componentProps = loaded
    ? {
      src,
      frameBorder: 0,
    }
    : {};

  return (
    <AspectRatio
      ratio={ratio}
      style={{ marginBottom: '200px', backgroundColor: 'rgba(0,0,0,.12)' }}
      // @ts-expect-error
      // TODO: fix upstream types in react-aspect-ratio to support ref
      ref={forwardedRef}
    >
      <Component {...componentProps} />
    </AspectRatio>
  );
}

const LazyIframe = handleViewport(memo(IframeFunctional), {}, { disconnectOnLeave: true });
export default LazyIframe;
