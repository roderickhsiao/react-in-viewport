import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import omit from 'lodash/omit';

import handleViewport, { customProps } from '../../index';
import { Block } from '../common/themeComponent';

const ViewportBlock = handleViewport(Block, {}, { disconnectOnLeave: false });
const CustomAnchor = ({ forwardedRef, inViewport, ...restProps }) => {
  const text = inViewport ? 'Link (in viewport)' : 'Link (not in viewport)';
  return (
    <a
      href="https://github.com/roderickhsiao/react-in-viewport#readme"
      {...omit(restProps, customProps)}
      ref={forwardedRef}
      style={{ padding: '20px 0' }}
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
  });
