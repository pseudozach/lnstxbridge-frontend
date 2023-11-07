import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { crypto } from 'bitcoinjs-lib';
import ReactNotification from 'react-notifications-component';
import View from '../../components/view';
// import Button from '../../components/button';
// import ModalComponent from '../../components/modal';
import BackGround from '../../components/background';
import LandingPageWrapper from './landingPageWrapper';
// import ModalContent from '../../components/modalcontent';
import { DeskTopSwapTab } from '../../components/swaptab';
import NavigationBar from '../../components/navigationbar';
import { bitcoinNetwork, litecoinNetwork } from '../../constants';
import { generateKeys, randomBytes, navigation } from '../../actions';
import { getHexString } from '../../utils';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import { boltzApi } from '../../constants';

const boltz_logo = require('../../asset/icons/scuba2.png');

// const LandingPageDeskTopContent = ({
//   classes,
//   initSwap,
//   initReverseSwap,
//   fees,
//   rates,
//   limits,
//   currencies,
//   notificationDom,
//   toggleModal,
//   isOpen,
//   webln,
//   warnings,
//   lastSwap,
// }) => {
//   const loading = currencies.length === 0;

function status2HumanReadable(str) {
  // console.log('status2HumanReadable ', str,);
  if (!str) return;
  if (str?.slice(0, 2) === 'as') {
    // Atomic Swap
    str = str.replace('as', '⬇️ ');
  }
  str = str.replace('.', ' ');
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

class LandingPageDeskTopContent extends React.Component {
  constructor() {
    super();
    this.state = {
      lnswaps: [],
      loadingSwaps: true,
    };
  }

  deleteLocalSwap = swapId => {
    if (!swapId) {
      console.log('swapId to delete is required.');
      return;
    }
    console.log('removing deleteLocalSwap ', swapId);
    localStorage.removeItem('lnswaps_' + swapId);
    window.location.reload();
  };

  componentDidMount = async () => {
    try {
      // check localstorage for swaps and list them with their states
      const lnswaps = [];
      for (const item in localStorage) {
        // console.log(`key = ${item}, value = ${localStorage[item]}`);
        if (
          item.includes('lnswaps_') &&
          localStorage[item].includes('preimageHash')
        ) {
          const swapId = item.split('lnswaps_')[1];
          if (!swapId) continue;
          const swapData = JSON.parse(localStorage[item]);
          try {
            console.log('getting swap status for ', swapId);
            const status = await this.getSwapStatus(swapId);
            if (!status) continue;
            swapData.status = status;
            swapData.statusText = status2HumanReadable(status);
            if (status === 'invoice.expired' || status === 'swap.expired') {
              swapData.buttonText = 'Failed';
            } else if (status === 'transaction.claimed') {
              swapData.buttonText = 'Finished';
            } else if (status.includes('refund')) {
              swapData.buttonText = 'Refund';
              swapData.link = '/refund';
            } else {
              swapData.buttonText = 'Continue';
              swapData.link = '/swap';
            }
            swapData.link = swapData.link + '?swapId=' + swapId;
            // TODO: check if preimagehash was refunded before
            console.log('swapId, swapData, status: ', swapId, swapData, status);
            lnswaps.push(swapData);
          } catch (error) {
            // skip - could be testnet/mainnet swaps
            // console.log('swap not found: ', error.message);
          }
        }
      }
      this.setState({ lnswaps, loadingSwaps: false });
    } catch (error) {
      console.log('error parsing lnswaps: ', error.message);
    }
  };

  getSwapStatus = async swapId => {
    const url = `${boltzApi}/swapstatus`;
    try {
      const response = await axios.post(url, {
        id: swapId,
      });
      console.log('getSwapStatus ', swapId, response.data);
      return response.data.status;
    } catch (error) {
      console.log('error ', error);
      return null;
    }
  };

  render() {
    const {
      classes,
      initSwap,
      initReverseSwap,
      fees,
      rates,
      limits,
      currencies,
      notificationDom,
      toggleModal,
      isOpen,
      webln,
      warnings,
      lastSwap,
    } = this.props;

    const loading = this.state.lnswaps.length === 0;

    return (
      <BackGround>
        <ReactNotification ref={notificationDom} />
        <NavigationBar />
        <Typography
          variant="h4"
          sx={{ m: 0.5, textAlign: 'center', color: 'white' }}
        >
          Continue Previous Swaps
        </Typography>
        <Divider sx={{ m: 2 }} />
        <View className={classes.wrapper}>
          {!this.state.loadingSwaps && this.state.lnswaps.length === 0 ? (
            <Typography variant="h5" component="div" sx={{ color: 'white' }}>
              You do not have any previous swaps on this browser yet.
            </Typography>
          ) : null}
          {loading && this.state.loadingSwaps ? (
            <View className={classes.loading}>
              <CircularProgress />
            </View>
          ) : null}
          {this.state.lnswaps.length === 0 ? null : (
            <div style={{ maxHeight: '100%' }}>
              {this.state.lnswaps.map(swap =>
                this.state.lnswaps.length > 0 ? (
                  <Card
                    variant="outlined"
                    sx={{ m: 1 }}
                    key={swap?.swapResponse?.id}
                  >
                    <CardHeader
                      title={'Swap ID: ' + swap?.swapResponse?.id}
                      subheader={
                        swap?.timestamp
                          ? new Date(swap?.timestamp).toLocaleString()
                          : ''
                      }
                    />
                    <Divider />
                    <CardContent>
                      <Typography variant="h5" component="div">
                        Status: {swap?.statusText}
                      </Typography>
                      {/* sx={{ mb: 1.5 }} color="text.secondary" */}
                      <Typography variant="body2">
                        Pair: {swap.swapInfo.pair.id}
                        <br />
                        Side: {swap.swapInfo.pair.orderSide}
                      </Typography>
                      <Typography variant="body2">
                        Base: {swap.swapInfo.baseAmount} {swap.swapInfo.base}
                      </Typography>
                      <Typography variant="body2">
                        Quote: {swap.swapInfo.quoteAmount} {swap.swapInfo.quote}
                      </Typography>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Tooltip title="Swap data will be deleted forever!">
                        <Button
                          disabled={swap.buttonText === 'Continue'}
                          onClick={() =>
                            this.deleteLocalSwap(swap?.swapResponse?.id)
                          }
                          variant="outlined"
                          color="error"
                          sx={{ mr: 1 }}
                        >
                          Delete
                        </Button>
                      </Tooltip>
                      <Button
                        disabled={
                          swap.buttonText !== 'Continue' &&
                          swap.buttonText !== 'Refund'
                        }
                        href={swap.link}
                        variant="contained"
                        className={classes.stacksButton}
                      >
                        {swap.buttonText}
                      </Button>
                    </CardActions>
                  </Card>
                ) : null
              )}
            </div>
          )}
        </View>
      </BackGround>
    );
  }
}

const styles = () => ({
  stacksButton: {
    backgroundColor: '#7a40ee',
    backgroundImage: 'linear-gradient(135deg, #5546ff, rgba(122, 64, 238, 0))',
    webkitTransition: 'background-color 200ms ease-in-out',
    transition: 'background-color 200ms ease-in-out',
  },
  carouseltext: {
    color: 'white',
    textDecoration: 'none',
  },
  carousel: {
    marginBottom: '1em',
  },
  wrapper: {
    flex: '1 0 100%',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  infoWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    '@media (min-width: 1500px)': {
      fontSize: 42,
    },
  },
  description: {
    fontSize: 32,
    '@media (min-width: 1500px)': {
      fontSize: 42,
    },
  },
  loading: {
    width: '600px',
    height: '400px',
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    // backgroundColor: '#fff',
    '@media (min-width: 1500px)': {
      width: '800px',
      height: '600px',
    },
  },
  loadingLogo: {
    width: '200px',
    height: '200px',
    display: 'block',
    marginBottom: '10px',
  },
  loadingText: {
    fontSize: '20px',
  },
});

LandingPageDeskTopContent.propTypes = {
  warnings: PropTypes.array,
  classes: PropTypes.object.isRequired,
  initSwap: PropTypes.func.isRequired,
  initReverseSwap: PropTypes.func.isRequired,
  notificationDom: PropTypes.object,
  fees: PropTypes.object.isRequired,
  rates: PropTypes.object.isRequired,
  limits: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
  toggleModal: PropTypes.func,
  isOpen: PropTypes.bool,
  webln: PropTypes.object,
  // lastSwap: PropTypes.object,
};

const LandingPageDeskTop = props => (
  <LandingPageWrapper {...props}>
    {p => <LandingPageDeskTopContent {...p} />}
  </LandingPageWrapper>
);

export default injectSheet(styles)(LandingPageDeskTop);
