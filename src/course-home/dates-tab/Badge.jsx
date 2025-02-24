import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function Badge({ children, className, ...rest }) {
  return (
    <span
      className={classNames('dates-badge x-small ml-2 position-absolute', className)}
      data-testid="dates-badge"
      {...rest}
    >
      {children}
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Badge.defaultProps = {
  children: null,
  className: null,
};
