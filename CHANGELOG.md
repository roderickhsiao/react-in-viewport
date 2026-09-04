# Changelog

Notable changes to `react-in-viewport`. Releases before `1.0.0-beta.10` are not
listed here — see the [releases page](https://github.com/roderickhsiao/react-in-viewport/releases)
and the commit history.

## [1.0.0-beta.10] — 2026-09-04

Two additions to the observation API and a round of packaging fixes. Everything
here is backwards compatible: no call site needs to change, and the defaults
preserve the previous behaviour.

### Added

- **`hasReported`** — tells "nothing reported yet" apart from "reported out of
  view" ([#181](https://github.com/roderickhsiao/react-in-viewport/pull/181)).
  `inViewport` starts `false`, and an element already out of view when
  observation begins is not a transition, so no callback fires and `inViewport`
  never moves. Any UI state derived from the *current* position — a header
  transparent over a hero, say — could not tell the two apart, which a page
  reloaded at a restored mid-page scroll hits exactly. `inViewport` is
  meaningful once `hasReported` is `true`.
- **`config.enabled`** — pause and resume observation
  ([#182](https://github.com/roderickhsiao/react-in-viewport/pull/182), closing
  [#67](https://github.com/roderickhsiao/react-in-viewport/issues/67)). For when
  your own code drives the scroll and shouldn't be told about every section it
  passes. Resuming reconciles rather than replays: re-observing reports the
  element's current state once, and the intermediate transitions not at all.
  The hook can toggle it at runtime; the HOC reads it but captures config at
  wrap time, so there it is fixed for the life of the component.
- **[MIGRATION.md](MIGRATION.md)**, covering both of the above.

### Fixed

- **The wrong intersection entry was being read**
  ([#179](https://github.com/roderickhsiao/react-in-viewport/pull/179)). A single
  delivery can carry several entries for one target when the observer coalesces
  changes. Reading `entries[0]` fired callbacks for a state the element had
  already left and dropped the real one; the last entry is the current state.
- **The observer was rebuilt on every render**
  ([#179](https://github.com/roderickhsiao/react-in-viewport/pull/179)) whenever
  `options` or the callbacks were passed as inline literals — which the README's
  own examples do. They are now compared by value and read through refs.
- **Compiled test files were being published**
  ([#184](https://github.com/roderickhsiao/react-in-viewport/pull/184)). The
  build's ignore globs said `tests,stories` while the directories are `__tests__`
  and `stories`, so they matched nothing.
- **`npm publish` no longer ships a stale build**
  ([#184](https://github.com/roderickhsiao/react-in-viewport/pull/184)). The
  build hung off `prepublish`, which npm stopped running on publish in v7, so
  publishing shipped whatever `dist/` happened to be on disk. It now runs from
  `prepublishOnly`, and a failed transpile fails the build instead of being
  swallowed.

### Changed

- **The published package contains only `dist/`** plus `README`, `LICENSE` and
  `package.json` ([#184](https://github.com/roderickhsiao/react-in-viewport/pull/184)).
  Previous tarballs also carried repo files such as `AGENTS.md`, `tsconfig*.json`
  and the GitHub workflows.
- **Development moved from yarn to pnpm**
  ([#183](https://github.com/roderickhsiao/react-in-viewport/pull/183)). No effect
  on consumers — install `react-in-viewport` with whatever you like.
- Storybook is no longer deployed as a side effect of publishing; it is now
  `npm run publish-storybook`.
- 24 dependency updates.
