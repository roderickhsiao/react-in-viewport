// IMPORTANT
// ---------
// This is an auto generated file with React CDK.
// Do not modify this file.
import React, { Fragment } from 'react';
import { configure, setAddon, addDecorator } from '@storybook/react';
import chaptersAddon, { setDefaults } from 'react-storybook-addon-chapters';
import { PageTitle, Spacer } from '../src/stories/common/themeComponent';

// Set chapter plugin
setDefaults({
  sectionOptions: {
    showSource: false
  }
});

setAddon(chaptersAddon);

addDecorator(story => (
  <Fragment>
    <PageTitle />
    <Spacer />
    <div style={{ padding: '20px' }}>
      {story()}
    </div>
  </Fragment>
));

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
