// @flow
import React, { Component, type Element } from 'react';
import { findDOMNode } from 'react-dom';
import hoistNonReactStatic from 'hoist-non-react-statics';

if (typeof window !== 'undefined') {
  // Polyfills for intersection-observer
  require('intersection-observer'); // eslint-disable-line
}

type Props = {
  onEnterViewport: () => void,
  onLeaveViewport: () => void
};

type State = {
  inViewport: boolean,
  enterCount: number,
  leaveCount: number
};

type OptionType = {
  root?: Node,
  rootMargin?: string,
  threshold?: number | Array<number>
};

type ConfigType = {
  disconnectOnLeave: boolean
};

const isStateless = TargetComponent => typeof TargetComponent === 'function' && !(TargetComponent.prototype && TargetComponent.prototype.isReactComponent);

function handleViewport(
  TargetComponent: Element<*>,
  options: OptionType = {},
  config: ConfigType = { disconnectOnLeave: false }
): Element<*> {
  class InViewport extends Component<Props, State> {
    node: ?HTMLElement;
    intersected: boolean;
    handleIntersection: () => void;
    initIntersectionObserver: () => void;
    setInnerRef: () => void;
    setRef: () => void;
    observer: ?IntersectionObserver;

    constructor(props: Props) {
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
      this.setInnerRef = this.setInnerRef.bind(this);
      this.setRef = this.setRef.bind(this);
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
          this.observer.unobserve(this.node); // $FlowFixMe
          this.observer.observe(this.node);
        }
      }
    }

    initIntersectionObserver() {
      if (!this.observer) {
        // $FlowFixMe
        this.observer = new IntersectionObserver(this.handleIntersection, options);
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
      const inViewport = typeof isIntersecting !== 'undefined' ? isIntersecting : intersectionRatio > 0;

      // enter
      if (!this.intersected && inViewport) {
        this.intersected = true;
        onEnterViewport && onEnterViewport();
        this.setState({
          inViewport,
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
          inViewport,
          leaveCount: this.state.leaveCount + 1
        });
      }
    }

    setRef(node) {
      // $FlowFixMe
      this.node = findDOMNode(node);
    }

    setInnerRef(node) {
      if (node && !this.node) {
        // handle stateless
        this.node = node;
      }
    }

    render() {
      const { onEnterViewport, onLeaveViewport, ...otherProps } = this.props;
      // pass ref to class and innerRef for stateless component
      const { inViewport, enterCount, leaveCount } = this.state;
      const refProps = isStateless(TargetComponent)
        ? { innerRef: this.setInnerRef }
        : { ref: this.setRef };
      return (
        // $FlowFixMe
        <TargetComponent
          {...otherProps}
          inViewport={inViewport}
          enterCount={enterCount}
          leaveCount={leaveCount}
          {...refProps}
        />
      );
    }
  }
  return hoistNonReactStatic(InViewport, TargetComponent);
}

export default handleViewport;
