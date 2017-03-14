# React In Viewport Component

Wrapper component to detect if the component is in viewport.
Use [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

Dependencies: [Intersection Observer Polyfills](https://www.npmjs.com/package/intersection-observer)


## Usages

```console
const ViewportBlock = (props) => {
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
```
