if (typeof window !== 'undefined') {
  require('intersection-observer');
}

import React, { PureComponent, PropTypes } from 'react';

function handleViewport(Component, options) {
  return class extends PureComponent {
    constructor(props) {
      super(props);
      this.observer = null;
      this.node = null;
      this.state = {
        inViewport: false
      };
      this.handleIntersection = this.handleIntersection.bind(this);
    }

    componentDidMount() {
      // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
      this.observer = new IntersectionObserver(this.handleIntersection, options);
      this.startObserver(this.node, this.observer);
    }

    componentWillUnmount() {
      this.stopObserver(this.node, this.observer);
    }

    startObserver(node, observer) {
      if (node && observer) {
        observer.observe(node);
      }
    }

    stopObserver(node, observer) {
      if (node && observer) {
        observer.unobserve(node);
        observer.disconnect();
        observer = null;
      }
    }

    handleIntersection(entries) {
      const entry = entries[0] || {};
      const { intersectionRatio } = entry;
      if (intersectionRatio <= 0) {
        return;
      }
      this.setState({
        inViewport: true
      });
    }

    render() {
      return (
        <span ref={node => { this.node = node; }}>
          <Component {...this.props} inViewport={this.state.inViewport} />
        </span>
      );
    }
  }
}

export default handleViewport;
