import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import handleViewport from '../../index';
import { Block } from '../common/themeComponent';

const ViewportBlock = handleViewport(Block, {}, { disconnectOnLeave: false });

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
            sectionFn: () => <div>Work in progress</div>
          }
        ]
      }
    ]
  });
