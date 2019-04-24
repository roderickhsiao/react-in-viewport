import React from 'react';
import { storiesOf } from '@storybook/react';

import SectionWithTransition from '../common/Section';

storiesOf('Transition', module).addWithChapters('Class based component', {
  subtitle: 'Using handleViewport HOC',
  chapters: [
    {
      sections: [
        {
          title: 'Use enter/leave counts for transition',
          sectionFn: () => <SectionWithTransition />
        }
      ]
    }
  ]
});
