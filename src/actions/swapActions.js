import axios from 'axios';
import EventSource from 'eventsource';
import { boltzApi, SwapUpdateEvent } from '../constants';
import * as actionTypes from '../constants/actions';

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

export const startSwap = (swapInfo, cb) => {
  const url = `${boltzApi}/createswap`;
  let { pair, invoice, keys, preimageHash, quoteAmount } = swapInfo;

  // Trim the "lightning:" prefix, that some wallets add in front of their invoices, if it exists
  if (invoice.slice(0, 10) === 'lightning:') {
    invoice = invoice.slice(10);
  }
  console.log('atomic swap swapInfo', pair, swapInfo);

  let reqobj;
  if (pair.id == 'BTC/STX' && invoice.toLowerCase().slice(0, 4) !== 'lnbc') {
    reqobj = {
      type: 'submarine',
      pairId: pair.id,
      orderSide: pair.orderSide,
      claimAddress: invoice,
      refundPublicKey: keys.publicKey,
      preimageHash,
      requestedAmount: parseInt(quoteAmount * 1000000) + '',
    };
  } else {
    reqobj = {
      type: 'submarine',
      pairId: pair.id,
      orderSide: pair.orderSide,
      invoice: invoice,
      refundPublicKey: keys.publicKey,
    };
  }


  return dispatch => {
    dispatch(swapRequest());
    console.log("submarine swap request: refundPublicKey", keys.publicKey);
    axios
      .post(url, reqobj)
      .then(response => {
        console.log('1esponse data ', response.data);
        dispatch(swapResponse(true, response.data));
        console.log('2response data ', response.data);
        startListening(dispatch, response.data.id, cb);
        console.log('3response data ', response.data);
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
  console.log('handleSwapStatus ', status);

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
      source.close();
      dispatch(
        setSwapStatus({
          error: true,
          pending: false,
          message: 'Could not pay invoice. Please refund your coins.',
        })
      );
      break;

    case SwapUpdateEvent.SwapExpired:
      source.close();
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
      source.close();
      callback();
      break;

    case SwapUpdateEvent.ASTransactionMempool:
    case SwapUpdateEvent.TransactionMempool:
      console.log('got mempool');
      dispatch(
        setSwapStatus({
          pending: true,
          message: 'Transaction is in mempool...',
        })
      );
      break;

    case SwapUpdateEvent.ASTransactionConfirmed:
      console.log('got asconfirmed');
      dispatch(
        setSwapStatus({
          pending: true,
          message: 'Atomic Swap is ready',
        })
      );
      break;

    default:
      console.log(`Unknown swap status: ${JSON.stringify(data)}`);
      break;
  }
};

export const startListening = (dispatch, swapId, callback) => {
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
      console.log('interval');
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
