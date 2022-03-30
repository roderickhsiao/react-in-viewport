import React, { Fragment } from 'react';
import SectionWithTransition from '../common/Section';
import { PageTitle, Spacer } from '../common/themeComponent';

export default {
  title: 'Transition',
  decorators: [
    (Story: React.ElementType) => (
      <Fragment>
        <PageTitle />
        <Spacer />
        <div style={{ padding: '20px', maxWidth: '400px' }}>
          <Story />
        </div>
      </Fragment>
    ),
  ],
};

export const ClassComponentTransition = () => <SectionWithTransition />;
