import React from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import View from '../../../components/view';
import { stacksNetworkType } from '../../../constants';
import InputArea from '../../../components/inputarea';
import { getCurrencyName, getSampleAddress } from '../../../utils';

import { Button as SButton, Box } from '@stacks/ui'
import { MdFileDownload } from 'react-icons/md';

// import lightningPayReq from 'bolt11';
// StacksMainnet
import { StacksTestnet, StacksMocknet, StacksMainnet } from '@stacks/network';
import { openContractCall } from '@stacks/connect';
import {
  bufferCV,
  // makeStandardSTXPostCondition,
  FungibleConditionCode,
  // PostConditionMode,
  // createSTXPostCondition,
  parsePrincipalString,
  StacksMessageType,
  PostConditionType,
  createContractPrincipal,
  createAssetInfo,
  makeContractFungiblePostCondition,
  contractPrincipalCV,
} from '@stacks/transactions';

import axios from 'axios';

import bigInt from 'big-integer';
import { BN } from 'bn.js';

let mocknet = new StacksMocknet({ url: process.env.REACT_APP_STACKS_API });
// mocknet.coreApiUrl = 'http://localhost:3999';
const testnet = new StacksTestnet();
const mainnet = new StacksMainnet();
let activeNetwork = mocknet;

let apiUrl = process.env.REACT_APP_STACKS_API;
if(stacksNetworkType==="mocknet"){
  activeNetwork = mocknet
} else if(stacksNetworkType==="testnet"){
  activeNetwork = testnet
  apiUrl = 'https://stacks-node-api.testnet.stacks.co'
} else if(stacksNetworkType==="mainnet"){
  activeNetwork = mainnet
  apiUrl = 'https://stacks-node-api.mainnet.stacks.co'
}


const InputDestinationAddressStyles = theme => ({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '1vh',
    // backgroundColor: theme.colors.aeroBlue,
    backgroundColor: theme.colors.white,
  },
  info: {
    fontSize: '30px',
    color: theme.colors.tundoraGrey,
    '@media (max-width: 425px)': {
      fontSize: '18px',
    },
  },
  infosm: {
    // fontSize: '24px',
    color: theme.colors.tundoraGrey,
    '@media (max-width: 425px)': {
      fontSize: '18px',
    },
  },
  sbuttoncl: {
    margin: 'auto',
    width: 'fit-content',
    padding: '15px',
  },
});

let currentBlockHeight = 0;
let bitcoinBlockHeight = 0;
async function getBlockHeight(){
  try {
    const response = await axios.get(`${apiUrl}/v2/info`);
    if (response.data && response.data.stacks_tip_height) {
      currentBlockHeight = response.data.stacks_tip_height;
      bitcoinBlockHeight = response.data.burn_block_height;
      console.log('got currentBlockHeight, bitcoinBlockHeight ', currentBlockHeight, bitcoinBlockHeight);
    }
  } catch(error) {
    console.log('failed to get current blockheight');
    return currentBlockHeight;
  }
  return currentBlockHeight;
}
getBlockHeight();
// console.log('got currentBlockHeight: ', currentBlockHeight);

