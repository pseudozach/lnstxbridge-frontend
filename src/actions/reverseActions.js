import axios from 'axios';
import EventSource from 'eventsource';
// import { Transaction, ECPair, address } from 'bitcoinjs-lib';
// import { detectSwap, constructClaimTransaction } from 'boltz-core';
import * as actionTypes from '../constants/actions';
import { boltzApi, SwapUpdateEvent } from '../constants';
import {
  toSatoshi,
  getNetwork,
  getHexBuffer,
  getFeeEstimation,
} from '../utils';

// import { bufferCV, AnchorMode, FungibleConditionCode, PostConditionMode,
//   // makeContractCall, broadcastTransaction, TxBroadcastResult, makeContractSTXPostCondition,
//   parsePrincipalString,
//   StacksMessageType,
//   PostConditionType } from '@stacks/transactions';
// import { StacksMocknet, StacksTestnet, StacksMainnet } from '@stacks/network';
// import { openContractCall } from '@stacks/connect';
// import { getHexString } from '../../../Utils';

// const BigNum = require('bn.js');
// import { BN } from 'bn.js';
// import bigInt from 'big-integer';

// let networkconf = "mocknet";
// let network = new StacksTestnet();
// if(networkconf==="mainnet"){
//   network = new StacksMainnet();
// } else if(networkconf==="mocknet") {
//   network = new StacksMocknet()
// }

// const contractAddress = Constants.stxSwapAddress.split(".")[0]
// const contractName = Constants.stxSwapAddress.split(".")[1]

let latestSwapEvent = '';

