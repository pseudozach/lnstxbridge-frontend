import axios from 'axios';
import EventSource from 'eventsource';
import { boltzApi, SwapUpdateEvent } from '../constants';
import * as actionTypes from '../constants/actions';
import { Transaction, ECPair, address, networks } from 'bitcoinjs-lib';
import { detectSwap, constructClaimTransaction } from 'boltz-core';
import {
  // toSatoshi,
  getNetwork,
  getHexBuffer,
  getFeeEstimation,
} from '../utils';

export const completeSwap = () => {
  return {
    type: actionTypes.COMPLETE_SWAP,
  };
};

export const initSwap = state => ({
  type: actionTypes.INIT_SWAP,
  payload: {
    webln: state.webln,
    base: state.base,
    quote: state.quote,
    baseAmount: state.baseAmount,
    quoteAmount: state.quoteAmount,
    keys: state.keys,
    pair: state.pair,
    preimage: state.preimage,
    preimageHash: state.preimageHash,
  },
});

export const setSwapInvoice = (invoice, error) => ({
  type: actionTypes.SET_SWAP_INVOICE,
  payload: {
    invoice,
    error,
  },
});

export const setSwapStatus = status => ({
  type: actionTypes.SET_SWAP_STATUS,
  payload: status,
});

export const swapResponse = (success, response) => ({
  type: actionTypes.SWAP_RESPONSE,
  payload: {
    success,
    response,
  },
});

export const swapRequest = () => ({
  type: actionTypes.SWAP_REQUEST,
});

export const continueSwap = (swapData, nextStage, cb) => {
  return dispatch => {
    console.log(
      'swapActions.61 continueSwap ',
      dispatch,
      swapData, // = swapResponse
      cb,
      nextStage
      // swapData.swapResponse.id,
      // 'calling startListening, ',
      // startListening
    );
    axios
      .post(`${boltzApi}/swapstatus`, {
        id: swapData.id,
      })
      .then(statusReponse => {
        console.log(`swapActions.77 continueSwap manual swap status update`);
        handleSwapStatus(statusReponse.data, null, dispatch, null);
      });

    startListening(dispatch, swapData.id, cb);
    dispatch(swapResponse(true, swapData));
    nextStage();
  };
};

export const startSwap = (swapInfo, cb) => {
  const url = `${boltzApi}/createswap`;
  let {
    pair,
    invoice,
    keys,
    preimageHash,
    quoteAmount,
    baseAmount,
    maxFeePercent,
  } = swapInfo;

  // Trim the "lightning:" prefix, that some wallets add in front of their invoices, if it exists
  if (invoice.slice(0, 10) === 'lightning:') {
    invoice = invoice.slice(10);
  }
  // console.log('swapActions.91 swap swapInfo', pair, swapInfo, cb);

  let reqobj;
  if (
    (pair.id == 'BTC/STX' || pair.id == 'BTC/USDA' || pair.id == 'BTC/XUSD') &&
    invoice.toLowerCase().slice(0, 2) !== 'ln'
  ) {
    reqobj = {
      type: 'submarine',
      pairId: pair.id,
      orderSide: pair.orderSide,
      claimAddress: invoice,
      refundPublicKey: keys.publicKey,
      preimageHash,
      requestedAmount: parseInt(quoteAmount * 1000000) + '',
      baseAmount: baseAmount,
      quoteAmount: quoteAmount,
      maxFeePercent: maxFeePercent || '5',
    };
  } else {
    reqobj = {
      type: 'submarine',
      pairId: pair.id,
      orderSide: pair.orderSide,
      invoice: invoice,
      refundPublicKey: keys.publicKey,
      channel: { auto: true, private: false, inboundLiquidity: 50 },
      maxFeePercent: maxFeePercent || '5',
    };
  }

  return dispatch => {
    dispatch(swapRequest());
    // console.log('submarine swap request: refundPublicKey', keys.publicKey);
    axios
      .post(url, reqobj)
      .then(response => {
        // console.log(
        //   '1esponse data swapInfo, swapResponse, ',
        //   swapInfo,
        //   response.data
        // );
        localStorage.setItem(
          `lnswaps_${response?.data?.id}`,
          JSON.stringify({
            type: 'swap',
            timestamp: new Date().getTime(),
            swapInfo,
            swapResponse: response.data,
          })
        );
        dispatch(swapResponse(true, response.data));
        // console.log('2response data ', response.data);
        startListening(dispatch, response.data.id, cb);
        // console.log('3response data ', response.data);
        cb();
      })
      .catch(error => {
        console.log('catch error: ', error);
        const message = error.response.data.error;

        window.alert(`Failed to execute swap: ${message}`);
        dispatch(swapResponse(false, message));
      });
  };
};

