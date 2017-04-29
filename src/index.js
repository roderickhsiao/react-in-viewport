if (typeof window !== 'undefined') {
  // Polyfills for intersection-observer
  require('intersection-observer');
}

import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import hoistNonReactStatic from 'hoist-non-react-statics';

function handleViewport(Component, options) {
  class InViewport extends PureComponent {
    constructor(props) {
      super(props);
      this.observer = null;
      this.node = null;
      this.state = {
        inViewport: false
      };
      this.handleIntersection = this.handleIntersection.bind(this);
      this.initIntersectionObserver = this.initIntersectionObserver.bind(this);
    }

    componentDidMount() {
      // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
      this.initIntersectionObserver();
      this.startObserver(this.node, this.observer);
    }

    initIntersectionObserver() {
      if (!this.observer) {
        this.observer = new IntersectionObserver(
          this.handleIntersection,
          options
        );
      }
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
        <Component
          {...this.props}
          inViewport={this.state.inViewport}
          ref={node => {
            this.node = ReactDOM.findDOMNode(node);
          }}
          innerRef={node => {
            if (node && !this.node) {
              // handle stateless
              this.initIntersectionObserver();
              this.startObserver(ReactDOM.findDOMNode(node), this.observer);
            }
          }}
        />
      );
    }
  }
  return hoistNonReactStatic(InViewport, Component);
}

export default handleViewport;
