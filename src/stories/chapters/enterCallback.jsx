import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import omit from 'lodash/omit';
import { BrowserRouter as Router } from 'react-router-dom';

import { handleViewport, customProps } from '../../index';
import { Block } from '../common/themeComponent';
import RefBlock from '../common/ref';

const ViewportBlock = handleViewport(Block, {}, { disconnectOnLeave: false });
const ViewportBlockThreshold = handleViewport(
  Block,
  { threshold: [0, 1.0] },
  { disconnectOnLeave: false }
);

const CustomAnchor = ({ forwardedRef, inViewport, ...restProps }) => {
  const text = inViewport ? 'Link (in viewport)' : 'Link (not in viewport)';
  return (
    <a
      href="https://github.com/roderickhsiao/react-in-viewport#readme"
      {...omit(restProps, customProps)}
      ref={forwardedRef}
      style={{
        padding: '20px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '400px',
        height: '300px',
        backgroundColor: inViewport ? '#217ac0' : '#ff9800',
        color: '#fff'
      }}
    >
      {text}
    </a>
  );
};
const ViewportAnchor = handleViewport(CustomAnchor, {}, { disconnectOnLeave: false });

storiesOf('Enter and Leave callback', module)
  .addWithChapters('Class based component', {
    subtitle: 'Using handleViewport HOC',
    chapters: [
      {
        sections: [
          {
            title: 'onEnterViewport and onLeaveViewport callback',
            sectionFn: () => (
              <ViewportBlock
                className="card"
                onEnterViewport={() => action('callback')('onEnterViewport')}
                onLeaveViewport={() => action('callback')('onLeaveViewport')}
              />
            )
          }
        ]
      }
    ]
  })
  .addWithChapters('Functional component', {
    subtitle: 'Using handleViewport HOC',
    chapters: [
      {
        sections: [
          {
            title: 'onEnterViewport and onLeaveViewport callback',
            sectionFn: () => (
              <ViewportAnchor
                onEnterViewport={() => action('callback')('onEnterViewport')}
                onLeaveViewport={() => action('callback')('onLeaveViewport')}
              />
            )
          }
        ]
      }
    ]
  })
  .addWithChapters('Ref component', {
    subtitle: 'Multiple layer HOC',
    chapters: [
      {
        sections: [
          {
            title: 'onEnterViewport and onLeaveViewport callback',
            sectionFn: () => (
              <Router>
                <RefBlock
                  onEnterViewport={() => action('callback')('onEnterViewport')}
                  onLeaveViewport={() => action('callback')('onLeaveViewport')}
                />
              </Router>
            )
          }
        ]
      }
    ]
  })
  .addWithChapters('Threshold', {
    subtitle: 'Set different threshold',
    chapters: [
      {
        sections: [
          {
            title: 'onEnterViewport and onLeaveViewport callback',
            subtitle: 'threshold 1.0',
            sectionFn: () => (
              <ViewportBlockThreshold
                onEnterViewport={() => action('callbackWithThreshold')('onEnterViewport')}
                onLeaveViewport={() => action('callbackWithThreshold')('onLeaveViewport')}
              />
            )
          }
        ]
      }
    ]
  });
