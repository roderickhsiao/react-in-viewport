import React, { PureComponent } from 'react';
import AspectRatio from 'react-aspect-ratio';

import { handleViewport } from '../../index';
import type { InjectedProps } from '../../lib/types';

type IframeProps = InjectedProps & {
  src: string;
  ratio: string;
};

class Iframe extends PureComponent<
IframeProps,
{ loaded: boolean }
> {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.inViewport && !state.loaded) {
      return {
        loaded: true,
      };
    }
    return null;
  }

  render() {
    const { src, ratio } = this.props;
    const Component = this.state.loaded ? 'iframe' : 'div';
    const props = this.state.loaded
      ? {
        src,
        frameBorder: 0,
      }
      : {};

    return (
      <AspectRatio
        ratio={ratio}
        style={{ marginBottom: '200px', backgroundColor: 'rgba(0,0,0,.12)' }}
      >
        <Component {...props} />
      </AspectRatio>
    );
  }
}

const LazyIframe = handleViewport(Iframe, {}, { disconnectOnLeave: true });
export default LazyIframe;
