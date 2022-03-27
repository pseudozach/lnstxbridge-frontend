import React from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import Link from '../link';
/*
 * Link button
 */

const ButtonStyles = theme => ({
  wrapper: {
    padding: '10px',
    color: '#fff',
    fontSize: 26,
    textDecoration: 'none',
    transition: '0.3s',
    '&:hover': {
      cursor: 'pointer',
      color: '#D3D3D3',
    },
  },
});

const Button = ({ classes, className, text, to, external, onPress }) => {
  const style = className ? `${classes.wrapper} ${className}` : classes.wrapper;
  return external ? (
    <Link text={text} to={to} className={style} />
  ) : (
    <span className={style} onClick={() => onPress()}>
      {text}
    </span>
  );
};

Button.propTypes = {
  classes: PropTypes.object,
  external: PropTypes.bool,
  text: PropTypes.string.isRequired,
  to: PropTypes.string,
  onPress: PropTypes.func,
  className: PropTypes.string,
};

export default injectSheet(ButtonStyles)(Button);
