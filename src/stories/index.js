import React, { Component } from 'react';
import { storiesOf, action } from '@kadira/storybook';
import handleViewport from '../index';
import AspectRatio from 'react-aspect-ratio';
import 'react-aspect-ratio/aspect-ratio.css';

const DUMMY_IMAGE_SRC = 'https://www.gstatic.com/psa/static/1.gif';

const Block = (props) => {
  const { inViewport, innerRef } = props;
  const color = inViewport ? '#217ac0' : '#ff9800';
  const text = inViewport ? 'In viewport' : 'Not in viewport';
  return (
    <div className="viewport-block" ref={innerRef}>
      <h3>{ text }</h3>
      <div style={{ width: '400px', height: '300px', background: color }} />
    </div>
  );
};
const ViewportBlock = handleViewport(Block);

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: DUMMY_IMAGE_SRC,
    };
  }

  componentDidMount() {
    if (this.props.inViewport) {
      this.setState({
        src: this.props.src,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.inViewport) {
      // prefetch image
      const image = new Image();
      image.src = nextProps.src;

      this.setState({
        src: nextProps.src,
      });
    }
  }

  render() {
    return (
      <AspectRatio ratio={this.props.ratio} style={{ maxWidth: '400px', marginBottom: '20px' }} ref={this.props.innerRef}>
        <img src={this.state.src} />
      </AspectRatio>
    );
  }
}

const LazyImage = handleViewport(Image);
storiesOf('Viewport detection', module)
  .add('Callback when in viewport', () => (
    <div>
      <div style={{ height: '100vh' }}>
        <h2>Scroll down to make component in viewport</h2>
      </div>
      <ViewportBlock />
    </div>
  ))
  .add('Lazyload Image', () => {
    const imageArray = [
      {
        src: 'https://i0.wp.com/peopledotcom.files.wordpress.com/2016/08/gettyimages-175928870.jpg',
        ratio: '595/397',
      },
      {
        src: 'https://s-media-cache-ak0.pinimg.com/originals/cf/31/83/cf31837a53dc1cdb13880ac38c66d70d.jpg',
        ratio: '508/397',
      },
      {
        src: 'http://cdn1-www.dogtime.com/assets/uploads/gallery/english-bulldog-puppies/english-bulldog-9.jpg',
        ratio: '1',
      },
    ];
    return (
      <div>
        <h2>Lazyload Image</h2>
        {
          imageArray.map(image => <LazyImage key={image.src} src={image.src} ratio={image.ratio} />)
        }
      </div>
    );
  });
