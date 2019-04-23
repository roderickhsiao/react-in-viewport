import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import 'react-aspect-ratio/aspect-ratio.css';
import '../../theme.css';

import { Card, Block } from './common/themeComponent';
import handleViewport from '../index';
import LazyIframe from './common/Iframe';
import LazyImage from './common/Image';
import SectionWithTransition from './common/Section';

if (typeof window !== 'undefined') {
  // Polyfills for intersection-observer
  require('intersection-observer'); // eslint-disable-line
}

const ViewportBlock = handleViewport(Block, {}, { disconnectOnLeave: false });

storiesOf('Viewport detection', module).addWithChapters('handleViewport HOC', {
  subtitle: 'Using handleViewport HOC',
  chapters: [
    {
      title: 'Class based component',
      sections: [
        {
          title: 'onEnterViewport and onLeaveViewport callback',
          sectionFn: () => (
            <ViewportBlock
              className="card"
              onEnterViewport={() => action('enter')}
              onLeaveViewport={() => action('leave')}
            />
          )
        },
        {
          title: 'Lazyload image',
          sectionFn: () => {
            const imageArray = [
              {
                src:
                  'https://i0.wp.com/peopledotcom.files.wordpress.com/2016/08/gettyimages-175928870.jpg',
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
              <Card
                titleText="Lazyload Image"
                contentNode={imageArray.map(image => (
                  <LazyImage key={image.src} src={image.src} ratio={image.ratio} />
                ))}
              />
            );
          }
        },
        {
          title: 'Lazyload Iframe',
          sectionFn: () => {
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
              <Card
                titleText="Lazyload Iframe"
                contentNode={iframeArray.map(iframe => (
                  <LazyIframe key={iframe.src} src={iframe.src} ratio={iframe.ratio} />
                ))}
              />
            );
          }
        },
        {
          title: 'Use enter/leave counts for transition',
          sectionFn: () => <SectionWithTransition />
        }
      ]
    }
  ]
});
