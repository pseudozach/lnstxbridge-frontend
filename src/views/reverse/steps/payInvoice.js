import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Link from '../../../components/link';
import View from '../../../components/view';
import QrCode from '../../../components/qrcode';
// import { copyToClipBoard } from '../../../utils';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import DetectResize from '../../../components/detectresize';
// import Input from '../../../components/textinput';
import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
} from '@mui/material';
import { ContentCopy, Info } from '@mui/icons-material';

const styles = () => ({
  qrwrapper: {
    // flexDirection: 'column',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
  qrcode: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-around',
    width: '100%',
  },
  invoice: {
    fontSize: '20px',
    color: 'grey',
    wordBreak: 'break-word',
    paddingLeft: '15px',
    paddingRight: '15px',
    '@media (max-width: 425px)': {
      fontSize: '16px',
    },
    '@media (max-width: 320px)': {
      fontSize: '10px',
    },
  },
  invoiceInfo: {
    paddingRight: '15px',
    margin: '8px',
    marginBottom: 0,
    marginTop: '16px',
  },
  link: {
    '@media (max-width: 425px)': {
      fontSize: '16px',
    },
  },
  title: {
    fontSize: '30px',
    textAlign: 'center',
    '@media (max-width: 425px)': {
      fontSize: '16px',
    },
  },
  action: {
    color: 'blue',
    fontWeight: '600',
    fontSize: '30px',
    marginLeft: '50%',
    '&:hover': {
      cursor: 'pointer',
    },
    '@media (max-width: 425px)': {
      fontSize: '18px',
    },
  },
});

class PayInvoice extends React.Component {
  showedWebln = false;

  render() {
    const { classes, webln, swapInfo, swapResponse } = this.props;

    if (webln && !this.showedWebln) {
      if (swapResponse.invoice) {
        this.showedWebln = true;
        webln.sendPayment(swapResponse.invoice);
      }
    }

    return (
      <View className={classes.wrapper}>
        <Paper
          variant="outlined"
          sx={{
            m: 1,
            py: 1,
            // mb: 2,
            display: 'flex',
            width: '100%',
          }}
          fullWidth
        >
          <Info color="info" fontSize="large" sx={{ m: 1, fontSize: 36 }} />
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
          >
            Pay the {swapInfo.base} Lightning invoice
            {swapResponse.minerFeeInvoice ? 's' : ''} to start the swap
          </Typography>
        </Paper>

        {window.innerWidth < 768 ? (
          <div />
        ) : (
          <View className={classes.qrwrapper}>
            {swapResponse.minerFeeInvoice ? (
              <View className={classes.qrcode}>
                <DetectResize>
                  {width =>
                    width <= 375 ? (
                      <a
                        href={`lightning:${swapResponse.minerFeeInvoice}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <QrCode
                          size={200}
                          link={swapResponse.minerFeeInvoice}
                        />
                      </a>
                    ) : (
                      <a
                        href={`lightning:${swapResponse.minerFeeInvoice}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <QrCode
                          size={250}
                          link={swapResponse.minerFeeInvoice}
                        />
                      </a>
                    )
                  }
                </DetectResize>
              </View>
            ) : null}
            <View className={classes.qrcode}>
              <DetectResize>
                {width =>
                  width <= 375 ? (
                    <a
                      href={`lightning:${swapResponse.invoice}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <QrCode size={200} link={swapResponse.invoice} />
                    </a>
                  ) : (
                    <a
                      href={`lightning:${swapResponse.invoice}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <QrCode size={250} link={swapResponse.invoice} />
                    </a>
                  )
                }
              </DetectResize>
            </View>
          </View>
        )}

        {swapResponse.minerFeeInvoice ? (
          <View className={classes.info}>
            {/* <p className={classes.title}>
              Pay these 2 {swapInfo.base} Lightning invoices
            </p> */}
            <p className={classes.invoiceInfo}>
              First invoice is for the funds that will be used to sponsor your
              transaction. <br />
              {/* <Input
                value={swapResponse.minerFeeInvoice}
                disabled={true}
                id="minerfeeinvoice"
              />{' '} */}
              <br />
              {/* Second one is a{' '}
              <Link
                text="HOLD invoice"
                to="https://wiki.ion.radar.tech/tech/research/hodl-invoice"
              />{' '}
              and its preimage was generated in your browser. Which means we
              cannot receive the lightning coins unless your browser claims the
              onchain funds for you. */}
            </p>
            <FormControl sx={{ m: 1, mt: 0 }} variant="standard">
              <OutlinedInput
                id="standard-adornment-password1"
                value={swapResponse.minerFeeInvoice}
                disabled={true}
                endAdornment={
                  <InputAdornment position="end">
                    <CopyToClipboard
                      text={swapResponse.minerFeeInvoice}
                      onCopy={() => this.setState({ copied: true })}
                    >
                      <IconButton>
                        <ContentCopy />
                      </IconButton>
                    </CopyToClipboard>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl sx={{ m: 1 }} variant="standard">
              <OutlinedInput
                id="standard-adornment-password2"
                value={swapResponse.invoice}
                disabled={true}
                endAdornment={
                  <InputAdornment position="end">
                    <CopyToClipboard
                      text={swapResponse.invoice}
                      onCopy={() => this.setState({ copied: true })}
                    >
                      <IconButton>
                        <ContentCopy />
                      </IconButton>
                    </CopyToClipboard>
                  </InputAdornment>
                }
              />
            </FormControl>
            {/* <Input value={swapResponse.invoice} disabled={true} id="invoice" /> */}
          </View>
        ) : (
          <View className={classes.info}>
            {/* <p className={classes.title}>
              Pay this {swapInfo.base} Lightning invoice:
            </p> */}
            {/* <p className={classes.invoiceInfo}>
              This is a{' '}
              <Link
                text="HOLD invoice"
                to="https://wiki.ion.radar.tech/tech/research/hodl-invoice"
              />{' '}
              and its preimage was generated in your browser. Which means we
              cannot receive the lightning coins unless your browser claims the
              onchain funds for you.
            </p> */}
            {/* <Input
              value={swapResponse.invoice}
              disabled={true}
              id="copy"
              variant="outlined"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="copy invoice"
                    // onClick={handleClickShowPassword}
                    // onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    <ContentCopy />
                  </IconButton>
                </InputAdornment>
              }
            /> */}

            {/* width: '25ch' */}
            <FormControl sx={{ m: 1 }} variant="standard">
              <OutlinedInput
                id="standard-adornment-password"
                value={swapResponse.invoice}
                disabled={true}
                endAdornment={
                  <InputAdornment position="end">
                    <CopyToClipboard
                      text={swapResponse.invoice}
                      onCopy={() => this.setState({ copied: true })}
                    >
                      <IconButton>
                        <ContentCopy />
                      </IconButton>
                    </CopyToClipboard>
                  </InputAdornment>
                }
              />
            </FormControl>

            {/* <p className={classes.invoice} id="copy">
              {swapResponse.invoice}
            </p> */}
            {/* <span className={classes.action} onClick={() => copyToClipBoard()}>
              Copy
            </span> */}
          </View>
        )}
      </View>
    );
  }
}

PayInvoice.propTypes = {
  classes: PropTypes.object.isRequired,
  swapInfo: PropTypes.object,
  swapResponse: PropTypes.string,
  webln: PropTypes.object,
};

export default injectSheet(styles)(PayInvoice);
