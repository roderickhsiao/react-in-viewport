import { useState, useEffect } from 'react';
import { AspectRatio } from 'react-aspect-ratio';

import { handleViewport } from '../../index';
import { INIT, LOADING, LOADED } from './constants';
import type { InjectedViewportProps } from '../../lib/types';

const DUMMY_IMAGE_SRC = 'https://www.gstatic.com/psa/static/1.gif';

type ImageObjectProps = InjectedViewportProps<HTMLDivElement> & {
  src: string;
  ratio: string;
};

const ImageObject = (props: ImageObjectProps) => {
  const {
    src: originalSrc, ratio, forwardedRef, inViewport,
  } = props;
  const [src, setSrc] = useState(DUMMY_IMAGE_SRC);
  const [status, setStatus] = useState(INIT);

  const loadImage = (imageSrc: string) => {
    const img = new Image(); // eslint-disable-line
    setStatus(LOADING);
    img.onload = () => {
      setSrc(imageSrc);
      setStatus(LOADED);
    };
    img.alt = 'demo';
    img.src = imageSrc;
  };

  useEffect(() => {
    if (inViewport && status === INIT) {
      loadImage(originalSrc);
    }
  }, [inViewport, status]);

  const getBackgroundColor = () => {
    switch (status) {
      case LOADING:
        return 'rgba(0,0,0,.32)';
      case LOADED:
        return 'rgba(0,0,0,.50)';
      case INIT:
      default:
        return 'rgba(0,0,0,.12)';
    }
  };

  return (
    <AspectRatio
      ratio={ratio}
      style={{
        transitionDuration: '300ms',
        maxWidth: '400px',
        marginBottom: '200px',
        backgroundColor: getBackgroundColor(),
      }}
      ref={forwardedRef}
    >
      <img src={src} alt="demo" />
    </AspectRatio>
  );
};

const LazyImage = handleViewport(ImageObject, {}, { disconnectOnLeave: true });
export default LazyImage;
