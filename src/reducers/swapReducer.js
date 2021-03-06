import * as actionTypes from '../constants/actions';
import { toWholeCoins } from '../utils';

export const initialState = {
  retry: true,
  inSwapMode: false,
  webln: null,
  isFetching: false,
  swapInfo: {
    base: null,
    quote: null,
    baseAmount: null,
    quoteAmount: null,
    keys: null,
    pair: null,
    invoice: null,
    preimage: null,
    preimageHash: null,
    requestedAmount: null,
  },
  swapResponse: {},
  swapStatus: {
    error: false,
    pending: false,
    message: 'Waiting for one confirmation...',
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SWAP_REQUEST:
      return {
        ...state,
        retry: false,
        isFetching: true,
      };

    case actionTypes.SWAP_RESPONSE:
      return {
        ...state,
        isFetching: false,
        retry: true,
        swapInfo: {
          ...state.swapInfo,
          baseAmount: toWholeCoins(action.payload.response.expectedAmount),
        },
        swapResponse: action.payload,
      };

    case actionTypes.INIT_SWAP:
      return {
        ...state,
        inSwapMode: true,
        webln: action.payload.webln,
        swapInfo: {
          ...state.swapInfo,
          base: action.payload.base,
          quote: action.payload.quote,
          baseAmount: action.payload.baseAmount,
          quoteAmount: action.payload.quoteAmount,
          keys: action.payload.keys,
          pair: action.payload.pair,
          preimage: action.payload.preimage,
          preimageHash: action.payload.preimageHash,
        },
      };

    case actionTypes.SET_SWAP_INVOICE:
      return {
        ...state,
        swapInfo: {
          ...state.swapInfo,
          invoice: action.payload.invoice,
          requestedAmount: action.payload.amount,
        },
        swapStatus: {
          ...state.swapStatus,
          error: action.payload.error,
        },
      };

    case actionTypes.SET_SWAP_STATUS:
      return {
        ...state,
        swapStatus: {
          ...state.swapStatus,
          ...action.payload,
        },
      };

    case actionTypes.COMPLETE_SWAP:
      return { ...initialState };

    default:
      return state;
  }
};

export default reducer;