async function refundStx (refundFile, setRefundTransactionHash, setDestinationAddress) {
  // console.log("enter refundstx action");
//   amount: 2002777
// currency: "STX"
// preimageHash: "aa3ce25175bfcecd49e303177c8214feda7907821348883d4251a6446c8c43b9"
// privateKey: "b0e08e2eeea8f1c9a165ed10d5f3455acb6de50a1c6549664666ed5744656f69"
// timeoutBlockHeight: 19862
// contract: "STR187KT73T0A8M0DEWDX06TJR2B8WM0WP9VGZY3.stxswap_v3_debug"
  console.log("refundStx: ", refundFile, setRefundTransactionHash, setDestinationAddress);

  let stxcontractaddress = refundFile.contract.split(".")[0];
  let stxcontractname = refundFile.contract.split(".")[1];

  let paymenthash;
  if(refundFile.preimageHash) {
    paymenthash = refundFile.preimageHash;
  } else {
    paymenthash = refundFile.swapInfo.preimageHash;
  }

  // console.log("calc: ", swapResponse.expectedAmount, (parseInt(swapResponse.expectedAmount) / 100))
  let swapamount, postconditionamount;
  if(refundFile.amount) {
    swapamount = refundFile.amount.toString(16).split(".")[0] + "";
    postconditionamount = Math.ceil(parseInt(refundFile.amount));
  } else {
    swapamount = (refundFile.swapResponse.baseAmount*1000000).toString(16).split(".")[0] + "";
    postconditionamount = Math.ceil(parseInt(refundFile.swapResponse.baseAmount*1000000));
  }
  
  // let postconditionamount = refundFile.amount + 100000

  // 199610455 -> 199 STX
  console.log("swapamount, postconditionamount: ", swapamount, postconditionamount);
  let paddedamount = swapamount.padStart(32, "0");

  let paddedtimelock = Number(refundFile.timeoutBlockHeight).toString(16).padStart(32, "0");
  console.log("paddedamount, paddedtimelock: ", paddedamount, paddedtimelock);

  const postConditionAddress = stxcontractaddress;
  const postConditionCode = FungibleConditionCode.LessEqual;
  const postConditionAmount = new BN(postconditionamount);
  // const postConditions = [
  //   createSTXPostCondition(postConditionAddress, postConditionCode, postConditionAmount),
  // ];
  const postConditions = [
    makeContractSTXPostCondition(
      postConditionAddress,
      stxcontractname,
      postConditionCode,
      postConditionAmount
    )
  ];

  console.log("postConditions: ", postConditions, typeof(postConditions[0].amount), postConditions[0].amount.toArrayLike);

    // (claimStx (preimageHash (buff 32)) (amount (buff 16)) (claimAddress (buff 42)) (refundAddress (buff 42)) (timelock (buff 16))
  const functionArgs = [
    // bufferCV(Buffer.from('4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a', 'hex')),
    // paymenthash:          a518e5782da3d6d58d9d3494448fc3a5f42d4704942e4e3154c7b36fc163a0e9
    bufferCV(Buffer.from(paymenthash, 'hex')),
    // bufferCV(Buffer.from(paddedamount,'hex')),
    // bufferCV(Buffer.from('01','hex')),
    // bufferCV(Buffer.from('01','hex')),
    // bufferCV(Buffer.from(paddedtimelock,'hex')),
  ];
  console.log("functionArgs: ", JSON.stringify(functionArgs));
  // return false;
  const options = {
    network: activeNetwork,
    contractAddress: stxcontractaddress,
    contractName: stxcontractname,
    functionName: 'refundStx',
    functionArgs,
    appDetails: {
      name: 'lnswap',
      icon: window.location.origin + './favicon.ico',
    },
    // authOrigin: "localhost:3888",
    postConditions,
    onFinish: data => {
      console.log('Stacks Transaction:', data.stacksTransaction);
      console.log('Transaction ID:', data.txId);
      console.log('Raw transaction:', data.txRaw);
      const explorerTransactionUrl = 'https://explorer.stacks.co/txid/'+data.txId+'?chain=';
      console.log('View transaction in explorer:', explorerTransactionUrl);
      // dispatch(setRefundTransactionHash(refundTransaction.getId()));
      setDestinationAddress(data.txId);
    },
  };
  console.log("options: ", options);
  await openContractCall(options);
}