const handleSwapStatus = (data, source, dispatch, callback) => {
  const status = data.status;
  console.log('handleSwapStatus ', data);

  let swapStatusObj;
  switch (status) {
    case SwapUpdateEvent.TransactionConfirmed:
      dispatch(
        setSwapStatus({
          pending: true,
          message: 'Waiting for invoice to be paid...',
        })
      );
      break;

    case SwapUpdateEvent.InvoiceFailedToPay:
      if (source) source.close();
      dispatch(
        setSwapStatus({
          error: true,
          pending: false,
          message: 'Could not pay invoice. Please refund your coins.',
        })
      );
      break;

    case SwapUpdateEvent.TransactionRefunded:
    case SwapUpdateEvent.SwapExpired:
      if (source) source.close();
      dispatch(
        setSwapStatus({
          error: true,
          pending: false,
          message: 'Swap expired. Please refund your coins.',
        })
      );
      break;

    case SwapUpdateEvent.InvoicePaid:
    case SwapUpdateEvent.TransactionClaimed:
      if (source) source.close();
      if (callback) callback();
      break;

    case SwapUpdateEvent.TransactionMempool:
      // console.log('got mempool');
      // eslint-disable-next-line no-case-declarations
      swapStatusObj = {
        pending: true,
        message: 'Transaction is in mempool...',
      };
      if (data.transaction) {
        swapStatusObj.transaction = data.transaction;
      }
      dispatch(setSwapStatus(swapStatusObj));
      break;

    case SwapUpdateEvent.ASTransactionMempool:
      console.log('got ASTransactionMempool');
      // eslint-disable-next-line no-case-declarations
      swapStatusObj = {
        pending: true,
        message: 'Transaction is in asmempool...',
      };
      if (data.transaction) {
        swapStatusObj.transaction = data.transaction;
      }
      dispatch(setSwapStatus(swapStatusObj));
      break;

    case SwapUpdateEvent.ASTransactionConfirmed:
      console.log('got asconfirmed');
      swapStatusObj = {
        pending: true,
        message: 'Atomic Swap is ready',
      };
      if (data.transaction) {
        swapStatusObj.transaction = data.transaction;
      }
      dispatch(setSwapStatus(swapStatusObj));
      break;

    case SwapUpdateEvent.TransactionFailed:
      dispatch(
        setSwapStatus({
          error: true,
          pending: false,
          message:
            'Atomic Swap coins could not be sent. Please refund your coins.',
        })
      );
      break;

    case SwapUpdateEvent.TransactionLockupFailed:
      dispatch(
        setSwapStatus({
          error: true,
          pending: false,
          message: 'Lockup failed. Please refund your coins.',
        })
      );
      break;

    case SwapUpdateEvent.ChannelCreated:
      dispatch(
        setSwapStatus({
          pending: true,
          message: 'Channel is being created...',
        })
      );
      break;

    default:
      console.log(`Unknown swap status: ${JSON.stringify(data)}`);
      break;
  }
};

export const startListening = (dispatch, swapId, callback) => {
  // console.log(
  //   'swapActions.276 startListening to ',
  //   `${boltzApi}/streamswapstatus?id=${swapId}`
  // );
  const source = new EventSource(`${boltzApi}/streamswapstatus?id=${swapId}`);

  dispatch(
    setSwapStatus({
      pending: true,
      message: 'Waiting for one confirmation...',
    })
  );

  source.onerror = () => {
    source.close();

    console.log(`Lost connection to Boltz`);
    const url = `${boltzApi}/swapstatus`;

    const interval = setInterval(() => {
      // console.log('interval');
      axios
        .post(url, {
          id: swapId,
        })
        .then(statusReponse => {
          clearInterval(interval);

          console.log(`Reconnected to Boltz`);

          startListening(dispatch, swapId, callback);
          handleSwapStatus(statusReponse.data, source, dispatch, callback);
        });
    }, 1000);
  };

  source.onmessage = event => {
    // console.log('onmessage: ', event);
    handleSwapStatus(JSON.parse(event.data), source, dispatch, callback);
  };
};

// atomic swap claim bitcoin utxo
export const claimSwap = (
  dispatch,
  // nextStage,
  swapInfo,
  swapResponse,
  swapStatus
) => {
  dispatch(
    getFeeEstimation(feeEstimation => {
      // console.log(
      //   'getFeeEstimation swapInfo.quote',
      //   swapInfo.quote,
      //   ' fee set to 0'
      // );
      // console.log('claimswap dispatch ', dispatch);
      // console.log('claimswap nextStage ', nextStage);
      console.log('claimswap swapinfo ', swapInfo);
      console.log('claimswap swapResponse ', swapResponse);
      console.log('claimswap feeEstimation ', feeEstimation);
      console.log('claimswap swapStatus ', swapStatus);
      // console.log(
      //   'claimswap:: ',
      //   swapInfo,
      //   swapResponse,
      //   feeEstimation.data,
      //   swapStatus
      // );

      // this is not launched automatically anymore, user needs to click it from the GUI.
      // claimStx(swapInfo,swapResponse, nextStage)

      // TODO: prepare a claim tx for the user on Stacks!!!
      // just launch the wallet so that user can run and claim the stx

      const claimTransaction = getClaimTransaction(
        swapInfo,
        swapResponse,
        feeEstimation,
        swapStatus
      );

      console.log('swapactions.124 claimtx: ', claimTransaction);
      console.log('swapactions.124 claimtx getId: ', claimTransaction.getId());
      console.log(
        'swapactions.124 claimtx getHash: ',
        claimTransaction.getHash()
      );
      dispatch(
        broadcastClaimTransaction(
          swapInfo.quote,
          claimTransaction.toHex(),
          () => {
            console.log('swapactions.253 dispatch?', swapResponse);
            // dispatch(reverseSwapResponse(true, swapResponse));
            // nextStage();
          }
        )
      );
    })
  );
};

