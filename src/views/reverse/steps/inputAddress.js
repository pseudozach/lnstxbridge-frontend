import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { address } from 'bitcoinjs-lib';
import View from '../../../components/view';
import InputArea from '../../../components/inputarea';
import { getCurrencyName, getSampleAddress, getNetwork } from '../../../utils';

import { StacksTestnet, StacksMocknet, StacksMainnet } from '@stacks/network';
import { AppConfig, UserSession } from '@stacks/connect';
import { stacksNetworkType } from '../../../constants';
let activeNetwork;
if (stacksNetworkType === 'mocknet') {
  activeNetwork = new StacksMocknet({ url: process.env.REACT_APP_STACKS_API });
} else if (stacksNetworkType === 'testnet') {
  activeNetwork = new StacksTestnet();
} else if (stacksNetworkType === 'mainnet') {
  activeNetwork = new StacksMainnet();;
}

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const inputAddressStyles = () => ({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: '30px',
    '@media (max-width: 425px)': {
      fontSize: '16px',
    },
  },
  checkbox: {
    margin: '16px',
    fontSize: '20px',
    display: 'flex',
  },
  inputcb: {
    width: '20px',
    height: '20px',
    marginRight: '4px',
  }
});

class StyledInputAddress extends React.Component {
  state = {
    error: false,
  };

  onChange = input => {
    const { onChange, swapInfo } = this.props;
    const swapAddress = input.trim();

    let error = true;

    if (input !== '') {
      try {
        address.toOutputScript(swapAddress, getNetwork(swapInfo.quote));
        error = false;
        // eslint-disable-next-line no-empty
      } catch (error) {}
    }
    if (swapAddress.slice(0, 1) === 'S') {
      error = false;
    }
    // console.log('onchange error ', swapAddress, error);

    this.setState({ error });
    onChange(swapAddress, error);
  };

  onCheck = input => {
    const { onCheck } = this.props;
    // console.log('onCheck input ', input.target.checked);
    onCheck(input.target.checked, false);
  };

  getUserStacksAddress = () => {
    if(userSession.isUserSignedIn()) {
      let userData = userSession.loadUserData();
      let userStacksAddress = '';
      if(stacksNetworkType==="mainnet"){
        userStacksAddress = userData.profile.stxAddress.mainnet;
      } else {
        userStacksAddress = userData.profile.stxAddress.testnet;
      }
      return userStacksAddress;
    }
  }

  componentDidMount = () => {
    const userStacksAddress = this.getUserStacksAddress();
    this.onChange(userStacksAddress)
    let element = document.getElementById('textareaid');
    element.value = userStacksAddress;
    var event = new Event('change');
    element.dispatchEvent(event);
  };

  render() {
    const { error } = this.state;
    const { classes, swapInfo } = this.props;
    
    return (
      <View className={classes.wrapper}>
        <p className={classes.title}>
          <b>{getCurrencyName(swapInfo.quote)}</b> receive address
           {/* to
          which you want to receive */}
        </p>
        <InputArea
          width={600}
          autoFocus={true}
          height={150}
          error={error}
          showQrScanner={true}
          onChange={this.onChange}
          placeholder={`EG: ${getSampleAddress(swapInfo.quote)}`}
        />
        {swapInfo.quote === 'STX' ? (<label
          className={classes.checkbox}>
          <input
            name="zeroStx"
            type="checkbox"
            className={classes.inputcb}
            onChange={this.onCheck}
            checked={this.state.zeroStx} />
            Use sponsored transaction. (Enable this if you have no STX in your wallet.)
        </label>) : null}

      </View>
    );
  }
}

StyledInputAddress.propTypes = {
  classes: PropTypes.object.isRequired,
  swapInfo: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onCheck: PropTypes.func,
};

const InputAddress = injectSheet(inputAddressStyles)(StyledInputAddress);

export default InputAddress;
