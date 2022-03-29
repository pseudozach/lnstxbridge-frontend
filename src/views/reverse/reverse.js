import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { lostConnection, reconnected } from '../../constants/messages';
import View from '../../components/view';
import Prompt from '../../components/prompt';
import Loading from '../../components/loading';
import Controls from '../../components/controls';
import Confetti from '../../components/confetti';
import BackGround from '../../components/background';
import { getCurrencyName } from '../../utils';
import StepsWizard from '../../components/stepswizard';
import { notificationData } from '../../utils';
import { InputAddress, PayInvoice, LockingFunds } from './steps';
import ReactNotification from 'react-notifications-component';
import { navigation } from '../../actions';
import { Paper, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const styles = () => ({
  wrapper: {
    flex: '1 0 100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class ReverseSwap extends React.Component {
  acceptedZeroConf = false;

  constructor(props) {
    super(props);

    this.notificationDom = React.createRef();

    this.state = {
      allowZeroConf: false,
    };
  }

  componentDidMount = () => {
    this.redirectIfLoggedOut();
  };

  componentDidUpdate(prevProps) {
    const {
      swapInfo,
      swapStatus,
      swapResponse,
      isReconnecting,
      dataStorageSetId,
      swapFailResponse,
      dataStorageSetAsset,
    } = this.props;

    this.redirectIfLoggedOut();

    if (swapInfo.quote && swapInfo.quoteAmount) {
      dataStorageSetAsset({
        asset: swapInfo.quote,
        amount: swapInfo.quoteAmount,
      });
    }

    if (swapResponse.id) {
      dataStorageSetId(swapResponse.id);
    }

    if (isReconnecting && !prevProps.isReconnecting) {
      this.addNotification(lostConnection, 0);
    }
    if (!isReconnecting && prevProps.isReconnecting) {
      this.addNotification(reconnected);
    }

    if (!swapFailResponse && !isReconnecting) {
      this.addNotification(
        {
          title: 'Failed to execute reverse swap',
          message: swapStatus,
        },
        0
      );
    }
  }

  componentWillUnmount = () => {
    this.props.completeSwap();
  };

  addNotification = (message, type) => {
    this.notificationDom.current.addNotification(
      notificationData(message, type)
    );
  };

  redirectIfLoggedOut = () => {
    if (!this.props.inSwapMode) {
      navigation.navHome();
    }
  };

  render() {
    const {
      webln,
      classes,
      swapInfo,
      claimSwap,
      swapStatus,
      isFetching,
      swapResponse,
      completeSwap,
      invalidAddress,
      startReverseSwap,
      swapFailResponse,
      goTimelockExpired,
      setReverseSwapAddress,
      setReverseSwapSponsored,
      setSignedTx,
    } = this.props;

    return (
      <BackGround>
        <ReactNotification ref={this.notificationDom} />
        <Prompt />
        <View className={classes.wrapper}>
          <StepsWizard
            stage={1}
            range={4}
            id={swapResponse ? swapResponse.id : null}
            onExit={() => {
              if (window.confirm('Are you sure you want to exit')) {
                completeSwap();
                navigation.navHome();
              }
            }}
          >
            <StepsWizard.Steps>
              <StepsWizard.Step
                num={1}
                render={() => (
                  <InputAddress
                    swapInfo={swapInfo}
                    onChange={setReverseSwapAddress}
                    onCheck={setReverseSwapSponsored}
                  />
                )}
              />
              <StepsWizard.Step
                num={2}
                render={() => (
                  <PayInvoice
                    swapInfo={swapInfo}
                    swapResponse={swapResponse}
                    webln={webln}
                  />
                )}
              />
              <StepsWizard.Step
                num={3}
                render={() => (
                  <LockingFunds
                    swapInfo={swapInfo}
                    swapResponse={swapResponse}
                    swapStatus={swapStatus}
                    setSignedTx={setSignedTx}
                    setAllowZeroConf={allow => {
                      this.acceptedZeroConf = allow;

                      this.setState({
                        allowZeroConf: allow,
                      });
                    }}
                  />
                )}
              />
              <StepsWizard.Step
                num={4}
                render={() => (
                  <Confetti
                    notifie={style => (
                      <Paper
                        variant="outlined"
                        sx={{
                          m: 1,
                          py: 1,
                          mb: 2,
                          display: 'flex',
                          width: '100%',
                        }}
                        fullWidth
                      >
                        <CheckCircle
                          color="success"
                          fontSize="large"
                          sx={{ m: 1, fontSize: 36 }}
                        />
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
                          {/* Swap successful 🎉 <br /> */}
                          You sent{' '}
                          {swapInfo.baseAmount || swapResponse.baseAmount}{' '}
                          {swapInfo.base} and received {swapInfo.quoteAmount}{' '}
                          {swapInfo.quote}
                        </Typography>
                      </Paper>

                      // <span className={style}>
                      //   You sent {swapInfo.baseAmount} {swapInfo.base} and
                      //   received {swapInfo.quoteAmount} {swapInfo.quote}
                      // </span>
                    )}
                  />
                )}
              />
            </StepsWizard.Steps>
            <StepsWizard.Controls>
              <StepsWizard.Control
                num={1}
                render={props => (
                  <Controls
                    // error={invalidAddress}
                    // errorText={`Invalid ${getCurrencyName(
                    //   swapInfo.quote
                    // )} address`}
                    // errorRender={() => {}}
                    loading={!swapInfo.address && !invalidAddress}
                    loadingText={`Input a valid ${getCurrencyName(
                      swapInfo.quote
                    )} address`}
                    loadingRender={() => {}}
                    text={'Next'}
                    onPress={() => {
                      if (swapInfo.address && swapInfo.address !== '') {
                        startReverseSwap(
                          swapInfo,
                          confirmedEvent => {
                            if (!confirmedEvent || !this.acceptedZeroConf) {
                              props.nextStage();
                            }
                          },
                          goTimelockExpired
                        );
                        props.nextStage();
                      }
                    }}
                  />
                )}
              />
              <StepsWizard.Control
                num={2}
                render={props => (
                  <Controls
                    loading={isFetching && !this.state.allowZeroConf}
                    onPress={() => props.nextStage()}
                    loadingText={'Waiting for invoice to be paid...'}
                    loadingRender={() => <Loading />}
                    errorRender={() => {}}
                    error={!swapFailResponse === true}
                    errorText={`Reverse swap failed: ${swapStatus}`}
                    swapResponse={swapResponse}
                  />
                )}
              />
              <StepsWizard.Control
                num={3}
                render={props => (
                  <Controls
                    loadingText={swapStatus}
                    loading={!this.acceptedZeroConf}
                    text={'Accept 0-conf transaction'}
                    loadingRender={() => <Loading />}
                    onPress={() => {
                      if (this.acceptedZeroConf) {
                        claimSwap(props.nextStage, swapInfo, swapResponse);
                      }
                    }}
                    swapResponse={swapResponse}
                  />
                )}
              />
              <StepsWizard.Control
                num={4}
                render={() => (
                  <Controls
                    text={'Swap Again!'}
                    onPress={() => {
                      completeSwap();

                      window.onbeforeunload = () => {};
                      window.location.reload();
                    }}
                  />
                )}
              />
            </StepsWizard.Controls>
          </StepsWizard>
        </View>
      </BackGround>
    );
  }
}

ReverseSwap.propTypes = {
  classes: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isReconnecting: PropTypes.bool.isRequired,
  inSwapMode: PropTypes.bool.isRequired,
  goTimelockExpired: PropTypes.func.isRequired,
  webln: PropTypes.object,
  swapInfo: PropTypes.object,
  swapResponse: PropTypes.object,
  swapFailResponse: PropTypes.bool.isRequired,
  completeSwap: PropTypes.func,
  setReverseSwapAddress: PropTypes.func,
  setReverseSwapSponsored: PropTypes.func,
  setSignedTx: PropTypes.func,
  onExit: PropTypes.func,
  nextStage: PropTypes.func,
  startReverseSwap: PropTypes.func.isRequired,
  swapStatus: PropTypes.string.isRequired,
  invalidAddress: PropTypes.bool.isRequired,
  dataStorageSetAsset: PropTypes.func.isRequired,
  dataStorageSetId: PropTypes.func.isRequired,
  claimSwap: PropTypes.func.isRequired,
};

export default injectSheet(styles)(ReverseSwap);
