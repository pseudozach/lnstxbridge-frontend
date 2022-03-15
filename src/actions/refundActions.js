import axios from 'axios';
import qrcodeParser from 'qrcode-parser';
import { ECPair, address, Transaction, networks } from 'bitcoinjs-lib';
import { constructRefundTransaction, detectSwap } from 'boltz-core';
import { boltzApi, stacksNetworkType } from '../constants';
import * as actionTypes from '../constants/actions';
import {
  getHexBuffer,
  getNetwork,
  getFeeEstimation,
  getExplorer,
} from '../utils';

let apiUrl = process.env.REACT_APP_STACKS_API;
if(stacksNetworkType==="testnet"){
  apiUrl = 'https://stacks-node-api.testnet.stacks.co'
} else if(stacksNetworkType==="mainnet"){
  apiUrl = 'https://stacks-node-api.mainnet.stacks.co'
}

const verifyRefundFile = (fileJSON, keys) => {
  const verify = keys.every(key =>
    Object.prototype.hasOwnProperty.call(fileJSON, key)
  );

  return verify;
};

export const completeRefund = () => {
  return {
    type: actionTypes.COMPLETE_REFUND,
  };
};

export const setRefundFile = file => {
  return dispatch => {
    qrcodeParser(file).then(res => {
      const fileJson = JSON.parse(res.data);
      console.log("setRefundFile: ", fileJson);

      const verifyFile = verifyRefundFile(fileJson, [
        'currency',
        // 'preimageHash',
        'amount',
        // 'redeemScript',
        // 'privateKey',
        'timeoutBlockHeight',
        'contract',
      ]);

      dispatch({
        type: actionTypes.SET_REFUND_FILE,
        payload: verifyFile ? fileJson : {},
      });

      // console.log("setTransactionHash");
      dispatch({
        type: actionTypes.SET_REFUND_TXHASH,
        payload: "dummyvalue",
      });

      if(fileJson.currency !== 'BTC') {
        setTransactionHash("dummyvalue");
      }
      
    });
  };
};

export const setRefundFromTx = txId => {
  return dispatch => {
    // check txData from stacks API
    axios.get(`${apiUrl}/extended/v1/tx/${txId}`).then(tx => {
      if(tx.data && tx.data.contract_call && tx.data.tx_status === 'success' && tx.data.contract_call.function_name === 'lockStx') {
        let refundFile = {};
        refundFile.currency = 'STX';
        refundFile.preimageHash = tx.data.contract_call.function_args[0].repr.slice(2);
        refundFile.amount = parseInt(tx.data.contract_call.function_args[1].repr,16);
        refundFile.timeoutBlockHeight = parseInt(tx.data.contract_call.function_args[4].repr,16);
        refundFile.contract = tx.data.contract_call.contract_id;
  
        const verifyFile = verifyRefundFile(refundFile, [
          'currency',
          // 'preimageHash',
          'amount',
          // 'redeemScript',
          // 'privateKey',
          'timeoutBlockHeight',
          'contract',
        ]);
  
        console.log("setRefundFile, verifyFile: ", refundFile, verifyFile);

        dispatch({
          type: actionTypes.SET_REFUND_FILE,
          payload: verifyFile ? refundFile : {},
        });
  
        // console.log("setTransactionHash");
        dispatch({
          type: actionTypes.SET_REFUND_TXHASH,
          payload: "dummyvalue",
        });
  
        if(refundFile.currency !== 'BTC') {
          setTransactionHash("dummyvalue");
        }
  
      } else {
        console.log('setRefundFromTx failed ', tx.data);
        dispatch({
          type: actionTypes.SET_REFUND_FILE,
          payload: {},
        });
      }
    })
    .catch(error => {
      console.log('setRefundFromTx failed with error ', error.message);
      dispatch({
        type: actionTypes.SET_REFUND_FILE,
        payload: {},
      });
    })

  };
};

export const setTransactionHash = hash => ({
  type: actionTypes.SET_REFUND_TXHASH,
  payload: hash,
});

export const setDestinationAddress = address => ({
  type: actionTypes.SET_REFUND_DESTINATION,
  payload: address,
});

export const setRefundTransactionHash = hash => ({
  type: actionTypes.SET_REFUND_TRANSACTION_HASH,
  payload: hash,
});

