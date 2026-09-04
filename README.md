<p align="center">
  <h1>React In Viewport</h1>
  <a href="https://www.npmjs.org/package/react-in-viewport"><img src="https://img.shields.io/npm/v/react-in-viewport.svg?style=flat" alt="npm"></a>
  <a href="https://unpkg.com/react-in-viewport"><img src="https://img.badgesize.io/https://unpkg.com/react-in-viewport/dist/es/index.js?compression=gzip" alt="gzip size"></a>
  <a href="https://www.npmjs.com/package/react-in-viewport"><img src="https://img.shields.io/npm/dt/react-in-viewport.svg" alt="downloads" ></a>
</p>

<hr>

Library to detect whether or not a component is in the viewport, using the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

This library also uses [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) to detect the change of the target element.

```npm install --save react-in-viewport```

```yarn add react-in-viewport```

Upgrading? See [MIGRATION.md](MIGRATION.md).

## Examples

[Demo](https://roderickhsiao.github.io/react-in-viewport/)

## Why

A common use case is to load an image when a component is in the viewport ([lazy load](https://medium.com/@roderickhsiao/performance-101-i-know-how-to-load-images-a262d556250f)).

We have traditionally needed to monitor scroll position and calculate the viewport size, which can be a scroll performance bottleneck.

Modern browsers now provide a new API--[Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)--which can make implementating this effort much easier and performant.


## Polyfill

For browsers not supporting the API, you will need to load a [polyfill](https://www.npmjs.com/package/intersection-observer).
[Browser support table](https://caniuse.com/#feat=intersectionobserver)

```js
require('intersection-observer');
```

## Design

The core logic is written using React Hooks. We provide two interfaces: you can use `handleViewport`, a higher order component (HOC) for class based components, or use hooks directly, for functional components.

The HOC acts as a wrapper and attaches the intersection observer to your target component. The HOC will then pass down extra props, indicating viewport information and executing a callback function when the component enters and leaves the viewport.

## Usages

### Using Higher Order Component
When wrapping your component with `handleViewport` HOC, you will receive `inViewport` props indicating whether the component is in the viewport or not.

`handleViewport` HOC accepts three params: `handleViewport(Component, Options, Config)`

| Params    | Type          | Description                                                                                                                        |
|-----------|---------------|------------------------------------------------------------------------------------------------------------------------------------|
| Component | React Element | Callback function for when the component enters the viewport                                                                                    |
| Options   | Object        | Options you want to pass to [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) |   |
| Config    | Object        | Configs for HOC (see below) |

### Supported config

| Params            | Type    | Default                                                                                                                            | Description                                  |
|-------------------|---------|------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|
| disconnectOnLeave | boolean | false                                                                                                                              | Disconnect intersection observer after leave |
| enabled           | boolean | true                                                                                                                               | Whether the element is observed at all. Toggling it at runtime needs the hook — see [Pausing observation](#pausing-observation) |

> The HOC reads `enabled` too, but cannot toggle it.
> `handleViewport(Component, options, config)` takes its config as a wrap-time
> argument, so the value is captured once when the component is created and
> cannot be changed afterwards: `{ enabled: false }` passed to the HOC turns
> observation off for the life of the component, and nothing can turn it back
> on. Pausing is a runtime decision, so use the `useInViewport` hook for that.

### HOC Component Props

| Props           | Type     | Default | Description                                     |
|-----------------|----------|---------|-------------------------------------------------|
| onEnterViewport | function |         | Callback function for when the component enters the viewport |
| onLeaveViewport | function |         | Callback function for when the component leaves the viewport |

The HOC preserves `onEnterViewport` and `onLeaveViewport` props as a callback


### Props passed down by HOC to your component

| Props      | Type      | Default | Description                                                                       |
|------------|-----------|---------|-----------------------------------------------------------------------------------|
| inViewport | boolean   | false   | Whether your component is in the viewport                                                     |  
| forwardedRef   | React ref |         | Assign this prop as a ref on your component |
| enterCount | number    |         | Numbers of times your component has entered the viewport                                     |
| leaveCount | number    |         | Number of times your component has left the viewport                                     |

_NOTE_: Need to add `ref={this.props.forwardedRef}` to your component

#### Example of a functional component

```tsx
import handleViewport, { type InjectedViewportProps } from 'react-in-viewport';

const Block = (props: InjectedViewportProps<HTMLDivElement>) => {
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

- If you need to know how many times the component has entered the viewport, use the prop `enterCount`.
- If you need to know how many times the component has left the viewport, use the prop `leaveCount`.

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
    const { enterCount, leaveCount, forwardedRef } = this.props;
    return (
      <section ref={forwardedRef}>
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

### Using Hooks

Alternatively, you can also directly using `useInViewport` hook which takes similar configuration as HOC.

```js
import React, { useRef } from 'react';
import { useInViewport } from 'react-in-viewport';

const MySectionBlock = () => {
  const myRef = useRef(null);
  const {
    inViewport,
    enterCount,
    leaveCount,
  } = useInViewport(
    myRef,
    options,
    config = { disconnectOnLeave: false },
    props
  );

  return (
    <section ref={myRef}>
      <div className="content" style={this.getStyle()}>
        <h1>Hello</h1>
        <p>{`Enter viewport: ${enterCount} times`}</p>
        <p>{`Leave viewport: ${leaveCount} times`}</p>
      </div>
    </section>
  );
};
```

#### Pausing observation

Set `config.enabled` to `false` to stop observing, and back to `true` to resume.

The case this exists for: a tab bar that both highlights the section you have
scrolled to *and* scrolls to a section when clicked. Without a pause, clicking a
tab reports every section the smooth scroll flies past, and the highlight
flickers on the way down.

```js
import { useRef, useState } from 'react';
import { useInViewport } from 'react-in-viewport';

const Section = ({ id, onEnter }) => {
  const ref = useRef(null);
  const [scrolling, setScrolling] = useState(false);

  useInViewport(
    ref,
    {},
    { enabled: !scrolling },
    { onEnterViewport: () => onEnter(id) }
  );

  const scrollToMe = () => {
    setScrolling(true);
    ref.current.scrollIntoView({ behavior: 'smooth' });
    // `scrollend` fires once the smooth scroll has actually settled.
    addEventListener('scrollend', () => setScrolling(false), { once: true });
  };

  return <section ref={ref} />;
};
```

Resuming **reconciles rather than replays**. Re-observing delivers the element's
current state, so a transition that happened while paused is reported once, on
resume — and the intermediate ones are never reported at all. An element that
did not move across the pause reports nothing.

`enabled` is the outer switch: if `disconnectOnLeave` has already fired, setting
`enabled` back to `true` starts a fresh observation.

## Who is using this component

- [Tinder](https://tinder.com)
