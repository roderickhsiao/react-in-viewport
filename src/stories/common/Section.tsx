import { PureComponent } from 'react';

import { handleViewport } from '../../index';
import type { InjectedViewportProps } from '../../lib/types';

class MySectionBlock extends PureComponent<InjectedViewportProps> {
  getStyle() {
    const { inViewport, enterCount } = this.props;
    const basicStyle = {
      width: '400px',
      height: '300px',
      backgroundColor: '#217ac0',
      color: '#fff',
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
    const { enterCount, leaveCount } = this.props;

    return (
      <section>
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

const SectionWithTransition = handleViewport(MySectionBlock, {
  rootMargin: '-1.0px',
});
export default SectionWithTransition;
