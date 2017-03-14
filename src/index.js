if (typeof window !== 'undefined') {
  require('intersection-observer');
}

import React, { PureComponent, PropTypes, cloneElement } from 'react';

class InViewport extends PureComponent {
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
    this.observer = new IntersectionObserver(this.handleIntersection, this.props.options);
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
    const {
      options,
      ...others
    } = this.props;

    return (
      <span {...others} ref={node => { this.node = node; }}>
        { cloneElement(this.props.children, { inViewport: this.state.inViewport }) }
      </span>
    );
  }
}

InViewport.defaultProps = {
  options: {}
};

InViewport.propTypes = {
  children: PropTypes.node,
  options: PropTypes.shape({
    root: PropTypes.node,
    rootMargin: PropTypes.string,
    threshold: PropTypes.oneOfType([PropTypes.number, PropTypes.array])
  })
}

export default InViewport;
