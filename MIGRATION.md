# Migration notes

## Within the `1.0.0-beta` line

Two APIs were added after `1.0.0-beta.9`. **Both are purely additive** — upgrading
requires no code changes, and existing reads of `inViewport`, `enterCount` and
`leaveCount` behave exactly as before. Adopt either one only where you need it.

### `hasReported` — telling "unknown" apart from "out of view"

**Added in [#181](https://github.com/roderickhsiao/react-in-viewport/pull/181).**

`inViewport` starts `false`, which is indistinguishable from an element observed
to be out of view. The two are not the same thing, and the gap is reachable: an
element that is already out of view when observation begins is not a transition,
so no callback fires and `inViewport` never moves off its initial `false`. A page
reloaded at a browser-restored mid-page scroll produces exactly that case.

That matters for any UI state derived from the *current* position rather than from
a transition — a header that is transparent over a hero, say, which would stay
transparent over the rest of the page until the reader scrolled back up.

`hasReported` says whether the observer has delivered anything yet, so
`inViewport` is meaningful once `hasReported` is `true`:

```jsx
const { inViewport, hasReported } = useInViewport(ref);

// Before: `false` here could mean "out of view" or "nothing reported yet".
const isOverHero = !hasReported || inViewport;
```

Nothing to change if your component only reacts to `onEnterViewport` /
`onLeaveViewport`, or only reads the counts.

### `config.enabled` — pausing observation

**Added in [#182](https://github.com/roderickhsiao/react-in-viewport/pull/182).**

Defaults to `true`, so omitting it keeps the previous behaviour. Set it to `false`
to stop observing and back to `true` to resume — for when your own code is driving
the scroll and shouldn't be told about every section it passes:

```jsx
useInViewport(ref, {}, { enabled: !scrolling }, { onEnterViewport: setActive });
```

Resuming reconciles rather than replays: re-observing delivers the element's
current state, so a transition that happened while paused is reported once, on
resume, and the intermediate ones not at all.

**Hook and HOC differ here.** `handleViewport(Component, options, config)` captures
its config when the component is wrapped, so `{ enabled: false }` passed to the HOC
turns observation off for the life of that component and nothing can turn it back
on. Toggling at runtime needs `useInViewport` directly.

See [Pausing observation](README.md#pausing-observation) for the full example.

## `0.x` → `1.0`

Not yet written. `1.0` is a TypeScript rewrite that added the `useInViewport` hook
alongside the existing `handleViewport` HOC; if you are coming from `0.x`, open an
issue describing your usage and it will be covered here.
