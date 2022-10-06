import React from 'react';
import PropTypes from 'prop-types';
import View from '../view';

const Control = props => {
  const { stage, num, render } = props;
  if (stage === num) {
    console.log('sw/controls.8 props ', props);
    // let zProps = props;
    if (window.location.href.includes('/swap?swapId=') && stage === 1) {
      props.nextStage(2);
    }
    if (
      window.location.href.includes('/swap?swapId=') &&
      stage === 3 &&
      props.swapStatus?.message?.includes('Transaction claimed')
    ) {
      props.nextStage(1);
    }
    return render(props);
  } else return null;
};

Control.propTypes = {
  num: PropTypes.number,
  stage: PropTypes.number,
  render: PropTypes.func,
};

class Controls extends React.Component {
  render() {
    const { children, style } = this.props;
    const steps = React.Children.map(children, child => {
      return React.cloneElement(child, {
        ...this.props,
      });
    });

    return <View className={style.controls}>{steps}</View>;
  }
}

Controls.propTypes = {
  nextStage: PropTypes.func,
  disable: PropTypes.bool,
  canExit: PropTypes.bool,
  onExit: PropTypes.func,
  children: PropTypes.node,
  style: PropTypes.object,
  stage: PropTypes.number,
  range: PropTypes.number,
};

export { Control };
export default Controls;
