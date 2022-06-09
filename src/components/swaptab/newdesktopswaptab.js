import React from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import SwapTabWrapper from './swaptabwrapper';
// import { MdCompareArrows } from 'react-icons/md';
// import View from '../view';
// import Input from '../input';
// import DropDown from '../dropdown';
// import Controls from '../controls';
// // import Button from '../button';
// import Text, { InfoText } from '../text';
import { formatAmount, rateProvider } from '../../utils';

// import { Button as SButton, Box } from '@stacks/ui'
// import { MdAccountBalanceWallet } from 'react-icons/md';

// import { Box, Button, ButtonProps, Stack, StackProps } from '@stacks/ui';

// import Dotxbutton from '../dotxbutton';
// <Dotxbutton/>

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Button from '@mui/material/Button';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { AccountBalanceWallet, Logout } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

class DeskTopSwapTabContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      minUSD: '',
    };
  }

  async fetchRates(base, quote, amount) {
    console.log('fetchRates: ', base, quote, amount);
    const response = await rateProvider(base, quote, amount);
    console.log('got response: ', response);
    this.setState({
      minUSD: response,
    });
  }

  render() {
    const {
      classes,
      feeAmount,
      minAmount,
      maxAmount,
      inputError,
      baseAmount,
      base,
      currencies,
      quote,
      quoteAmount,
      error,
      errorMessage,
      // disabled,
      rate,
      switchPair,
      updateQuoteAmount,
      updateBaseAmount,
      updatePair,
      shouldSubmit,
      baseStep,
      quoteStep,
      feePercentage,
      // connectWallet,
      connectStacksWallet,
      // lockStx,
      stacksUserSession,
      baseUSD,
      quoteUSD,
    } = this.props;

    // if (!this.state.minUSD) this.fetchRates(base, quote, minAmount);

    return (
      <>
        <Card className={classes.wrapper}>
          <CardHeader
            sx={{ textAlign: 'center' }}
            // avatar={
            //   <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            //     R
            //   </Avatar>
            // }
            // action={
            //   <IconButton aria-label="settings">
            //     <MoreVertIcon />
            //   </IconButton>
            // }
            title="Swap"
            // subheader="September 14, 2016"
          />
          {/* <CardMedia
          component="img"
          height="194"
          image="/static/images/cards/paella.jpg"
          alt="Paella dish"
        /> */}
          <CardContent>
            <Paper
              // elevation={1}
              variant="outlined"
              // className={classes.darkpaper}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2,
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <div className={classes.flexDiv}>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <Select
                    value={base}
                    defaultValue={base}
                    onChange={e => updatePair(quote, e.target.value)}
                    // displayEmpty
                    className={classes.inputMobile}
                    inputProps={{
                      'aria-label': 'Without label',
                      className: classes.midIcon,
                    }}
                    sx={{
                      m: 1,
                      minWidth: 120,
                    }}
                    // sx={{ color: 'white', backgroundColor: '#1a211f', display: 'block' }}
                  >
                    {currencies.map(currency => (
                      <MenuItem
                        value={currency}
                        key={currency}
                        sx={{ my: 2, display: 'block' }}
                      >
                        <img
                          src={`./${currency.toLowerCase()}.svg`}
                          height="20"
                          style={{ marginRight: 4 }}
                        />
                        {currency}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* <FormHelperText>Without label</FormHelperText> */}
                </FormControl>

                <TextField
                  variant="outlined"
                  // disable={disabled}
                  className={classes.inputMobile}
                  min={0}
                  max={maxAmount}
                  step={quoteStep}
                  error={inputError}
                  value={baseAmount}
                  onChange={updateQuoteAmount}
                  type="number"
                  sx={{ mr: '16px !important' }}
                />
              </div>
              <div className={classes.flexDiv}>
                {/* <span
                  className={classes.fiatSpan}
                  style={{ marginLeft: 16 }}
                </span> */}
                <span className={classes.fiatSpan}>{`~$ ${baseUSD}`}</span>
              </div>
            </Paper>

            <div height="0px !important" className={classes.zerodiv}>
              <IconButton
                aria-label="Swap Pairs"
                className={classes.flipbutton}
                onClick={switchPair}
              >
                <ArrowDownwardIcon />
              </IconButton>
            </div>

            <Paper
              // elevation={1}
              variant="outlined"
              // className={classes.darkpaper}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2,
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <div className={classes.flexDiv}>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <Select
                    value={quote}
                    defaultValue={quote}
                    onChange={e => updatePair(e.target.value, base)}
                    // displayEmpty
                    inputProps={{
                      'aria-label': 'Without label',
                      className: classes.midIcon,
                    }}
                    className={classes.inputMobile}
                    sx={{ m: 1, minWidth: 120 }}
                    // sx={{ color: 'white', backgroundColor: '#1a211f', display: 'block' }}
                  >
                    {currencies.map(currency => (
                      <MenuItem
                        value={currency}
                        key={currency}
                        sx={{ my: 2, display: 'block' }}
                      >
                        <img
                          src={`./${currency.toLowerCase()}.svg`}
                          height="20"
                          style={{ marginRight: 4 }}
                        />
                        {currency}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* <FormHelperText>Without label</FormHelperText> */}
                </FormControl>

                <TextField
                  variant="outlined"
                  // disable={disabled}
                  className={classes.inputMobile}
                  min={baseStep}
                  max={Number.MAX_SAFE_INTEGER}
                  step={baseStep}
                  error={inputError}
                  value={quoteAmount}
                  onChange={updateBaseAmount}
                  type="number"
                  sx={{ mr: '16px !important' }}
                />
              </div>
              <div className={classes.flexDiv}>
                {/* <span
                  className={classes.fiatSpan}
                  style={{ marginLeft: 16 }}
                </span> */}
                <span className={classes.fiatSpan}>{`~$ ${quoteUSD}`}</span>
              </div>
            </Paper>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Fees & Limits</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography className={classes.spaceman}>
                  <span>Min</span>{' '}
                  <span>{`${formatAmount(minAmount)} ${base}`} </span>{' '}
                </Typography>
                <Typography className={classes.spaceman}>
                  <span>Max</span>{' '}
                  <span>{`${formatAmount(maxAmount)} ${base}`}</span>
                </Typography>
                <Typography className={classes.spaceman}>
                  <span>Swap Fee </span>{' '}
                  <span>{`${feeAmount} ${base} (${feePercentage}%)`}</span>
                </Typography>
                <Typography className={classes.spaceman}>
                  <span>Rate </span> <span>{`${rate}`}</span>
                </Typography>
              </AccordionDetails>
            </Accordion>

            {/* <Typography variant="body2" color="text.secondary">
            This impressive paella is a perfect party dish and a fun meal to cook
            together with your guests. Add 1 cup of frozen peas along with the mussels,
            if you like.
          </Typography> */}
          </CardContent>
          <CardActions
            sx={{ flexDirection: 'column', borderTop: '1px solid #7a40ee' }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
              }}
            >
              <Button
                variant="outlined"
                // className={classes.contractButton}
                text={'Connect Wallet'}
                sx={{ margin: 2, textTransform: 'initial' }}
                onClick={async () => {
                  connectStacksWallet();

                  // if (localStorage.getItem('ua')) {
                  //   console.log('localstorage logout');
                  //   // logout / clear localstorage
                  //   localStorage.removeItem('ua');
                  //   window.location.reload();
                  // } else {
                  //   // let w3 = await connectWallet();
                  //   connectStacksWallet();
                  //   // console.log('onpress account ', w3);
                  //   // this.onChange(w3.account, false);
                  //   // document.getElementById('addressTextfield').value = w3.account;
                  //   const ua = stacksUserSession();
                  //   console.log('localstorage login ', ua);
                  //   localStorage.setItem('ua', ua);
                  //   window.location.reload();
                  // }
                }}
                startIcon={
                  !localStorage.getItem('ua') && <AccountBalanceWallet />
                }
              >
                {stacksUserSession()
                //  && localStorage.getItem('ua')
                //   ? localStorage.getItem('ua').slice(0, 4) +
                //     '...' +
                //     localStorage.getItem('ua').slice(-4)
                //   : ''
                }
                {stacksUserSession() ? (
                  <Tooltip title="Disconnect Wallet">
                    <Logout sx={{ ml: 1 }} />
                  </Tooltip>
                ) : (
                  'Connect Wallet'
                )}
              </Button>
              {(error || inputError) && (
                <Alert severity="error" sx={{ flex: 1, mx: 1 }}>
                  {errorMessage}
                </Alert>
              )}
              <Button
                variant="contained"
                size="large"
                endIcon={<NavigateNextIcon />}
                sx={{ margin: 2 }}
                className={classes.stacksButton}
                disabled={error || inputError || !localStorage.getItem('ua')}
                onClick={() => shouldSubmit()}
              >
                Start
              </Button>
            </Box>
          </CardActions>
        </Card>
      </>
    );
  }
}

const styles = {
  fiatSpan: {
    marginLeft: 'auto',
    marginRight: 16,
    marginBottom: 4,
    opacity: 0.5,
    // minWidth: 120,
  },
  flexDiv: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  midIcon: {
    display: 'flex !important',
    alignItems: 'center !important',
  },
  stacksButton: {
    backgroundColor: '#7a40ee',
    backgroundImage: 'linear-gradient(135deg, #5546ff, rgba(122, 64, 238, 0))',
    webkitTransition: 'background-color 200ms ease-in-out',
    transition: 'background-color 200ms ease-in-out',
  },
  zerodiv: {
    maxHeight: '0px',
  },
  flipbutton: {
    position: 'relative !important',
    left: '50% !important',
    // bottom: '50% !important',
    bottom: '27.5px !important',
    backgroundColor: '#7a40ee',
    backgroundImage: 'linear-gradient(135deg, #5546ff, rgba(122, 64, 238, 0))',
    webkitTransition: 'background-color 200ms ease-in-out',
    transition: 'background-color 200ms ease-in-out',

    // backgroundColor: '#45665b !important',
    color: 'white !important',
    '&:hover': {
      backgroundColor: '#490bc7; !important',
    },
  },
  darkpaper: {
    backgroundColor: '#303b47 !important',
  },
  greenman: {
    backgroundColor: '#45665b !important',
    '&:hover': {
      backgroundColor: '#649384 !important',
    },
  },
  spaceman: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  wrapper: {
    margin: '15px',
    // height: '600px',
    minHeight: '500px',
    display: 'flex',
    justifyContent: 'space-between',
    width: '600px',
    flexDirection: 'column',
    backgroundColor: '#fff',
    '@media (min-width: 1500px)': {
      width: '600px',
      // height: '600px',
    },
    '@media (max-width: 500px)': {
      width: '100%',
      // height: '600px',
    },
  },
  inputMobile: {
    '@media (max-width: 500px)': {
      width: '100px',
      fontSize: '16px',
    },
  },
  stats: {
    backgroundColor: '#fff',
    height: '15%',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '5%',
  },
  options: {
    flex: '1 0 70%',
    flexDirection: 'column',
  },
  select: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  next: {
    // backgroundColor: 'rgba(85,70,255,1)',
    backgroundColor: 'rgba(85,70,255,1)',
    flex: '1 0 15%',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
  },
  sbuttoncl: {
    margin: 'auto',
    width: 'fit-content',
    padding: '15px',
  },
  connectButton: {
    backgroundColor: '#4A4A4A',
    flex: '1 1 25%',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
  loggedintext: {
    fontSize: 'inherit',
  },
  nextError: {
    backgroundColor: '#4A4A4A',
    flex: '1 0 15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontWeight: '300',
  },
  nextIcon: {
    fontSize: 26,
    padding: '10px',
    transition: '0.3s',
    color: '#fff',
    '&:hover': {
      color: '#D3D3D3',
    },
  },
  text: {
    fontSize: '20px',
  },
  arrows: {
    height: '30px',
    width: '30px',
    marginLeft: '80%',
    cursor: 'pointer',
    transform: 'rotate(90deg)',
    transition: 'none 200ms ease-out',
    transitionProperty: 'color',
    color: '#4A4A4A',
    '&:hover': {
      color: '#9D9D9D',
    },
  },
};

DeskTopSwapTabContent.propTypes = {
  classes: PropTypes.object,
  onPress: PropTypes.func,
  feePercentage: PropTypes.number.isRequired,
  limits: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
  quote: PropTypes.string,
  quoteAmount: PropTypes.number,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  feeAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minAmount: PropTypes.number,
  maxAmount: PropTypes.number,
  inputError: PropTypes.bool,
  baseAmount: PropTypes.number,
  base: PropTypes.string,
  disabled: PropTypes.bool,
  rate: PropTypes.string,
  switchPair: PropTypes.func,
  updateQuoteAmount: PropTypes.func,
  updateBaseAmount: PropTypes.func,
  updatePair: PropTypes.func,
  shouldSubmit: PropTypes.func,
  baseStep: PropTypes.string,
  quoteStep: PropTypes.string,
  connectWallet: PropTypes.func,
  connectStacksWallet: PropTypes.func,
  lockStx: PropTypes.func,
  stacksUserSession: PropTypes.func,
  quoteUSD: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
  baseUSD: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
};

const DeskTopSwapTab = props => (
  <SwapTabWrapper {...props}>
    {p => <DeskTopSwapTabContent {...p} />}
  </SwapTabWrapper>
);

export default injectSheet(styles)(DeskTopSwapTab);
