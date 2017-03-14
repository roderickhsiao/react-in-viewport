# React In Viewport Component

Wrapper component to detect if the component is in viewport.
Use [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

Dependencies: [Intersection Observer Polyfills](https://www.npmjs.com/package/intersection-observer)


## Usages

```javascript
import InViewport from 'react-in-viewport';

const ViewportBlock = (props) => {
  // inViewport will be passed as a props
  const { inViewport } = props;
  const color = inViewport ? '#217ac0' : '#ff9800';
  const text = inViewport ? 'In viewport' : 'Not in viewport'
  return (
    <div className="viewport-block">
      <h3>{ text }</h3>
      <div style={{ width: '400px', height: '300px', background: color}}></div>
    </div>
  );
};

const Component = (props) => (
  <div>
    <div style={{ height: '100vh' }}>
      <h2>Scroll down to make component in viewport</h2>
    </div>
    <InViewport>
      <ViewportBlock />
    </InViewport>
  </div>
))
```
