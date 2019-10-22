import React, { PureComponent } from 'react';
import AspectRatio from 'react-aspect-ratio';

import { handleViewport } from '../../index';

const DUMMY_IMAGE_SRC = 'https://www.gstatic.com/psa/static/1.gif';

class ImageObject extends PureComponent {
  // eslint-disable-line
  constructor(props) {
    super(props);
    this.state = {
      src: DUMMY_IMAGE_SRC,
      loaded: false
    };
  }

  componentDidMount() {
    if (this.props.inViewport) {
      this.loadImage(this.props.src);
    }
  }

  componentDidUpdate() {
    if (this.props.inViewport && !this.state.loaded) {
      this.loadImage(this.props.src);
    }
  }

  loadImage = src => {
    const img = new Image(); // eslint-disable-line
    img.onload = () => {
      this.setState({
        src,
        loaded: true
      });
    };
    img.src = src;
    img.alt = 'demo';
  };

  render() {
    return (
      <AspectRatio
        ratio={this.props.ratio}
        style={{
          maxWidth: '400px',
          marginBottom: '200px',
          backgroundColor: 'rgba(0,0,0,.12)'
        }}
      >
        <img src={this.state.src} alt="demo" />
      </AspectRatio>
    );
  }
}

const LazyImage = handleViewport(ImageObject, {}, { disconnectOnLeave: true });
export default LazyImage;
