import handleViewport from './lib/handleViewport';

export const customProps = ['inViewport', 'enterCount', 'leaveCount'];

export default handleViewport;
export { default as handleViewport } from './lib/handleViewport';
export { default as useInViewport } from './lib/useInViewport';

export type { InjectedProps } from './lib/types';
