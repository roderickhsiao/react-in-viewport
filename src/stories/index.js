import React, { Fragment, PureComponent } from 'react';
import { storiesOf, setAddon } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AspectRatio from 'react-aspect-ratio';
import JSXAddon from 'storybook-addon-jsx';

import 'react-aspect-ratio/aspect-ratio.css';
import '../../theme.css';
import handleViewport from '../index';
import { PageTitle, Card, Block, Spacer } from './common/themeComponent';

const DUMMY_IMAGE_SRC = 'https://www.gstatic.com/psa/static/1.gif';

setAddon(JSXAddon);

const ViewportBlock = handleViewport(Block, {}, { disconnectOnLeave: false });

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
    const { src, ratio } = this.props;
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
        <Component {...props} />
      </AspectRatio>
    );
  }
}

const LazyIframe = handleViewport(Iframe, {}, { disconnectOnLeave: true });
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.inViewport && !this.state.loaded) {
      this.loadImage(nextProps.src);
    }
  }

  loadImage = src => {
    const img = new Image(); // eslint-disable-line
    img.onload = () => {
      action('Image loaded')(src);
      this.setState({
        src,
        loaded: true
      });
    };
    img.src = src;
    img.alt = 'demo';
    action('Load image')(src);
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
        ref={this.props.innerRef}
      >
        <img src={this.state.src} alt="demo" />
      </AspectRatio>
    );
  }
}

const LazyImage = handleViewport(ImageObject, { threshold: 0.25 }, { disconnectOnLeave: true });

class MySectionBlock extends PureComponent {
  getStyle() {
    const { inViewport, enterCount } = this.props;
    const basicStyle = {
      width: '400px',
      height: '300px',
      backgroundColor: '#217ac0',
      color: '#fff'
    };
    // Fade in only the first time we enter the viewport
    if (inViewport && enterCount === 1) {
      return { ...basicStyle, WebkitTransition: 'opacity 1s ease-in-out' };
    }
    if (!inViewport && enterCount < 1) {
      return { ...basicStyle, WebkitTransition: 'none', opacity: '0' };
    }
    return basicStyle;
  }

  render() {
    const { enterCount, leaveCount } = this.props;
    return (
      <section>
        <div className="card" style={this.getStyle()}>
          <div className="card__conent">
            <h3>Hello</h3>
            <p>{`Enter viewport: ${enterCount} times`}</p>
            <p>{`Leave viewport: ${leaveCount} times`}</p>
          </div>
        </div>
      </section>
    );
  }
}

const SectionWithTransition = handleViewport(MySectionBlock, { rootMargin: '-1.0px' });

storiesOf('Viewport detection', module)
  .addWithJSX('Callback when in viewport', () => (
    <Fragment>
      <PageTitle />
      <Spacer />
      <ViewportBlock
        className="card"
        onEnterViewport={() => console.log('enter')}
        onLeaveViewport={() => console.log('leave')}
      />
    </Fragment>
  ))
  .addWithJSX('Lazyload Image', () => {
    const imageArray = [
      {
        src: 'https://i0.wp.com/peopledotcom.files.wordpress.com/2016/08/gettyimages-175928870.jpg',
        ratio: '595/397'
      },
      {
        src:
          'https://s-media-cache-ak0.pinimg.com/originals/cf/31/83/cf31837a53dc1cdb13880ac38c66d70d.jpg',
        ratio: '508/397'
      },
      {
        src:
          'http://cdn1-www.dogtime.com/assets/uploads/gallery/english-bulldog-puppies/english-bulldog-9.jpg',
        ratio: '1'
      },
      {
        src:
          'https://i2-prod.mirror.co.uk/incoming/article4482806.ece/ALTERNATES/s615/PAY-Stolen-Lilac-Puppy.jpg',
        ratio: '615/409'
      }
    ];
    return (
      <Fragment>
        <PageTitle />
        <Spacer />
        <Card
          titleText="Lazyload Image"
          contentNode={imageArray.map(image => (
            <LazyImage key={image.src} src={image.src} ratio={image.ratio} />
          ))}
        />
      </Fragment>
    );
  })
  .addWithJSX('Lazyload Iframe', () => {
    const iframeArray = [
      {
        src: 'https://www.youtube.com/embed/hTcBnxxuAls',
        ratio: '560/315'
      },
      {
        src: 'https://www.youtube.com/embed/M8AlxrwhY30',
        ratio: '560/315'
      },
      {
        src: 'https://www.youtube.com/embed/q31tGyBJhRY',
        ratio: '560/315'
      }
    ];
    return (
      <Fragment>
        <PageTitle />
        <Spacer />
        <Card
          titleText="Lazyload Iframe"
          contentNode={iframeArray.map(iframe => (
            <LazyIframe key={iframe.src} src={iframe.src} ratio={iframe.ratio} />
          ))}
        />
      </Fragment>
    );
  })
  .addWithJSX('Use enter/leave counts for transition', () => (
    <Fragment>
      <PageTitle />
      <Spacer />
      <SectionWithTransition />
    </Fragment>
  ));