async function refundToken (refundFile, setRefundTransactionHash, setDestinationAddress) {
  // console.log("enter refundstx action");
//   amount: 2002777
// currency: "STX"
// preimageHash: "aa3ce25175bfcecd49e303177c8214feda7907821348883d4251a6446c8c43b9"
// privateKey: "b0e08e2eeea8f1c9a165ed10d5f3455acb6de50a1c6549664666ed5744656f69"
// timeoutBlockHeight: 19862
// contract: "STR187KT73T0A8M0DEWDX06TJR2B8WM0WP9VGZY3.stxswap_v3_debug"
  console.log("refundToken: ", refundFile, setRefundTransactionHash, setDestinationAddress);

  let stxcontractaddress = refundFile.contract.split(".")[0];
  let stxcontractname = refundFile.contract.split(".")[1];

  let paymenthash;
  if(refundFile.preimageHash) {
    paymenthash = refundFile.preimageHash;
  } else {
    paymenthash = refundFile.swapInfo.preimageHash;
  }

  // old way
  // // console.log("calc: ", swapResponse.expectedAmount, (parseInt(swapResponse.expectedAmount) / 100))
  // let swapamount = refundFile.amount.toString(16).split(".")[0] + "";
  // // let postconditionamount = refundFile.amount + 100000
  // let postconditionamount = Math.ceil(parseInt(refundFile.amount));
  // // 199610455 -> 199 STX

  // new way
  let swapamount, postconditionamount;
  if(refundFile.amount) {
    swapamount = refundFile.amount.toString(16).split(".")[0] + "";
    postconditionamount = Math.ceil(parseInt(refundFile.amount));
  } else {
    swapamount = (refundFile.swapResponse.baseAmount*1000000).toString(16).split(".")[0] + "";
    postconditionamount = Math.ceil(parseInt(refundFile.swapResponse.baseAmount*1000000));
  }

  console.log("swapamount, postconditionamount: ", swapamount, postconditionamount);
  let paddedamount = swapamount.padStart(32, "0");

  let paddedtimelock = Number(refundFile.timeoutBlockHeight).toString(16).padStart(32, "0");
  console.log("paddedamount, paddedtimelock: ", paddedamount, paddedtimelock);

  const postConditionAddress = stxcontractaddress;
  const postConditionCode = FungibleConditionCode.LessEqual;
  const postConditionAmount = new BN(postconditionamount);
  // const postConditions = [
  //   createSTXPostCondition(postConditionAddress, postConditionCode, postConditionAmount),
  // ];

  let tokenAddress;
  if(refundFile.redeemScript.includes(".")){
    tokenAddress = Buffer.from(refundFile.redeemScript, 'hex').toString('utf8');
  } else {
    tokenAddress = refundFile.swapResponse.tokenAddress;
  }
  console.log('refundFile tokenAddress: ', tokenAddress);

  const assetAddress = tokenAddress.split('.')[0];
  const assetContractName = tokenAddress.split('.')[1];
  const assetName = assetContractName.split('-')[0];
  const fungibleAssetInfo = createAssetInfo(
    assetAddress,
    assetContractName,
    assetName
  );

  const standardFungiblePostCondition = makeContractFungiblePostCondition(
    postConditionAddress,
    stxcontractname,
    postConditionCode,
    postConditionAmount,
    fungibleAssetInfo
  );
  const postConditions = [
    // createSTXPostCondition(postConditionAddress, postConditionCode, postConditionAmount),
    standardFungiblePostCondition,
  ];
  
  // const postConditions = [
  //   makeContractSTXPostCondition(
  //     postConditionAddress,
  //     stxcontractname,
  //     postConditionCode,
  //     postConditionAmount
  //   )
  // ];

  console.log("postConditions: ", postConditions, typeof(postConditions[0].amount), postConditions[0].amount.toArrayLike);

    // (refundToken (preimageHash (buff 32)) (amount (buff 16)) (claimAddress (buff 42)) (refundAddress (buff 42)) (timelock (buff 16)) (tokenPrincipal <ft-trait>))
  const functionArgs = [
    // bufferCV(Buffer.from('4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a', 'hex')),
    // paymenthash:          a518e5782da3d6d58d9d3494448fc3a5f42d4704942e4e3154c7b36fc163a0e9
    bufferCV(Buffer.from(paymenthash, 'hex')),
    // bufferCV(Buffer.from(paddedamount,'hex')),
    // bufferCV(Buffer.from('01','hex')),
    // bufferCV(Buffer.from('01','hex')),
    // bufferCV(Buffer.from(paddedtimelock,'hex')),
    contractPrincipalCV(assetAddress, assetContractName),
  ];
  console.log("functionArgs: ", JSON.stringify(functionArgs));
  // return false;
  const options = {
    network: activeNetwork,
    contractAddress: stxcontractaddress,
    contractName: stxcontractname,
    functionName: 'refundToken',
    functionArgs,
    appDetails: {
      name: 'lnswap',
      icon: window.location.origin + './favicon.ico',
    },
    // authOrigin: "localhost:3888",
    postConditions,
    onFinish: data => {
      console.log('Stacks Transaction:', data.stacksTransaction);
      console.log('Transaction ID:', data.txId);
      console.log('Raw transaction:', data.txRaw);
      const explorerTransactionUrl = 'https://explorer.stacks.co/txid/'+data.txId+'?chain=';
      console.log('View transaction in explorer:', explorerTransactionUrl);
      // dispatch(setRefundTransactionHash(refundTransaction.getId()));
      setDestinationAddress(data.txId);
    },
  };
  console.log("options: ", options);
  await openContractCall(options);
}

function makeContractSTXPostCondition(
  address,
  contractName,
  conditionCode,
  amount
) {
  return createSTXPostCondition(
    createContractPrincipal(address, contractName),
    conditionCode,
    amount
  );
}

