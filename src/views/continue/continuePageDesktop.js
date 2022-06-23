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
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
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

class LandingPageDeskTopContent extends React.Component {
  constructor() {
    super();
    this.state = {
      lnswaps: [],
    };
  }

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
          if (!swapId) return;
          const swapData = JSON.parse(localStorage[item]);
          const status = await this.getSwapStatus(swapId);
          swapData.status = status;
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
          console.log('swapId, swapData, status: ', swapId, swapData, status);
          lnswaps.push(swapData);
        }
      }
      this.setState({ lnswaps });
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
      // console.log('getSwapStatus ', swapId, response.data);
      return response.data.status;
    } catch (error) {
      console.log('error ', error);
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
        <Typography variant="h3" sx={{ textAlign: 'center', color: 'white' }}>
          Continue Previous Swaps
        </Typography>
        <View className={classes.wrapper}>
          {loading ? (
            <View className={classes.loading}>
              <CircularProgress />
            </View>
          ) : (
            <div style={{ maxHeight: '100%' }}>
              {this.state.lnswaps.map(swap =>
                this.state.lnswaps.length > 0 ? (
                  <Card
                    variant="outlined"
                    sx={{ m: 1, width: '100%' }}
                    key={swap?.swapResponse?.id}
                  >
                    <CardContent>
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        Swap ID: {swap?.swapResponse?.id}
                      </Typography>
                      <Typography variant="h5" component="div">
                        Status: {swap?.status}
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
                    <CardActions>
                      <Button
                        size="small"
                        disabled={
                          swap.buttonText !== 'Continue' &&
                          swap.buttonText !== 'Refund'
                        }
                        href={swap.link}
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

const styles = theme => ({
  carouseltext: {
    color: 'white',
    textDecoration: 'none',
  },
  carousel: {
    marginBottom: '1em',
  },
  wrapper: {
    flex: '1 0 100%',
    alignItems: 'center',
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
