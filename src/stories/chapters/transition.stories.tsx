import SectionWithTransition from '../common/Section';
import { PageTitle, Spacer } from '../common/themeComponent';

export default {
  title: 'Transition',
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

export const ClassComponentTransition = () => {
  return <SectionWithTransition />;
};
