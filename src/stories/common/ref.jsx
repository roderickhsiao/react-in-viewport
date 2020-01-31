import React from 'react';
import { compose, setDisplayName } from 'recompose';
import { withRouter } from 'react-router';

import { handleViewport } from '../../index';

import { Block } from './themeComponent';

// https://github.com/ReactTraining/react-router/issues/6056
const withRouterAndRef = Wrapped => {
  const WithRouter = withRouter(({ forwardRef, ...otherProps }) => (
    <Wrapped ref={forwardRef} {...otherProps} />
  ));
  const WithRouterAndRef = React.forwardRef((props, ref) => (
    <WithRouter {...props} forwardRef={ref} />
  ));
  const name = Wrapped.displayName || Wrapped.name;
  WithRouterAndRef.displayName = `withRouterAndRef(${name})`;
  return WithRouterAndRef;
};

export default compose(
  setDisplayName('DemoComponent'),
  withRouterAndRef,
  handleViewport
)(Block);
