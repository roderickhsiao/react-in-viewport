import React, { memo, useEffect, useState } from 'react';
import AspectRatio from 'react-aspect-ratio';

import { handleViewport } from '../../index';

const IframeFunctional = props => {
  const { inViewport, src, ratio, forwardedRef } = props;
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
        frameBorder: 0
      }
    : {};

  return (
    <AspectRatio
      ratio={ratio}
      style={{ marginBottom: '200px', backgroundColor: 'rgba(0,0,0,.12)' }}
      ref={forwardedRef}
    >
      <Component {...componentProps} />
    </AspectRatio>
  );
};

const LazyIframe = handleViewport(memo(IframeFunctional), {}, { disconnectOnLeave: true });
export default LazyIframe;
