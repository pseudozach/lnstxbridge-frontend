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

const boltz_logo = require('../../asset/icons/scuba2.png');

const LandingPageDeskTopContent = ({
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
}) => {
  const loading = currencies.length === 0;

  // let ls = await lastSwap();
  // console.log(`landingpagedesktop.41 `, lastSwap);

  // <View className={classes.infoWrapper}>
  // <p className={classes.title}>
  //     LN - SOV bridge is a fork of the excellent<br /> boltz.exchange.
  //   </p>
  //   <p className={classes.title}>
  //     Instant, Account-Free & <br /> Non-Custodial.
  //   </p>
  //   <p className={classes.description}>
  //     Trading <br />
  //     <b>{`Shouldn't`}</b>
  //     <br />
  //     Require
  //     <br />
  //     An Account.
  //   </p>
  //   <Button text="WHY?" onPress={() => toggleModal()} />
  //   <ModalComponent isOpen={isOpen} onClose={toggleModal}>
  //     <ModalContent />
  //   </ModalComponent>
  // </View>

  return (
    <BackGround>
      <ReactNotification ref={notificationDom} />
      {/* <Carousel
        autoFocus={false}
        autoPlay={false}
        showArrows={false}
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        className={classes.topCarousel}
      >
        <div>
          <p>System Status: Under Maintenance. Please do not start swaps until maintenance is finished.</p>
          <a
            href={
              'https://discord.gg/r5YXZnARGc'
            }
            target="_blank"
            className={classes.topCarouseltext}
            rel="noreferrer"
          >
            Join Discord for Support
          </a>
        </div>
      </Carousel> */}
      <NavigationBar />
      <View className={classes.wrapper}>
        {loading ? (
          <View className={classes.loading}>
            {/* <img alt="logo" src={boltz_logo} className={classes.loadingLogo} />
            <p className={classes.loadingText}>Loading...</p> */}
            <CircularProgress />
          </View>
        ) : (
          <DeskTopSwapTab
            warnings={warnings}
            onPress={state => {
              const keys = generateKeys(
                state.base === 'BTC' ? bitcoinNetwork : litecoinNetwork
              );

              const preimage = randomBytes(32);
              // console.log("generated preimage: ", preimage);
              console.log(
                'preimage, preimagehash: ',
                getHexString(preimage),
                getHexString(crypto.sha256(preimage))
              );

              if (state.isReverseSwap) {
                initReverseSwap({
                  ...state,
                  keys,
                  webln,
                  preimage: getHexString(preimage),
                  preimageHash: getHexString(crypto.sha256(preimage)),
                });

                navigation.navReverseSwap();
              } else {
                initSwap({
                  ...state,
                  keys,
                  webln,
                  preimage: getHexString(preimage),
                  preimageHash: getHexString(crypto.sha256(preimage)),
                });

                navigation.navSwap();
              }
            }}
            fees={fees}
            rates={rates}
            limits={limits}
            currencies={currencies}
          />
        )}
      </View>
      <Carousel
        autoFocus={false}
        autoPlay={false}
        showArrows={false}
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        className={classes.carousel}
      >
        <div>
          {/* <img src="asset/scuba1.png" /> */}
          {/* <p className="legend">Previous Swap Details: </p> */}
          <a
            href={lastSwap.link}
            target="_blank"
            className={classes.carouseltext}
            rel="noreferrer"
          >
            Previous Swap Amount: {lastSwap.amount} STX 🔄
          </a>
        </div>
      </Carousel>
    </BackGround>
  );
};

const styles = theme => ({
  carouseltext: {
    color: 'white',
    textDecoration: 'none',
  },
  carousel: {
    marginBottom: '1em',
  },
  topCarousel: {
    padding: '1em',
    backgroundColor: 'white',
    color: 'black !important',
    // fontSize: '14px',
  },
  topCarouseltext: {
    color: 'black',
    // textDecoration: 'none',
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
