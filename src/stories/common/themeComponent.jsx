import React, { memo } from 'react';
import { action } from '@storybook/addon-actions';

export const PageTitle = memo(
  ({
    title = 'React In Viewport',
    description = 'Wrapper component to detect if the component is in viewport using Intersection Observer API'
  }) => (
    <div className="page__title">
      <h1 className="page__title-main">
        {title}
        <a
          className="github mui-icon"
          href="https://github.com/roderickhsiao/react-in-viewport"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span style={{ visibility: 'hidden' }}>Github</span>
        </a>
      </h1>
      <p className="page__title-desc">{description}</p>
    </div>
  )
);
PageTitle.displayName = 'PageTitle';

export const Card = memo(({ titleText, contentNode, innerRef }) => (
  <div className="card" ref={innerRef}>
    <div className="card__head">
      <h3 className="card__title">{titleText}</h3>
    </div>
    <div className="card__conent">{contentNode}</div>
  </div>
));

Card.displayName = 'Card';

export const Block = props => {
  const { inViewport, innerRef, enterCount, leaveCount } = props;
  const color = inViewport ? '#217ac0' : '#ff9800';
  const text = inViewport ? 'In viewport' : 'Not in viewport';
  action('Is in viewport')(inViewport);

  return (
    <Card
      className="viewport-block"
      titleText={text}
      innerRef={innerRef}
      contentNode={
        <div
          title={`Enter viewport ${enterCount} times, leave viewport ${leaveCount} times`}
          style={{
            width: '400px',
            height: '300px',
            background: color,
            transitionDuration: '1s'
          }}
        />
      }
    />
  );
};

Block.displayName = 'Block';

export const Spacer = () => (
  <div style={{ height: '100vh', padding: '20px' }}>
    <p>
      Scroll down to make component in viewport{' '}
      <span role="img" aria-label="down">
        👇
      </span>{' '}
    </p>
  </div>
);
Spacer.displayName = Spacer;
