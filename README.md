<p align="center">
  <h1>React In Viewport</h1>
  <a href="https://www.npmjs.org/package/react-in-viewport"><img src="https://img.shields.io/npm/v/react-in-viewport.svg?style=flat" alt="npm"></a>
  <a href="https://unpkg.com/react-in-viewport"><img src="https://img.badgesize.io/https://unpkg.com/react-in-viewport/dist/es/index.js?compression=gzip" alt="gzip size"></a>
  <a href="https://www.npmjs.com/package/react-in-viewport"><img src="https://img.shields.io/npm/dt/react-in-viewport.svg" alt="downloads" ></a>
  <a href="https://circleci.com/gh/roderickhsiao/react-in-viewport"><img src="https://circleci.com/gh/roderickhsiao/react-in-viewport.svg?style=svg" alt="Greenkeeper badge"></a>
  <a href="https://greenkeeper.io/"><img src="https://badges.greenkeeper.io/roderickhsiao/react-in-viewport.svg" alt="circleci"></a>

</p>

<hr>

Library to detect if the component is in viewport using [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

[Demo](https://roderickhsiao.github.io/react-in-viewport/)

## Why

A common use case is to load image when component is in viewport ([lazy load](https://medium.com/@roderickhsiao/performance-101-i-know-how-to-load-images-a262d556250f)).

Traditionally we will need to keep monitoring scroll position and calculating viewport size which could be a big scroll performance bottleneck.

Modern browser now provides a new API [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) which can make the implementation much easier and performant.


## Polyfill

For browser not supporting the API, you will load a [polyfill](https://www.npmjs.com/package/intersection-observer).
[Browser support table](https://caniuse.com/#feat=intersectionobserver)

```js
require('intersection-observer');
```

## Design

The core logic written in React Hook. We provides two interface, you could use `handleViewport` which is a higher order component (if your component is a class based component) or directly use hooks (functional component).

The higher order component (HOC) as a wrapper and attach intersection observer to your target component. The HOC will then pass down extra props indicating viewport information along with executing callback function when component entering and leaving viewport.

## Usages

Wrap your component with handleViewport HOC, you will receive `inViewport` props indicating the component is in viewport or not.

`handleViewport` HOC accepts three params

`handleViewport(Component, Options, Config)`

| Params    | Type          | Description                                                                                                                        |
|-----------|---------------|------------------------------------------------------------------------------------------------------------------------------------|
| Component | React Element | Callback function for component enters viewport                                                                                    |
| Options   | Object        | Option you want to pass to [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) |   |
| Config    | Object        | Configs for HOC, see below |

### Supported config

| Params            | Type    | Default                                                                                                                            | Description                                  |
|-------------------|---------|------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|
| disconnectOnLeave | boolean | fasle                                                                                                                              | disconnect intersection observer after leave |

### Props to the HOC component

| Props           | Type     | Default | Description                                     |
|-----------------|----------|---------|-------------------------------------------------|
| onEnterViewport | function |         | Callback function for component enters viewport |
| onLeaveViewport | function |         | Callback function for component leaves viewport |

The HOC preserve `onEnterViewport` and `onLeaveViewport` props as a callback


### Props pass down by HOC to your component

| Props      | Type      | Default | Description                                                                       |
|------------|-----------|---------|-----------------------------------------------------------------------------------|
| inViewport | boolean   | false   | Is your component in viewport                                                     |  
| forwardedRef   | React ref |         | If you are using functional component, assign this props as ref on your component |
| enterCount | number    |         | Amount of time your component enters viewport                                     |
| leaveCount | number    |         | Amount of time your component leaves viewport                                     |

_NOTE_: Stateless: Need to add `ref={this.props.forwardedRef}` on your component

#### Example of functional component

```javascript
import handleViewport from 'react-in-viewport';

const Block = (props: { inViewport: boolean }) => {
  const { inViewport, forwardedRef } = props;
  const color = inViewport ? '#217ac0' : '#ff9800';
  const text = inViewport ? 'In viewport' : 'Not in viewport';
  return (
    <div className="viewport-block" ref={forwardedRef}>
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

#### Example for enter/leave counts

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
          <p>{`Enter viewport: ${enterCount} times`}</p>
          <p>{`Leave viewport: ${leaveCount} times`}</p>
        </div>
      </section>
    );
  }
}
const MySection = handleViewport(MySectionBlock, { rootMargin: '-1.0px' });

export default MySection;
```

## Note

This library is using `ReactDOM.findDOMNode` to access DOM from React element. This method is deprecated in `StrictMode`, we will update the code and release a major version when React 17 is out.

## Who is using this component

- [Tinder](https://tinder.com)
