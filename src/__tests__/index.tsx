import React, { PureComponent } from 'react';
import { render } from '@testing-library/react';
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
        <span className="content" data-testid="content">
          {inViewport ? 'in viewport' : 'not in viewport'}
        </span>
      </div>
    );
  }
}

describe('In Viewport', () => {
  it('basic render', () => {
    const TestNode = handleViewport(DemoClass);
    const { getByTestId } = render(<TestNode />);
    expect(getByTestId('content').innerHTML).toEqual('not in viewport');
  });
});