export const refundRequest = () => ({
  type: actionTypes.REFUND_REQUEST,
});

export const refundResponse = (success, response) => ({
  type: actionTypes.REFUND_RESPONSE,
  payload: {
    success,
    response,
  },
});

const createRefundTransaction = (
  refundFile,
  response,
  destinationAddress,
  currency,
  feeEstimation
) => {
  const redeemScript = getHexBuffer(refundFile.redeemScript);
  const lockupTransaction = Transaction.fromHex(response.data.transactionHex);
  
  const timeoutBlockHeight = refundFile.swapResponse.origBlockHeight;
  console.log('createRefundTransaction redeemScript lockupTransaction address refundFile.timeoutBlockHeight', 
    redeemScript, 
    lockupTransaction, 
    // address.toOutputScript(destinationAddress, getNetwork(currency)), 
    // networks.regtest,
    timeoutBlockHeight);

  // TODO: make sure the provided lockup transaction hash was correct and show more specific error if not
  return {
    refundTransaction: constructRefundTransaction(
      [
        {
          redeemScript,
          txHash: lockupTransaction.getHash(),
          keys: ECPair.fromPrivateKey(getHexBuffer(refundFile.privateKey)),
          ...detectSwap(redeemScript, lockupTransaction),
        },
      ],
      address.toOutputScript(destinationAddress, getNetwork(currency)), // mainnet
      // address.toOutputScript(destinationAddress, networks.regtest), // regtest
      // refundFile.timeoutBlockHeight,
      timeoutBlockHeight,
      feeEstimation[currency]
    ),
    lockupTransactionId: lockupTransaction.getId(),
  };
};

export const startRefund = (
  refundFile,
  transactionHash,
  destinationAddress,
  cb
) => {
  console.log('enter startRefund ', refundFile, transactionHash, destinationAddress, cb);
  const url = `${boltzApi}/gettransaction`;
  const currency = refundFile.currency;

  // we dont send tx to backend to broadcast, instead user triggers refund via hiro wallet
  // console.log("startRefund: ",destinationAddress)

  return dispatch => {
    // just set the refundtx explorer link and we're all done.
    dispatch({
      type: actionTypes.SET_REFUND_TRANSACTION_HASH,
      payload: destinationAddress,
    });

    dispatch(refundRequest());

    // go to nextstage
    // cb();

    axios
      .post(url, {
        currency,
        transactionId: transactionHash,
      })
      .then(response => {
        dispatch(
          getFeeEstimation(feeEstimation => {
            const {
              refundTransaction,
              lockupTransactionId,
            } = createRefundTransaction(
              refundFile,
              response,
              destinationAddress,
              currency,
              feeEstimation
            );

            dispatch(setRefundTransactionHash(refundTransaction.getId()));
            dispatch(
              broadcastRefund(
                currency,
                refundTransaction.toHex(),
                lockupTransactionId,
                () => {
                  dispatch(refundResponse(true, response.data));

                  cb();
                }
              )
            );
          })
        );
      })
      .catch(error => {
        const message = error.response.data.error;

        window.alert(`Failed to refund swap: ${message}`);
        dispatch(refundResponse(false, message));
      });
  };
};

const broadcastRefund = (currency, transactionHex, lockupTransactionId, cb) => {
  console.log('broadcastRefund ', transactionHex, lockupTransactionId)
  const url = `${boltzApi}/broadcasttransaction`;
  return dispatch => {
    dispatch(refundRequest());
    axios
      .post(url, {
        currency,
        transactionHex,
      })
      .then(() => cb())
      .catch(response => {
        const error = response.response.data.error;
        let message = `Failed to broadcast refund transaction: ${error}`;

        if (
          error ===
          'please wait until your lockup transaction has 10 confirmations before you try to refund'
        ) {
          message +=
            '. Click OK to open the lockup transaction in a block explorer';

          const openExplorer = window.confirm(message);
          if (openExplorer) {
            window.open(
              `${getExplorer(currency)}/${lockupTransactionId}`,
              '_blank'
            );
          }
        } else {
          window.alert(message);
        }
        dispatch(refundResponse(false, message));
      });
  };
};
