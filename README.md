# React In Viewport Component

[![npm version](https://badge.fury.io/js/react-aspect-ratio.svg)](http://badge.fury.io/js/react-in-viewport)

Wrapper component to detect if the component is in viewport.
Use [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

Dependencies: [Intersection Observer Polyfills](https://www.npmjs.com/package/intersection-observer)

## Usages

Wrap your component with handleViewport HOC, you will receive `inViewport` props indicating the component is in viewport or not.

`handleViewport` HOC accepts three params

1.  Component
1.  Options: second param is the option you want to pass to [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).
1.  Config object:

- `disconnectOnLeave { Boolean }` disconnect intersection observer after leave

The HOC preserve `onEnterViewport` and `onLeaveViewport` props as a callback

_NOTE_: Stateless: Need to add `ref={this.props.innerRef}` on your component

```javascript
import handleViewport from 'react-in-viewport';

const Block = (props: { inViewport: boolean }) => {
  const { inViewport, innerRef } = props;
  const color = inViewport ? '#217ac0' : '#ff9800';
  const text = inViewport ? 'In viewport' : 'Not in viewport';
  return (
    <div className="viewport-block" ref={innerRef}>
      <h3>{ text }</h3>
      <div style={{ width: '400px', height: '300px', background: color }} />
    </div>
  );
};

const ViewportBlock = handleViewport(Block, /** options: {}, config: {} **/);

const Component = (props) => (
  <div>
    <div style={{ height: '100vh' }}>
      <h2>Scroll down to make component in viewport</h2>
    </div>
    <ViewportBlock onEnterViewport={() => console.log('enter')} onLeaveViewport={() => console.log('leave')} />
  </div>
))
```

---

- If you need to know how many times the component has entered the viewport use the prop `enterCount`.
- If you need to know how many times the component has left the viewport use the prop `leaveCount`.

```javascript
import React, { Component } from 'react';
import handleViewport from 'react-in-viewport';

class MySectionBlock extends Component {
  getStyle() {
    const { inViewport, enterCount } = this.props;
    //Fade in only the first time we enter the viewport
    if (inViewport && enterCount === 1) {
      return { WebkitTransition: 'opacity 0.75s ease-in-out' };
    } else if (!inViewport && enterCount < 1) {
      return { WebkitTransition: 'none', opacity: '0' };
    } else {
      return {};
    }
  }

  render() {
    const { enterCount, leaveCount } = this.props;
    return (
      <section>
        <div className="content" style={this.getStyle()}>
          <h1>Hello</h1>
          <p>
            {`Enter viewport: ${enterCount} times`}
          </p>
          <p>
            {`Leave viewport: ${leaveCount} times`}
          </p>
        </div>
      </section>
    );
  }
}
const MySection = handleViewport(MySectionBlock, { rootMargin: '-1.0px' });

export default MySection;
```

## Who is using this component

- [Tinder](https://tinder.com)
