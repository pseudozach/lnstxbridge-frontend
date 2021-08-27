import React from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import Link from '../link';
import { useHandleClaimHey } from '../../utils/dotx';
import { Button } from '../button';

/*
 * Link button
 */

const ButtonStyles = theme => ({
  wrapper: {
    padding: '10px',
    color: theme.colors.white,
    fontSize: theme.fontSize.sizeXL,
    textDecoration: 'none',
    transition: '0.3s',
    '&:hover': {
      cursor: 'pointer',
      color: theme.colors.lightGrey,
    },
  },
});

// { classes, className, text, to, external, onPress }
const Dotxbutton = () => {
  // const style = className ? `${classes.wrapper} ${className}` : classes.wrapper;
  const handleFaucetCall = useHandleClaimHey();

  // {() => handleFaucetCall()}
  return (
    <Link onClick={handleFaucetCall}>
      Claim HEY
    </Link>
  );
};

Dotxbutton.propTypes = {
  classes: PropTypes.object,
  external: PropTypes.bool,
  text: PropTypes.string.isRequired,
  to: PropTypes.string,
  onPress: PropTypes.func,
  className: PropTypes.string,
};

export default injectSheet(ButtonStyles)(Dotxbutton);
