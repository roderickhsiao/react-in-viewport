import React, { PureComponent } from 'react';

import { handleViewport } from '../../index';

class MySectionBlock extends PureComponent {
  getStyle() {
    const { inViewport, enterCount } = this.props;
    const basicStyle = {
      width: '400px',
      height: '300px',
      backgroundColor: '#217ac0',
      color: '#fff'
    };
    // Fade in only the first time we enter the viewport
    if (inViewport && enterCount === 1) {
      return { ...basicStyle, WebkitTransition: 'opacity 1s ease-in-out' };
    }
    if (!inViewport && enterCount < 1) {
      return { ...basicStyle, WebkitTransition: 'none', opacity: '0' };
    }
    return basicStyle;
  }

  render() {
    const { enterCount, leaveCount, forwardedRef } = this.props;
    return (
      <section ref={forwardedRef}>
        <div className="card" style={this.getStyle()}>
          <div className="card__conent">
            <h3>Hello</h3>
            <p>{`Enter viewport: ${enterCount} times`}</p>
            <p>{`Leave viewport: ${leaveCount} times`}</p>
          </div>
        </div>
      </section>
    );
  }
}

const SectionWithTransition = handleViewport(MySectionBlock, { rootMargin: '-1.0px' });
export default SectionWithTransition;
