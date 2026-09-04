import handleViewport from './lib/handleViewport';

export const customProps = [
  'inViewport',
  'enterCount',
  'leaveCount',
  'hasReported',
];

export default handleViewport;
export { default as handleViewport } from './lib/handleViewport';
export { default as useInViewport } from './lib/useInViewport';

export type { InjectedViewportProps } from './lib/types';
