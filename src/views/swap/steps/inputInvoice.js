import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { FaBolt } from 'react-icons/fa';
import * as bitcoin from 'bitcoinjs-lib';
import View from '../../../components/view';
import InputArea from '../../../components/inputarea';
import {
  toSatoshi,
  getCurrencyName,
  getSampleInvoice,
  getSmallestDenomination,
  getSampleAddress,
} from '../../../utils';

const InputInvoiceStyles = () => ({
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
  invoice: {
    padding: '50px',
    wordBreak: 'break-all',
    whiteSpace: 'normal',
    width: '600px',
    height: '100px',
    color: '#505050',
    fontSize: '18px',
    backgroundColor: '#D3D3D3',
    borderRadius: '3px',
  },
});

let bitcoinNetwork =
  process.env.REACT_APP_STACKS_NETWORK_TYPE === 'mocknet'
    ? bitcoin.networks.regtest
    : bitcoin.networks.mainnet;
console.log('bitcoinNetwork ', bitcoinNetwork);
function validate(input) {
  try {
    bitcoin.address.toOutputScript(input, bitcoinNetwork);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

class StyledInputInvoice extends React.Component {
  state = {
    error: false,
  };

  componentDidMount() {
    const { swapInfo, webln } = this.props;

    if (webln) {
      webln.makeInvoice(toSatoshi(swapInfo.quoteAmount)).then(response => {
        const invoice = response.paymentRequest;

        this.setState({ value: invoice });
        this.onChange(invoice);
      });
    }
  }

  onChange = input => {
    // accepting STX address for atomic swaps now
    if (
      input.slice(0, 2) === 'ln' ||
      input.slice(0, 10) === 'lightning:' ||
      input.slice(0, 1) === 'S' ||
      validate(input)
    ) {
      this.setState({ value: input, error: false }, () =>
        this.props.onChange(input, false)
      );
    } else {
      this.setState({ value: input, error: true }, () =>
        this.props.onChange(input, true)
      );
    }
  };

  render() {
    const { error } = this.state;
    const { classes, swapInfo } = this.props;

    console.log('ii.74 ', swapInfo);
    const isLN = localStorage.getItem('quote').includes('⚡');
    const placeholder = isLN
      ? getSampleInvoice(swapInfo.quote)
      : getSampleAddress(swapInfo.quote);
    const pasteText =
      swapInfo.quote === ('BTC' && isLN) ? 'Lightning invoice for ' : 'Address';
    // <FaBolt size={25} color="#FFFF00" />

    return (
      <View className={classes.wrapper}>
        <p className={classes.title}>
          Paste or scan a <b>{getCurrencyName(swapInfo.quote)}</b> {pasteText}{' '}
          <br />
          {swapInfo.quote === 'BTC' && isLN ? (
            <b>
              {toSatoshi(swapInfo.quoteAmount)}{' '}
              {getSmallestDenomination(swapInfo.quote)}
            </b>
          ) : null}
        </p>
        <InputArea
          width={600}
          height={150}
          error={error}
          autoFocus={true}
          showQrScanner={true}
          value={this.state.value}
          onChange={this.onChange}
          placeholder={`EG: ${placeholder}`}
        />
      </View>
    );
  }
}

StyledInputInvoice.propTypes = {
  classes: PropTypes.object.isRequired,
  swapInfo: PropTypes.object.isRequired,
  webln: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

const InputInvoice = injectSheet(InputInvoiceStyles)(StyledInputInvoice);

export default InputInvoice;
