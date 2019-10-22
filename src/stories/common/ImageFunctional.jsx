import React, { memo, useState, useEffect } from 'react';
import AspectRatio from 'react-aspect-ratio';

import { handleViewport } from '../../index';

const DUMMY_IMAGE_SRC = 'https://www.gstatic.com/psa/static/1.gif';

const ImageObject = props => {
  const { src: originalSrc, ratio, forwardedRef, inViewport } = props;
  const [src, setSrc] = useState(DUMMY_IMAGE_SRC);
  const [loaded, setLoaded] = useState(false);

  const loadImage = imageSrc => {
    const img = new Image(); // eslint-disable-line
    img.onload = () => {
      setSrc(imageSrc);
      setLoaded(true);
    };
    img.alt = 'demo';
    img.src = imageSrc;
  };

  useEffect(() => {
    if (inViewport && !loaded) {
      loadImage(originalSrc);
    }
  }, [inViewport, loaded]);

  return (
    <AspectRatio
      ratio={ratio}
      style={{
        maxWidth: '400px',
        marginBottom: '200px',
        backgroundColor: 'rgba(0,0,0,.12)'
      }}
      ref={forwardedRef}
    >
      <img src={src} alt="demo" />
    </AspectRatio>
  );
};

const LazyImage = handleViewport(ImageObject, {}, { disconnectOnLeave: true });
export default LazyImage;
