import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { isIOS } from 'react-device-detect';
import View from '../../../components/view';
import { navigation } from '../../../actions';
import { createRefundQr } from '../../../utils/refundUtils';
import lightningPayReq from 'bolt11';
import * as bitcoin from 'bitcoinjs-lib';
import { Button, IconButton, Paper, Typography } from '@mui/material';
import {
  Download,
  DownloadForOffline,
  Info,
  PriorityHigh,
} from '@mui/icons-material';

const DownloadRefundStyles = () => ({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  info: {
    fontSize: '30px',
    alignSelf: 'flex-start',
    '@media (max-width: 425px)': {
      fontSize: '16px',
    },
  },
  address: {
    fontSize: '24px',
    alignSelf: 'flex-start',
    '@media (max-width: 425px)': {
      fontSize: '16px',
    },
  },
  link: {
    fontSize: '24px',
  },
});

let bitcoinNetwork =
  process.env.REACT_APP_STACKS_NETWORK_TYPE === 'mocknet'
    ? bitcoin.networks.regtest
    : bitcoin.networks.mainnet;
// console.log('bitcoinNetwork ', bitcoinNetwork);
function validate(input) {
  try {
    bitcoin.address.toOutputScript(input, bitcoinNetwork);
    return true;
  } catch (e) {
    // console.log(e);
    return false;
  }
}

class StyledDownloadRefund extends React.Component {
  constructor(props) {
    // console.log("downloadrefund.41 props: ", props)
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.ref.current.click();
  }

  render() {
    if (isIOS) {
      const dialog = window.confirm(
        'Tapping OK will open refund.png in a new tab which will be needed in case of a refund.' +
          ' Please save it in your gallery. This is important for conserving the non-custodial nature of the swap'
      );

      if (dialog !== true) {
        navigation.navHome();
      }
    }

    const {
      classes,
      currency,
      privateKey,
      redeemScript,
      timeoutBlockHeight,
      swapInfo,
      swapResponse,
    } = this.props;

    createRefundQr();

    // console.log("downloadrefund.74 ", swapInfo, swapResponse);

    if (
      swapInfo.invoice.toUpperCase().slice(0, 1) !== 'S' &&
      !validate(swapInfo.invoice)
    ) {
      var decoded = lightningPayReq.decode(swapInfo.invoice);
      // console.log("decoded: ", decoded);

      var obj = decoded.tags;
      for (let index = 0; index < obj.length; index++) {
        const tag = obj[index];
        // console.log("tag: ", tag);
        if (tag.tagName === 'payment_hash') {
          // console.log("yay: ", tag.data);
          var paymenthash = tag.data;
        }
      }
    }

    // console.log("paymenthash: ", paymenthash);
    let contract = swapResponse.address;

    return (
      <View className={classes.wrapper}>
        {/* {swapInfo ? ( */}
        <Paper
          variant="outlined"
          sx={{
            // backgroundColor: '#f8f4fc',
            m: 1,
            py: 1,
            mb: 2,
            display: 'flex',
          }}
          fullWidth
        >
          {/* fontSize="large" sx={{ fontSize: '5em'}} */}
          {/* {swapText.includes('This invoice is ') ? ( */}
          <Info color="info" fontSize="large" sx={{ m: 1, fontSize: 36 }} />
          {/* ) : null} */}
          {/* {this.state.showComplete ? (
                <CheckCircle
                  color="success"
                  fontSize="large"
                  sx={{ m: 1, fontSize: 36 }}
                />
              ) : null} */}
          <Typography
            variant="body1"
            gutterBottom
            component="div"
            sx={{
              mx: 'auto',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              marginBottom: 0,
            }}
            // color={this.state.statusColor}
          >
            This refund file can be used to trustlessly claim your coins back in
            case of failure of this swap. It is recommended to not delete this
            file until after the completion of this swap.
          </Typography>
        </Paper>
        {/* ) : null} */}

        <Button
          variant="contained"
          endIcon={<Download />}
          ref={this.ref}
          href={createRefundQr(
            currency,
            privateKey,
            redeemScript,
            timeoutBlockHeight,
            paymenthash,
            parseInt(swapResponse.expectedAmount / 100),
            contract,
            swapInfo,
            swapResponse
          )}
          download={'refund.png'}
          size="large"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Refund Backup File
        </Button>

        {/* <View className={classes.placer}>
          <p className={classes.info}>
            Download refund file
            <IconButton
              aria-label="delete"
              size="large"
              target="_blank"
              rel="noopener noreferrer"
              ref={this.ref}
              href={createRefundQr(
                currency,
                privateKey,
                redeemScript,
                timeoutBlockHeight,
                swapInfo,
                swapResponse
              )}
              download={'refund.png'}
            >
              <DownloadForOffline fontSize="inherit" />
            </IconButton>
            <a
              target="_blank"
              rel="noopener noreferrer"
              ref={this.ref}
              href={createRefundQr(
                currency,
                privateKey,
                redeemScript,
                timeoutBlockHeight,
                paymenthash,
                parseInt(swapResponse.expectedAmount / 100),
                contract,
                swapInfo,
                swapResponse,
              )}
              download={'refund.png'}
            >
              Click here
            </a>{' '}
            if the download of &lsquo;refund.png&lsquo; <br /> didn&apos;t start
            automatically.
          </p>
          <p className={classes.address}>
            <PriorityHigh sx={{ verticalAlign: 'bottom' }} />
            This refund file can be used to trustlessly <br />
            claim your coins back in case of failure of this <br />
            swap. It is recommended to not delete this <br />
            file until after the completion of this swap.
          </p>
        </View> */}
      </View>
    );
  }
}

StyledDownloadRefund.propTypes = {
  classes: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  redeemScript: PropTypes.string,
  privateKey: PropTypes.string.isRequired,
  timeoutBlockHeight: PropTypes.number.isRequired,
  swapInfo: PropTypes.object.isRequired,
  swapResponse: PropTypes.object.isRequired,
};

const DownloadRefund = injectSheet(DownloadRefundStyles)(StyledDownloadRefund);

export default DownloadRefund;
