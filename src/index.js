if (typeof window !== 'undefined') {
  // Polyfills for intersection-observer
  require('intersection-observer');
}

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import hoistNonReactStatic from 'hoist-non-react-statics';

const isStateless = (TargetComponent) => (
  typeof TargetComponent === 'function'
  && !(TargetComponent.prototype && TargetComponent.prototype.isReactComponent)
)

function handleViewport(
  TargetComponent,
  options,
  config = { disconnectOnLeave: false }
) {
  class InViewport extends Component {
    constructor(props) {
      super(props);
      this.observer = null;
      this.node = null;
      this.state = {
        inViewport: false,
        enterCount: 0,
        leaveCount: 0
      };
      this.intersected = false;
      this.handleIntersection = this.handleIntersection.bind(this);
      this.initIntersectionObserver = this.initIntersectionObserver.bind(this);
      this.setRef = this.setRef.bind(this);
      this.setInnerRef = this.setInnerRef.bind(this);
    }

    componentDidMount() {
      // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
      this.initIntersectionObserver();
      this.startObserver(this.node, this.observer);
    }

    componentDidUpdate(prevProps, prevState) {
      // reset observer on update, to fix race condition that when observer init,
      // the element is not in viewport, such as in animation
      if (!this.intersected && !prevState.inViewport) {
        if (this.observer && this.node) {
          this.observer.unobserve(this.node);
          this.observer.observe(this.node);
        }
      }
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
        this.observer = null;
      }
    }

    handleIntersection(entries) {
      const { onEnterViewport, onLeaveViewport } = this.props;
      const entry = entries[0] || {};
      const { isIntersecting, intersectionRatio } = entry;
      const inViewport = (typeof isIntersecting !== 'undefined') ? isIntersecting : (intersectionRatio > 0);

      // enter
      if (!this.intersected && inViewport) {
        this.intersected = true;
        onEnterViewport && onEnterViewport();
        this.setState({
          inViewport: inViewport,
          enterCount: this.state.enterCount + 1
        });
        return;
      }

      // leave
      if (this.intersected && !inViewport) {
        this.intersected = false;
        onLeaveViewport && onLeaveViewport();
        if (config.disconnectOnLeave) {
          // disconnect obsever on leave
          this.observer && this.observer.disconnect();
        }
        this.setState({
          inViewport: inViewport,
          leaveCount: this.state.leaveCount + 1
        });
      }
    }

    setRef(node) {
      this.node = ReactDOM.findDOMNode(node);
    }

    setInnerRef(node) {
      if (node && !this.node) {
        // handle stateless
        this.node = ReactDOM.findDOMNode(node);
        this.initIntersectionObserver();
        this.startObserver(this.node, this.observer);
      }
    }

    render() {
      const { onEnterViewport, onLeaveViewport, ...others } = this.props;
      // pass ref to class and innerRef for stateless component

      const refProps = isStateless(TargetComponent)
        ? { innerRef: this.setInnerRef }
        : { ref: this.setRef };
      return (
        <TargetComponent
          {...others}
          inViewport={this.state.inViewport}
          enterCount={this.state.enterCount}
          leaveCount={this.state.leaveCount}
          {...refProps}
        />
      );
    }
  }
  return hoistNonReactStatic(InViewport, TargetComponent);
}

export default handleViewport;