// response
const getClaimTransaction = (
  swapInfo,
  swapResponse,
  feeEstimation,
  swapStatus
) => {
  // console.log(
  //   'getClaimTransaction:: ',
  //   swapInfo,
  //   // response,
  //   feeEstimation,
  //   swapStatus
  // );

  console.log('swapInfo.redeemScript ', swapResponse.redeemScript);
  const redeemScript = getHexBuffer(swapResponse.redeemScript);

  // response.transactionHex
  console.log('swapStatus.transaction.hex ', swapStatus.transaction.hex);
  const lockupTransaction = Transaction.fromHex(swapStatus.transaction.hex);
  console.log('lockupTransaction ', lockupTransaction);

  // find the script and value
  let myoutput;
  for (let index = 0; index < lockupTransaction.outs.length; index++) {
    const item = lockupTransaction.outs[index];
    if (item.value === swapResponse.quoteAmount * 100000000) {
      myoutput = item;
      // console.log('found myoutput ', myoutput);
      myoutput.vout = index;
    }
  }
  // const myoutput = lockupTransaction.outs.find(
  //   item => item.value === swapResponse.quoteAmount * 100000000
  // );
  console.log('found myoutput ', myoutput);

  console.log(
    'swapInfo.preimage ',
    swapInfo.preimage,
    swapInfo.keys.privateKey,
    swapResponse.timeoutBlockHeight,
    feeEstimation[swapInfo.quote],
    lockupTransaction.getHash(),
    lockupTransaction,
    // ECPair.fromPrivateKey(getHexBuffer(swapInfo.keys.privateKey)),
    getNetwork(swapInfo.quote)
    // networks.regtest,
    // address.toOutputScript(swapInfo.invoice, networks.regtest),
  );

  console.log(
    'constructClaimTransaction inputs',
    lockupTransaction,
    detectSwap(redeemScript, lockupTransaction), // -> undefined!!!
    redeemScript,
    swapInfo.invoice,
    swapInfo.quote,
    getNetwork(swapInfo.quote)
    // address.toOutputScript(swapInfo.invoice, getNetwork(swapInfo.quote)), // replace getNetwork with networks.regtest
    // address.toOutputScript(swapInfo.invoice, networks.regtest),
  );

  let destinationScript;
  if (process.env.REACT_APP_STACKS_NETWORK_TYPE === 'mocknet') {
    destinationScript = address.toOutputScript(
      swapInfo.invoice,
      networks.regtest
    );
  } else {
    destinationScript = address.toOutputScript(
      swapInfo.invoice,
      getNetwork(swapInfo.quote)
    );
  }

  return constructClaimTransaction(
    [
      {
        ...detectSwap(redeemScript, lockupTransaction),
        // vout: myoutput.vout,
        // value: myoutput.value,
        // script: myoutput.script, // need this somehow
        // type: lockupTransaction.version,

        redeemScript,
        txHash: lockupTransaction.getHash(),
        preimage: getHexBuffer(swapInfo.preimage),
        keys: ECPair.fromPrivateKey(getHexBuffer(swapInfo.keys.privateKey)),
      },
    ],
    // swapInfo.address
    destinationScript,
    // address.toOutputScript(swapInfo.invoice, getNetwork(swapInfo.quote)), // mainnet
    // address.toOutputScript(swapInfo.invoice, networks.regtest), // on regtest!
    feeEstimation[swapInfo.quote]
    // false
    // swapResponse.timeoutBlockHeight // -> only for refund tx
    // 0
  );
};

const broadcastClaimTransaction = (currency, claimTransaction, cb) => {
  const url = `${boltzApi}/broadcasttransaction`;
  return dispatch => {
    axios
      .post(url, {
        currency,
        transactionHex: claimTransaction,
      })
      .then(() => cb())
      .catch(error => {
        const message = error.response.data.error;

        window.alert(`Failed to broadcast claim transaction: ${message}`);
        // dispatch(reverseSwapResponse(false, message));
        dispatch();
      });
  };
};
