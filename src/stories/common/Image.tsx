import { PureComponent, RefObject } from 'react';
import { AspectRatio } from 'react-aspect-ratio';

import { INIT, LOADING, LOADED } from './constants';
import { handleViewport } from '../../index';
import type { InjectedViewportProps } from '../../lib/types';

const DUMMY_IMAGE_SRC = 'https://www.gstatic.com/psa/static/1.gif';

type ImageObjectProps = InjectedViewportProps & {
  src: string;
  ratio: string;
};

class ImageObject extends PureComponent<ImageObjectProps, { status: number; src: string }> {
  // eslint-disable-line
  constructor(props) {
    super(props);
    this.state = {
      src: DUMMY_IMAGE_SRC,
      status: INIT,
    };
  }

  componentDidMount() {
    if (this.props.inViewport) {
      this.loadImage(this.props.src);
    }
  }

  componentDidUpdate() {
    if (this.props.inViewport && this.state.status === INIT) {
      this.loadImage(this.props.src);
    }
  }

  loadImage = (src) => {
    const img = new Image(); // eslint-disable-line
    this.setState({
      status: LOADING,
    });
    img.onload = () => {
      this.setState({
        src,
        status: LOADED,
      });
    };
    img.alt = 'demo';
    img.src = src;
  };

  getBackgroundColor = () => {
    const { status } = this.state;
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

  render() {
    return (
      <AspectRatio
        ratio={this.props.ratio}
        style={{
          transitionDuration: '300ms',
          maxWidth: '400px',
          marginBottom: '200px',
          backgroundColor: this.getBackgroundColor(),
        }}
        ref={this.props.forwardedRef as RefObject<HTMLDivElement>}
      >
        <img src={this.state.src} alt="demo" />
      </AspectRatio>
    );
  }
}

const LazyImage = handleViewport(ImageObject, {}, { disconnectOnLeave: true });
export default LazyImage;
