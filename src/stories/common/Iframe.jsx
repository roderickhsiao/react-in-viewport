import React, { PureComponent } from 'react';
import AspectRatio from 'react-aspect-ratio';

import { handleViewport } from '../../index';

class Iframe extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.inViewport && !this.loaded) {
      this.setState({
        loaded: true
      });
    }
  }

  render() {
    const { src, ratio, forwardedRef } = this.props;
    const Component = this.state.loaded ? 'iframe' : 'div';
    const props = this.state.loaded
      ? {
        src,
        frameBorder: 0
      }
      : {};

    return (
      <AspectRatio
        ratio={ratio}
        style={{ marginBottom: '200px', backgroundColor: 'rgba(0,0,0,.12)' }}
      >
        <Component {...props} ref={forwardedRef} />
      </AspectRatio>
    );
  }
}

const LazyIframe = handleViewport(Iframe, {}, { disconnectOnLeave: true });
export default LazyIframe;
