import { fn } from 'storybook/test'; // eslint-disable-line import/extensions

import handleViewport, { customProps } from '../../index'; // eslint-disable-line import/no-named-as-default
import type { InjectedViewportProps } from '../../lib/types';
import { omit } from '../../lib/utils';
import { Block, PageTitle, Spacer } from '../common/themeComponent';

const ViewportBlock = handleViewport(Block, {}, { disconnectOnLeave: false });
const CustomAnchor = ({
  forwardedRef,
  inViewport,
  ...restProps
}: InjectedViewportProps<HTMLAnchorElement>) => {
  const text = inViewport ? 'Link (in viewport)' : 'Link (not in viewport)';
  return (
    <a
      href="https://github.com/roderickhsiao/react-in-viewport#readme"
      {...omit(restProps, customProps)}
      ref={forwardedRef}
      style={{ padding: '20px 0' }}
    >
      {text}
    </a>
  );
};
const ViewportAnchor = handleViewport(
  CustomAnchor,
  {},
  { disconnectOnLeave: false },
);

export default {
  title: 'Enter Callback',
  component: ViewportBlock,
  decorators: [
    (Story: React.ElementType) => (
      <>
        <PageTitle />
        <Spacer />
        <div style={{ padding: '20px', maxWidth: '400px' }}>
          <Story />
        </div>
      </>
    ),
  ],
};

export const ClassBaseComponent = () => {
  return <ViewportBlock onEnterViewport={fn()} onLeaveViewport={fn()} />;
};

export const FunctionalComponent = () => {
  return <ViewportAnchor onEnterViewport={fn()} onLeaveViewport={fn()} />;
};
