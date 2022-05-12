import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { address } from 'bitcoinjs-lib';
import View from '../../../components/view';
import InputArea from '../../../components/inputarea';
import { getCurrencyName, getSampleAddress, getNetwork } from '../../../utils';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import { StacksTestnet, StacksMocknet, StacksMainnet } from '@stacks/network';
import { AppConfig, UserSession } from '@stacks/connect';
import { stacksNetworkType } from '../../../constants';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';

import axios from 'axios';

let activeNetwork;
if (stacksNetworkType === 'mocknet') {
  activeNetwork = new StacksMocknet({ url: process.env.REACT_APP_STACKS_API });
} else if (stacksNetworkType === 'testnet') {
  activeNetwork = new StacksTestnet();
} else if (stacksNetworkType === 'mainnet') {
  activeNetwork = new StacksMainnet();
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
    marginRight: '4px !important',
  },
});

class StyledInputAddress extends React.Component {
  state = {
    error: false,
    userBalance: 0,
    sponsoredTx: false,
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
    console.log('onCheck input ', input.target.checked);
    onCheck(input.target.checked, false);
    this.setState({sponsoredTx: input.target.checked})
  };

  getUserStacksAddress = () => {
    if (userSession.isUserSignedIn()) {
      let userData = userSession.loadUserData();
      let userStacksAddress = '';
      if (stacksNetworkType === 'mainnet') {
        userStacksAddress = userData.profile.stxAddress.mainnet;
      } else {
        userStacksAddress = userData.profile.stxAddress.testnet;
      }
      return userStacksAddress;
    }
  };

  getUserBalance = async () => {
    const userAddress = this.getUserStacksAddress();
    const apiUrl = `https://stacks-node-api.${stacksNetworkType}.stacks.co`;
    const url = `${apiUrl}/extended/v1/address/${userAddress}/balances`;
    let response = await axios.get(url);
    const userBalance = parseInt(response.data.stx?.balance);
    console.log('getUserBalance', userBalance, userBalance === 0, userBalance === "0", { checked: !userBalance });
    this.onCheck({ target: { checked: !userBalance } });
    this.setState({ sponsoredTx: userBalance === 0 });
    return userBalance;
  };

  componentDidMount = () => {
    const userStacksAddress = this.getUserStacksAddress();
    this.onChange(userStacksAddress);
    let element = document.getElementById('addressTextfield');
    element.value = userStacksAddress;
    var event = new Event('change');
    element.dispatchEvent(event);

    this.getUserBalance();
  };

  render() {
    const { error, userBalance, sponsoredTx } = this.state;
    const { classes, swapInfo } = this.props;

    return (
      <View className={classes.wrapper}>
        <Box
          sx={{
            width: 500,
            maxWidth: '100%',
          }}
        >
          <TextField
            fullWidth
            label="Address"
            defaultValue={
              localStorage.getItem('ua') ||
              `EG: ${getSampleAddress(swapInfo.quote)}`
            }
            id="addressTextfield"
            disabled
            placeholder={`EG: ${getSampleAddress(swapInfo.quote)}`}
            onChange={this.onChange}
            error={error}
          />
          {swapInfo.quote === 'STX' ? (
            <FormControlLabel
              className={classes.checkbox}
              sx={{ marginLeft: 0 }}
              control={
                <Checkbox
                  checked={sponsoredTx}
                  onChange={this.onCheck}
                  className={classes.inputcb}
                  name="zeroStx"
                />
              }
              label=" Use sponsored transaction"
            />
          ) : // <label className={classes.checkbox}>
          //   <input
          //     name="zeroStx"
          //     type="checkbox"
          //     className={classes.inputcb}
          //     onChange={this.onCheck}
          //     checked={this.state.zeroStx}
          //   />
          //   Use sponsored transaction. (Enable this if you have no STX in your
          //   wallet.)
          // </label>
          null}
          {(swapInfo.quote === 'STX' && sponsoredTx) ? (
            <Typography>
              * Sponsored transaction enabled. Use when Account has 0 STX to cover transaction fee.
            </Typography>
          ) : null}
        </Box>

        {/* <p className={classes.title}>
          <b>{getCurrencyName(swapInfo.quote)}</b> receive address
           to
          which you want to receive
        </p>
        <InputArea
          width={600}
          autoFocus={true}
          height={150}
          error={error}
          showQrScanner={true}
          onChange={this.onChange}
          placeholder={`EG: ${getSampleAddress(swapInfo.quote)}`}
        /> */}
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