export const initReverseSwap = state => ({
  type: actionTypes.INIT_REVERSE_SWAP,
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

export const completeReverseSwap = () => ({
  type: actionTypes.COMPLETE_REVERSE_SWAP,
});

export const setReverseSwapAddress = (address, error) => ({
  type: actionTypes.SET_REVERSE_SWAP_ADDRESS,
  payload: {
    address,
    error,
  },
});

export const setReverseSwapSponsored = (isSponsored, error) => ({
  type: actionTypes.SET_REVERSE_SWAP_SPONSORED,
  payload: {
    isSponsored,
    error,
  },
});

export const setReverseSwapStatus = status => ({
  type: actionTypes.SET_REVERSE_SWAP_STATUS,
  payload: status,
});

export const reverseSwapRequest = () => ({
  type: actionTypes.REVERSE_SWAP_REQUEST,
});

export const reverseSwapResponse = (success, response) => ({
  type: actionTypes.REVERSE_SWAP_RESPONSE,
  payload: {
    success,
    response,
  },
});

export const setIsReconnecting = isReconnecting => ({
  type: actionTypes.SET_IS_RECONNECTING,
  payload: isReconnecting,
});

export const startReverseSwap = (swapInfo, nextStage, timelockExpired) => {
  const url = `${boltzApi}/createswap`;
  const { pair, keys, baseAmount } = swapInfo;

  const amount = toSatoshi(Number.parseFloat(baseAmount));

  console.log('reverseActions startReverseSwap ', swapInfo.isSponsored);

  return dispatch => {
    dispatch(reverseSwapRequest());
    axios
      .post(url, {
        type: 'reversesubmarine',
        pairId: pair.id,
        invoiceAmount: amount,
        orderSide: pair.orderSide,
        claimPublicKey: keys.publicKey,
        claimAddress: swapInfo.address,
        preimageHash: swapInfo.preimageHash,
        prepayMinerFee: swapInfo.isSponsored,
      })
      .then(response => {
        // console.log(
        //   'reverseSwapResponse data swapInfo, swapResponse, ',
        //   swapInfo,
        //   response.data
        // );
        localStorage.setItem(
          `lnswaps_${response?.data?.id}`,
          JSON.stringify({
            type: 'reverse',
            timestamp: new Date().getTime(),
            swapInfo,
            swapResponse: response.data,
          })
        );
        dispatch(reverseSwapResponse(true, response.data));

        // To set "isFetching" to true
        dispatch(reverseSwapRequest());
        startListening(
          dispatch,
          swapInfo,
          response.data,
          nextStage,
          timelockExpired
        );
      })
      .catch(error => {
        const message = error.response.data.error;
        dispatch(reverseSwapResponse(false, message));
      });
  };
};

export const claimSwap = (dispatch, nextStage, swapInfo, swapResponse) => {
  dispatch(
    getFeeEstimation(feeEstimation => {
      // console.log(
      //   'getFeeEstimation swapInfo.quote',
      //   swapInfo.quote,
      //   ' fee set to 0'
      // );
      console.log('claimswap:: ', swapInfo, swapResponse, feeEstimation);

      //       // this is not launched automatically anymore, user needs to click it from the GUI.
      //       // claimStx(swapInfo,swapResponse, nextStage)

      //       // TODO: prepare a claim tx for the user on Stacks!!!
      //       // just launch the wallet so that user can run and claim the stx

      //       // const claimTransaction = getClaimTransaction(
      //       //   swapInfo,
      //       //   swapResponse,
      //       //   feeEstimation
      //       // );

      //       // console.log("reverseactions.124 claimtx: ", claimTransaction);
      //       // dispatch(
      //       //   broadcastClaimTransaction(
      //       //     swapInfo.quote,
      //       //     claimTransaction.toHex(),
      //       //     () => {
      //       //       dispatch(reverseSwapResponse(true, swapResponse));
      //       //       nextStage();
      //       //     }
      //       //   )
      //       // );
    })
  );
};

export const setSignedTx = (dispatch, id, tx) => {
  // console.log('reverseActions setSignedTx ', dispatch, id, tx);
  broadcastSponsoredTx(dispatch, id, tx);
};

const broadcastSponsoredTx = (dispatch, id, tx) => {
  // console.log('reverseActions broadcastSponsoredTx ', id, tx, dispatch);
  const url = `${boltzApi}/broadcastsponsoredtx`;
  // return dispatch => {
  axios
    .post(url, {
      id,
      tx,
    })
    .then(res => {
      // cb()
      console.log('broadcastSponsoredTx done ', res);
      dispatch(
        reverseSwapResponse(true, {
          status: 'Transaction broadcasted',
          txId: res.data.transactionId?.transactionId,
        })
      );
    })
    .catch(error => {
      const message = error.response.data.error;
      window.alert(`Failed to broadcast claim transaction: ${message}`);
      dispatch(reverseSwapResponse(false, message));
    });
  // };
};

// const getClaimTransaction = (swapInfo, response, feeEstimation) => {
//   console.log('getClaimTransaction:: ', swapInfo, response, feeEstimation);

//   const redeemScript = getHexBuffer(response.redeemScript);
//   const lockupTransaction = Transaction.fromHex(response.transactionHex);

//   return constructClaimTransaction(
//     [
//       {
//         ...detectSwap(redeemScript, lockupTransaction),
//         redeemScript,
//         txHash: lockupTransaction.getHash(),
//         preimage: getHexBuffer(swapInfo.preimage),
//         keys: ECPair.fromPrivateKey(getHexBuffer(swapInfo.keys.privateKey)),
//       },
//     ],
//     address.toOutputScript(swapInfo.address, getNetwork(swapInfo.quote)),
//     // feeEstimation[swapInfo.quote],
//     0,
//     false
//   );
// };

// const broadcastClaimTransaction = (currency, claimTransaction, cb) => {
//   const url = `${boltzApi}/broadcasttransaction`;
//   return dispatch => {
//     axios
//       .post(url, {
//         currency,
//         transactionHex: claimTransaction,
//       })
//       .then(() => cb())
//       .catch(error => {
//         const message = error.response.data.error;

//         window.alert(`Failed to broadcast claim transaction: ${message}`);
//         dispatch(reverseSwapResponse(false, message));
//       });
//   };
// };

const handleReverseSwapStatus = (
  data,
  source,
  dispatch,
  nextStage,
  timelockExpired,
  swapInfo,
  response
) => {
  const status = data.status;

  // If this function is called with the data from the GET endpoint "/swapstatus"
  // it could be that the received status has already been handled
  if (status === latestSwapEvent) {
    return;
  } else {
    latestSwapEvent = status;
  }

  console.log('reverseactions status: ', status);
  switch (status) {
    case SwapUpdateEvent.TransactionMempool:
      console.log('reverseactions data: ', data);
      // dispatch(setReverseSwapStatus('Lockup is in mempool'));
      dispatch(
        reverseSwapResponse(true, {
          transactionId: data.transaction.id,
          transactionHex: data.transaction.hex,
        })
      );

      nextStage();
      break;

    case SwapUpdateEvent.TransactionConfirmed:
      // dont close the source - wait for invoice.settled
      // source.close();
      dispatch(setReverseSwapStatus('Transaction confirmed'));

      claimSwap(dispatch, nextStage, swapInfo, {
        ...response,
        transactionId: data.transaction.id,
        transactionHex: data.transaction.hex,
      });
      break;

    case SwapUpdateEvent.SwapExpired:
    case SwapUpdateEvent.TransactionRefunded:
      source.close();
      dispatch(timelockExpired());

      break;

    case SwapUpdateEvent.TransactionFailed:
      source.close();
      dispatch(setReverseSwapStatus('Could not send onchain coins'));
      dispatch(reverseSwapResponse(false, {}));
      break;

    case SwapUpdateEvent.InvoiceSettled:
      source.close();
      nextStage();
      break;

    case SwapUpdateEvent.MinerFeePaid:
      // dispatch(setReverseSwapStatus('Miner fee paid, waiting for hodl invoice'));
      // dispatch(reverseSwapResponse(true, {}));
      break;

    default:
      console.log(`Unknown swap status: ${JSON.stringify(data)}`);
      break;
  }
};

const startListening = (
  dispatch,
  swapInfo,
  response,
  nextStage,
  timelockExpired
) => {
  const source = new EventSource(
    `${boltzApi}/streamswapstatus?id=${response.id}`
  );

  source.onerror = () => {
    source.close();

    dispatch(setIsReconnecting(true));

    console.log(`Lost connection to Boltz`);
    const url = `${boltzApi}/swapstatus`;

    const interval = setInterval(() => {
      axios
        .post(url, {
          id: response.id,
        })
        .then(statusReponse => {
          dispatch(setIsReconnecting(false));
          clearInterval(interval);

          console.log(`Reconnected to Boltz`);

          startListening(
            dispatch,
            swapInfo,
            response,
            nextStage,
            timelockExpired
          );

          console.log('handleReverseSwapStatus interval');
          handleReverseSwapStatus(
            statusReponse.data,
            source,
            dispatch,
            nextStage,
            timelockExpired,
            swapInfo,
            response
          );
        });
    }, 1000);
  };

  source.onmessage = event => {
    // console.log("reverseactions onmessage");
    handleReverseSwapStatus(
      JSON.parse(event.data),
      source,
      dispatch,
      nextStage,
      timelockExpired,
      swapInfo,
      response
    );
  };
};

// const claimStx = async (
//   swapInfo,
//   swapResponse,
//   nextStage) => {

//   let contractAddress = swapResponse.lockupAddress.split(".")[0].toUpperCase();
//   let contractName = swapResponse.lockupAddress.split(".")[1]
//   console.log("claimStx ", contractAddress, contractName)

//   let preimage = swapInfo.preimage;
//   let amount = swapResponse.onchainAmount;
//   let timeLock = swapResponse.timeoutBlockHeight;

//     // ${getHexString(preimage)}
//   console.log(`Claiming ${amount} Stx with preimage ${preimage} and timelock ${timeLock}`);

//   // this is wrong
//   // let decimalamount = parseInt(amount.toString(),16)
//   console.log("amount, decimalamount: ", amount)
//   // let smallamount = decimalamount
//   // .div(etherDecimals)
//   // let smallamount = amount.toNumber();
//   let smallamount = parseInt(amount / 100) + 1
//   console.log("smallamount: " + smallamount)

//   // // Add an optional post condition
//   // // See below for details on constructing post conditions
//   // const postConditionAddress = contractAddress;
//   const postConditionCode = FungibleConditionCode.GreaterEqual;
//   // // new BigNum(1000000);
//   const postConditionAmount = new BN(100000);
//   // const postConditions = [
//   //   makeStandardSTXPostCondition(postConditionAddress, postConditionCode, postConditionAmount),
//   // ];

//   // With a contract principal
//   // const contractAddress = 'SPBMRFRPPGCDE3F384WCJPK8PQJGZ8K9QKK7F59X';
//   // const contractName = 'test-contract';

//   const postConditions = [
//     createSTXPostCondition(
//       // contractAddress,
//       // contractName,
//       swapResponse.lockupAddress,
//       postConditionCode,
//       postConditionAmount
//     )
//   ];

//   console.log("postConditions: " + contractAddress, contractName, postConditionCode, postConditionAmount)

//   let swapamount = smallamount.toString(16).split(".")[0] + "";
//   let paddedamount = swapamount.padStart(32, "0");
//   let paddedtimelock = timeLock.toString(16).padStart(32, "0");
//   console.log("amount, timelock ", smallamount, swapamount, paddedamount, paddedtimelock);

//   // (claimStx (preimage (buff 32)) (amount (buff 16)) (claimAddress (buff 42)) (refundAddress (buff 42)) (timelock (buff 16)))
//   const functionArgs = [
//     // bufferCV(Buffer.from('4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a', 'hex')),
//     bufferCV(Buffer.from(preimage,'hex')),
//     bufferCV(Buffer.from(paddedamount,'hex')),
//     bufferCV(Buffer.from('01','hex')),
//     bufferCV(Buffer.from('01','hex')),
//     bufferCV(Buffer.from(paddedtimelock,'hex')),
//   ];
//   console.log("stacks cli claim.154 functionargs: " + JSON.stringify(functionArgs));

//   // const functionArgs = [
//   //   bufferCV(preimageHash),
//   //   bufferCV(Buffer.from('00000000000000000000000000100000','hex')),
//   //   bufferCV(Buffer.from('01','hex')),
//   //   bufferCV(Buffer.from('01','hex')),
//   //   bufferCV(Buffer.from('000000000000000000000000000012b3','hex')),
//   // ];

//   const txOptions = {
//     contractAddress: contractAddress,
//     contractName: contractName,
//     functionName: 'claimStx',
//     functionArgs: functionArgs,
//     // validateWithAbi: true,
//     network,
//     postConditionMode: PostConditionMode.Allow,
//     postConditions,
//     anchorMode: AnchorMode.Any,
//     onFinish: data => {
//       console.log('Stacks claim onFinish:', JSON.stringify(data));
//       reverseSwapResponse(true, swapResponse);
//       nextStage();
//     },
//     onCancel: data => {
//       console.log('Stacks claim onCancel:', JSON.stringify(data));
//       reverseSwapResponse(false, swapResponse);
//       nextStage();
//     }
//   };

//   // this.toObject(txOptions)
//   // console.log("stackscli claim.170 txOptions: " + JSON.stringify(txOptions));
//   await openContractCall(txOptions);

//   // const transaction = await makeContractCall(txOptions);
//   // return broadcastTransaction(transaction, network);

//   // this is from connect
//   // return await openContractCall(txOptions);

//   // return this.etherSwap.lock(preimageHash, claimAddress, timeLock, {
//   //   value: amount,
//   //   gasPrice: await getGasPrice(this.etherSwap.provider),
//   // });
// }

// const createSTXPostCondition = (principal, conditionCode, amount) => {
//   if (typeof principal === 'string') {
//       principal = parsePrincipalString(principal);
//   }
//   return {
//       type: StacksMessageType.PostCondition,
//       conditionType: PostConditionType.STX,
//       principal,
//       conditionCode,
//       amount: intToBN(amount, false),
//   };
// }
// const intToBytes = (value, signed, byteLength) => {
//   return intToBN(value, signed).toArrayLike(Buffer, 'be', byteLength);
// }
// const intToBN = (value, signed) => {
//   const bigInt = intToBigInt(value, signed);
//   return new BN(bigInt.toString());
// }
// const intToBigInt = (value, signed) => {
//   if (typeof value === 'number') {
//       if (!Number.isInteger(value)) {
//           throw new RangeError(`Invalid value. Values of type 'number' must be an integer.`);
//       }
//       // console.log("156")
//       // return 157;
//       return bigInt(value);
//   }
//   if (typeof value === 'string') {
//       if (value.toLowerCase().startsWith('0x')) {
//           let hex = value.slice(2);
//           hex = hex.padStart(hex.length + (hex.length % 2), '0');
//           value = Buffer.from(hex, 'hex');
//       }
//       else {
//           try {
//             // return 168;
//               return bigInt(value);
//           }
//           catch (error) {
//               if (error instanceof SyntaxError) {
//                   throw new RangeError(`Invalid value. String integer '${value}' is not finite.`);
//               }
//           }
//       }
//   }
//   if (typeof value === 'bigint') {
//       return value;
//   }
//   if (value instanceof Uint8Array || Buffer.isBuffer(value)) {
//       if (signed) {
//           const bn = new BN(value, 'be').fromTwos(value.byteLength * 8);
//           // return 184;
//           return bigInt(bn.toString());
//       }
//       else {
//           // return 188;
//           return bigInt(new BN(value, 'be').toString());
//       }
//   }
//   if (value instanceof BN || BN.isBN(value)) {
//       // return 193;
//       return bigInt(value.toString());
//   }
//   throw new TypeError(`Invalid value type. Must be a number, bigint, integer-string, hex-string, BN.js instance, or Buffer.`);
// }