function createSTXPostCondition(principal, conditionCode, amount) {
  if (typeof principal === 'string') {
      principal = parsePrincipalString(principal);
  }
  return {
      type: StacksMessageType.PostCondition,
      conditionType: PostConditionType.STX,
      principal,
      conditionCode,
      amount: intToBN(amount, false),
  };
}
// function intToBytes(value, signed, byteLength) {
//   return intToBN(value, signed).toArrayLike(Buffer, 'be', byteLength);
// }
function intToBN(value, signed) {
  const bigInt = intToBigInt(value, signed);
  return new BN(bigInt.toString());
}
function intToBigInt(value, signed) {
  if (typeof value === 'number') {
      if (!Number.isInteger(value)) {
          throw new RangeError(`Invalid value. Values of type 'number' must be an integer.`);
      }
      // console.log("156")
      // return 157;
      return bigInt(value);
  }
  if (typeof value === 'string') {
      if (value.toLowerCase().startsWith('0x')) {
          let hex = value.slice(2);
          hex = hex.padStart(hex.length + (hex.length % 2), '0');
          value = Buffer.from(hex, 'hex');
      }
      else {
          try {
            // return 168;
              return bigInt(value);
          }
          catch (error) {
              if (error instanceof SyntaxError) {
                  throw new RangeError(`Invalid value. String integer '${value}' is not finite.`);
              }
          }
      }
  }
  if (typeof value === 'bigint') {
      return value;
  }
  if (value instanceof Uint8Array || Buffer.isBuffer(value)) {
      if (signed) {
          const bn = new BN(value, 'be').fromTwos(value.byteLength * 8);
          // return 184;
          return bigInt(bn.toString());
      }
      else {
          // return 188;
          return bigInt(new BN(value, 'be').toString());
      }
  }
  if (value instanceof BN || BN.isBN(value)) {
      // return 193;
      return bigInt(value.toString());
  }
  throw new TypeError(`Invalid value type. Must be a number, bigint, integer-string, hex-string, BN.js instance, or Buffer.`);
}

const StyledInputDestinationAddress = ({
  classes,
  setDestinationAddress,
  currency,
  refundFile,
  setRefundTransactionHash,
}) => (
  <View className={classes.wrapper}>
    {currency !== 'BTC' ? <View className={classes.wrapper}>
        {((currentBlockHeight > 0) && (refundFile.timeoutBlockHeight > currentBlockHeight)) ? (<p className={classes.infosm}>
        Warning: You can't refund your coins yet! <br/>
        Current Stacks blockheight: {currentBlockHeight} <br/>
        Refund timeout blockheight: {refundFile.timeoutBlockHeight}{'\n'}<br/>
        * Refund will fail until chain reaches refund timeout blockheight. <br/>
        Please wait ~{(refundFile.timeoutBlockHeight - currentBlockHeight)*10} more minutes.
      </p>) : null}
      <p className={classes.info}>
      {/* {getCurrencyName(currency)} */}
        Click to trigger Refund
        {/* Use same account you used for locking the STX */}
      </p>

      <SButton
        size="large"
        pl="base-tight"
        pr={'base'}
        py="tight"
        fontSize={2}
        mode="primary"
        position="relative"
        className={classes.sbuttoncl}
        // ref={ref}
        onClick={() => currency === 'STX'
          ? refundStx(refundFile, setRefundTransactionHash, setDestinationAddress)
          : refundToken(refundFile, setRefundTransactionHash, setDestinationAddress)
        }
        // onClick={refundStx}
        borderRadius="10px"
        // {...rest}
        >
        <Box
          as={MdFileDownload}
          // transform={isSend ? 'unset' : 'scaleY(-1)'}
          size={'16px'}
          mr={'2px'}
        />
        <Box as="span" ml="2px" fontSize="large">
          Refund {currency}
        </Box>
      </SButton>
    </View> : null }

    {currency === 'BTC' ? 
    <View className={classes.wrapper}>
      {((bitcoinBlockHeight > 0) && (refundFile.swapResponse.origBlockHeight > bitcoinBlockHeight)) ? (<p className={classes.infosm}>
        Warning: You can't refund your coins yet! <br/>
        Current Bitcoin blockheight: {bitcoinBlockHeight} <br/>
        Refund timeout blockheight: {refundFile.swapResponse.origBlockHeight}{'\n'}<br/>
        * Refund will fail until chain reaches refund timeout blockheight. <br/>
        Please wait ~{(refundFile.swapResponse.origBlockHeight - bitcoinBlockHeight)*10} more minutes.
      </p>) : null}
      <p className={classes.info}>
      {/* {getCurrencyName(currency)} */}
        Enter your {currency} Address
        {/* Use same account you used for locking the STX */}
      </p>
      <InputArea
        height={150}
        width={500}
        showQrScanner={true}
        onChange={setDestinationAddress}
        placeholder={`EG: ${getSampleAddress(currency)}`}
        // value={123}
      />
    </View> : null}
  </View>
);

StyledInputDestinationAddress.propTypes = {
  classes: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  setDestinationAddress: PropTypes.func.isRequired,
  refundFile: PropTypes.object.isRequired,
  setRefundTransactionHash: PropTypes.func.isRequired, 
};

const InputDestinationAddress = injectSheet(InputDestinationAddressStyles)(
  StyledInputDestinationAddress
);

export default InputDestinationAddress;
