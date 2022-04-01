import React from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import View from '../view';

const styles = theme => ({
  wrapper: {
    background: '#DDD9DF',
    height: 'auto',
    width: '100%',
    margin: '10px',
    borderRadius: '15px',
  },
  bar: {
    backgroundColor: 'rgba(85,70,255,1)',
    height: '20px',
    borderRadius: '15px',
  },
});

const ProgressBar = ({ classes, progress }) => (
  <View className={classes.wrapper}>
    <View className={classes.bar} style={{ width: `${progress}%` }} />
  </View>
);

ProgressBar.propTypes = {
  classes: PropTypes.object,
  progress: PropTypes.number,
};

export default injectSheet(styles)(ProgressBar);
