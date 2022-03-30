import React, { PureComponent } from 'react';
import { mount } from 'enzyme';

import { handleViewport } from '../index';

class DemoClass extends PureComponent<{
  inViewport: boolean;
}> {
  render() {
    const { inViewport } = this.props;
    return (
      <div
        style={{
          width: '400px',
          height: '300px',
        }}
      >
        <span className="content">
          {inViewport ? 'in viewport' : 'not in viewport'}
        </span>
      </div>
    );
  }
}

describe('In Viewport', () => {
  it('basic render', () => {
    const TestNode = handleViewport(DemoClass);
    const tree = mount(<TestNode />);
    expect(tree.find('.content').text()).toEqual('not in viewport');
  });

  // it.skip('scroll render', () => {
  //   // until jsdom support observer
  //   jest.useFakeTimers();
  //   const TestNode = handleViewport(DemoClass);
  //   const tree = mount(<TestNode />);
  //   global.document.scrollTop = 200;
  //   jest.runOnlyPendingTimers();
  //   tree.update();
  //   expect(tree.find('.content').text()).toEqual('in viewport');
  // });
});
