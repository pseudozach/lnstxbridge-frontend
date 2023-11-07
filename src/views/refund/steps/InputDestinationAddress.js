import React, { useEffect } from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import View from '../../../components/view';
import { stacksNetworkType } from '../../../constants';
import InputArea from '../../../components/inputarea';
import { getCurrencyName, getSampleAddress } from '../../../utils';

import { Button as SButton, Box } from '@stacks/ui';
import { MdFileDownload } from 'react-icons/md';

// import lightningPayReq from 'bolt11';
// StacksMainnet
import { StacksTestnet, StacksMocknet, StacksMainnet } from '@stacks/network';
import { openContractCall } from '@stacks/connect';
import {
  bufferCV,
  // makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
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
import { Button, Paper, Typography } from '@mui/material';
import {
  AccountBalanceWallet,
  Lock,
  LockOpen,
  OpenInNew,
  Report,
} from '@mui/icons-material';

let mocknet = new StacksMocknet({ url: process.env.REACT_APP_STACKS_API });
// mocknet.coreApiUrl = 'http://localhost:3999';
const testnet = new StacksTestnet();
const mainnet = new StacksMainnet();
let activeNetwork = mocknet;

let apiUrl = process.env.REACT_APP_STACKS_API;
if (stacksNetworkType === 'mocknet') {
  activeNetwork = mocknet;
} else if (stacksNetworkType === 'testnet') {
  activeNetwork = testnet;
  apiUrl = 'https://api.testnet.hiro.so';
} else if (stacksNetworkType === 'mainnet') {
  activeNetwork = mainnet;
  apiUrl = 'https://api.hiro.so';
}

const InputDestinationAddressStyles = theme => ({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '1vh',
    width: '100%',
    // backgroundColor: theme.colors.aeroBlue,
    // backgroundColor: '#fff',
  },
  info: {
    fontSize: '30px',
    // color: '#4A4A4A',
    '@media (max-width: 425px)': {
      fontSize: '18px',
    },
  },
  infosm: {
    // fontSize: '24px',
    color: '#4A4A4A',
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

// remove manual makeContractSTXPostCondition
// function makeContractSTXPostCondition(
//   address,
//   contractName,
//   conditionCode,
//   amount
// ) {
//   return createSTXPostCondition(
//     createContractPrincipal(address, contractName),
//     conditionCode,
//     amount
//   );
// }

// function createSTXPostCondition(principal, conditionCode, amount) {
//   if (typeof principal === 'string') {
//     principal = parsePrincipalString(principal);
//   }
//   return {
//     type: StacksMessageType.PostCondition,
//     conditionType: PostConditionType.STX,
//     principal,
//     conditionCode,
//     amount: intToBN(amount, false),
//   };
// }
// // function intToBytes(value, signed, byteLength) {
// //   return intToBN(value, signed).toArrayLike(Buffer, 'be', byteLength);
// // }
// function intToBN(value, signed) {
//   const bigInt = intToBigInt(value, signed);
//   return new BN(bigInt.toString());
// }
// function intToBigInt(value, signed) {
//   if (typeof value === 'number') {
//     if (!Number.isInteger(value)) {
//       throw new RangeError(
//         `Invalid value. Values of type 'number' must be an integer.`
//       );
//     }
//     // console.log("156")
//     // return 157;
//     return bigInt(value);
//   }
//   if (typeof value === 'string') {
//     if (value.toLowerCase().startsWith('0x')) {
//       let hex = value.slice(2);
//       hex = hex.padStart(hex.length + (hex.length % 2), '0');
//       value = Buffer.from(hex, 'hex');
//     } else {
//       try {
//         // return 168;
//         return bigInt(value);
//       } catch (error) {
//         if (error instanceof SyntaxError) {
//           throw new RangeError(
//             `Invalid value. String integer '${value}' is not finite.`
//           );
//         }
//       }
//     }
//   }
//   if (typeof value === 'bigint') {
//     return value;
//   }
//   if (value instanceof Uint8Array || Buffer.isBuffer(value)) {
//     if (signed) {
//       const bn = new BN(value, 'be').fromTwos(value.byteLength * 8);
//       // return 184;
//       return bigInt(bn.toString());
//     } else {
//       // return 188;
//       return bigInt(new BN(value, 'be').toString());
//     }
//   }
//   if (value instanceof BN || BN.isBN(value)) {
//     // return 193;
//     return bigInt(value.toString());
//   }
//   throw new TypeError(
//     `Invalid value type. Must be a number, bigint, integer-string, hex-string, BN.js instance, or Buffer.`
//   );
// }

class InputDestinationAddress extends React.Component {
  constructor() {
    super();

    this.state = {
      checked: false,
      txId: '',
      swapText: '',
      explorerLink: '',
      bitcoinBlockHeight: 0,
      currentBlockHeight: 0,
      // swapText: '',
    };
  }

  refundStx = async (
    refundFile,
    setRefundTransactionHash,
    setDestinationAddress
  ) => {
    console.log(
      'refundStx: ',
      refundFile,
      setRefundTransactionHash,
      setDestinationAddress
    );

    let stxcontractaddress = refundFile.contract.split('.')[0];
    let stxcontractname = refundFile.contract.split('.')[1];

    let paymenthash;
    if (refundFile.preimageHash?.preimageHash) {
      paymenthash = refundFile.preimageHash.preimageHash;
    } else if (refundFile.preimageHash) {
      paymenthash = refundFile.preimageHash;
    } else {
      paymenthash = refundFile.swapInfo.preimageHash;
    }

    // amount no longer needed for refund!
    // console.log("calc: ", swapResponse.expectedAmount, (parseInt(swapResponse.expectedAmount) / 100))
    let swapamount, postconditionamount;
    if (refundFile.amount) {
      swapamount = refundFile.amount.toString(16).split('.')[0] + '';
      postconditionamount = Math.ceil(parseInt(refundFile.amount));
    } else {
      swapamount =
        (refundFile.swapResponse.baseAmount * 1000000)
          .toString(16)
          .split('.')[0] + '';
      postconditionamount = Math.ceil(
        parseInt(refundFile.swapResponse.baseAmount * 1000000)
      );
    }

    // let postconditionamount = refundFile.amount + 100000

    // 199610455 -> 199 STX
    console.log(
      'swapamount, postconditionamount: ',
      swapamount,
      postconditionamount
    );
    let paddedamount = swapamount.padStart(32, '0');

    let paddedtimelock = Number(refundFile.timeoutBlockHeight)
      .toString(16)
      .padStart(32, '0');
    console.log('paddedamount, paddedtimelock: ', paddedamount, paddedtimelock);

    const postConditionAddress = stxcontractaddress;
    const postConditionCode = FungibleConditionCode.LessEqual;
    // const postConditionAmount = new BN(postconditionamount);
    const postConditionAmount = postconditionamount;

    // const postConditions = [
    //   createSTXPostCondition(postConditionAddress, postConditionCode, postConditionAmount),
    // ];
    const postConditions = [
      makeContractSTXPostCondition(
        postConditionAddress,
        stxcontractname,
        postConditionCode,
        postConditionAmount
      ),
    ];

    console.log(
      'postConditions: ',
      postConditions,
      typeof postConditions[0].amount,
      postConditions[0].amount.toArrayLike
    );

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
    console.log('functionArgs: ', JSON.stringify(functionArgs));
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
        let explorerTransactionUrl =
          'https://explorer.stacks.co/txid/' + data.txId;
        if (activeNetwork === testnet) {
          explorerTransactionUrl = explorerTransactionUrl + '?chain=testnet';
        }
        console.log('Stacks claim onFinish state before: ', this.state);
        this.setState({
          txId: data.txId,
          explorerLink: explorerTransactionUrl,
        });
        // dispatch(setRefundTransactionHash(refundTransaction.getId()));
        setDestinationAddress(data.txId);
      },
    };
    console.log('options: ', options);
    await openContractCall(options);
  };

  refundToken = async (
    refundFile,
    setRefundTransactionHash,
    setDestinationAddress
  ) => {
    console.log(
      'refundToken: ',
      refundFile,
      setRefundTransactionHash,
      setDestinationAddress
    );

    let stxcontractaddress = refundFile.contract.split('.')[0];
    let stxcontractname = refundFile.contract.split('.')[1];

    let paymenthash;
    if (refundFile.preimageHash) {
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
    if (refundFile.amount) {
      swapamount = refundFile.amount.toString(16).split('.')[0] + '';
      postconditionamount = Math.ceil(parseInt(refundFile.amount));
    } else {
      swapamount =
        (refundFile.swapResponse.baseAmount * 1000000)
          .toString(16)
          .split('.')[0] + '';
      postconditionamount = Math.ceil(
        parseInt(refundFile.swapResponse.baseAmount * 1000000)
      );
    }

    if (refundFile.currency === 'XUSD') {
      postconditionamount = postconditionamount * 110;
    }

    console.log(
      'refundToken swapamount, postconditionamount: ',
      swapamount,
      postconditionamount
    );
    let paddedamount = swapamount.padStart(32, '0');

    let paddedtimelock = Number(refundFile.timeoutBlockHeight)
      .toString(16)
      .padStart(32, '0');
    console.log('paddedamount, paddedtimelock: ', paddedamount, paddedtimelock);

    const postConditionAddress = stxcontractaddress;
    const postConditionCode = FungibleConditionCode.LessEqual;
    const postConditionAmount = new BN(postconditionamount);
    // const postConditions = [
    //   createSTXPostCondition(postConditionAddress, postConditionCode, postConditionAmount),
    // ];

    let tokenAddress;
    if (refundFile?.redeemScript?.includes('.')) {
      tokenAddress = Buffer.from(refundFile.redeemScript, 'hex').toString(
        'utf8'
      );
    } else {
      tokenAddress = refundFile.swapResponse.tokenAddress;
    }
    console.log('refundFile tokenAddress: ', tokenAddress);

    const assetAddress = tokenAddress.split('.')[0];
    const assetContractName = tokenAddress.split('.')[1];
    let assetName = assetContractName.split('-')[0];
    if (assetContractName.includes('Wrapped-USD')) {
      assetName = assetContractName.toLowerCase();
    }
    console.log('assetAddress, assetContractName, assetName: ', {
      assetAddress,
      assetContractName,
      assetName,
    });
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

    console.log(
      'postConditions: ',
      postConditions,
      typeof postConditions[0].amount,
      postConditions[0].amount.toArrayLike
    );

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
    console.log('functionArgs: ', JSON.stringify(functionArgs));
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
        console.log('Stacks claim onFinish: ', data);
        let explorerTransactionUrl =
          'https://explorer.stacks.co/txid/' + data.txId;
        if (activeNetwork === testnet) {
          explorerTransactionUrl = explorerTransactionUrl + '?chain=testnet';
        }
        console.log('Stacks claim onFinish state before: ', this.state);
        this.setState({
          txId: data.txId,
          explorerLink: explorerTransactionUrl,
        });
        // dispatch(setRefundTransactionHash(refundTransaction.getId()));
        setDestinationAddress(data.txId);
      },
    };
    console.log('options: ', options);
    await openContractCall(options);
  };

  getBlockHeight = async () => {
    let currentBlockHeight = 0;
    let bitcoinBlockHeight = 0;
    try {
      const response = await axios.get(`${apiUrl}/v2/info`);
      if (response.data && response.data.stacks_tip_height) {
        currentBlockHeight = response.data.stacks_tip_height;
        bitcoinBlockHeight = response.data.burn_block_height;
        console.log(
          'got currentBlockHeight, bitcoinBlockHeight ',
          currentBlockHeight,
          bitcoinBlockHeight
        );
        this.setState({
          bitcoinBlockHeight,
          currentBlockHeight,
        });
      }
    } catch (error) {
      console.log('failed to get current blockheight');
      return currentBlockHeight;
    }
    return currentBlockHeight;
  };

  componentDidMount = () => {
    this.getBlockHeight();
  };

  render() {
    // setAllowZeroConf
    const {
      classes,
      setDestinationAddress,
      currency,
      refundFile,
      setRefundTransactionHash,
    } = this.props;

    return (
      <View className={classes.wrapper}>
        {/* {currency !== 'BTC' ? (
          <View className={classes.wrapper}> */}
        {/* {swapInfo ? ( */}
        <Paper
          variant="outlined"
          sx={{
            // backgroundColor: '#f8f4fc',
            m: 1,
            py: 1,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* fontSize="large" sx={{ fontSize: '5em'}} */}
          {currency !== 'BTC' &&
          this.state.currentBlockHeight > 0 &&
          refundFile.timeoutBlockHeight > this.state.currentBlockHeight ? (
            <Report
              color="error"
              fontSize="large"
              sx={{ m: 1, fontSize: 36 }}
            />
          ) : (
            <Lock
              color="secondary"
              fontSize="large"
              sx={{ m: 1, fontSize: 36 }}
            />
          )}
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
            {currency !== 'BTC' &&
            this.state.currentBlockHeight > 0 &&
            refundFile.timeoutBlockHeight > this.state.currentBlockHeight
              ? `Refund blockheight not reached yet. Please try again in ~${(refundFile.timeoutBlockHeight -
                  this.state.currentBlockHeight) *
                  10} 
                minutes.`
              : null}
            {currency === 'BTC' &&
            this.state.bitcoinBlockHeight > 0 &&
            refundFile.swapResponse?.origBlockHeight >
              this.state.bitcoinBlockHeight
              ? `Refund blockheight not reached yet. Please try again in ~${(refundFile
                  .swapResponse?.origBlockHeight -
                  this.state.bitcoinBlockHeight) *
                  10} 
                minutes.`
              : null}
            {!(
              this.state.currentBlockHeight > 0 &&
              refundFile.timeoutBlockHeight > this.state.currentBlockHeight
            ) &&
            !this.state.txId &&
            currency !== 'BTC'
              ? `Ready to refund ${refundFile.swapResponse?.baseAmount ||
                  refundFile.amount / 10 ** 6} ${currency}`
              : null}
            {currency === 'BTC' &&
            this.state.bitcoinBlockHeight > 0 &&
            refundFile.swapResponse?.origBlockHeight <
              this.state.bitcoinBlockHeight
              ? `Ready to refund ${refundFile.swapResponse?.baseAmount} ${currency}`
              : null}
            {this.state.txId
              ? `Refunding ${refundFile.swapResponse?.baseAmount ||
                  refundFile.amount /
                    10 ** 6} ${currency}. You can close this window.`
              : null}
            {/* {!this.state.txId && !swapStatus?.transaction?.id
                ? `Send ${amountToLock} ${swapInfo.base}`
                : null}
              {swapResponse.bip21 &&
              swapResponse.address &&
              swapStatus.message?.includes('Waiting')
                ? ` to ${swapResponse.address}`
                : null}
              {this.state.txId && !swapStatus?.transaction?.id
                ? `Waiting confirmation of the ${amountToLock} ${swapInfo.base} sent`
                : null}
              {swapStatus?.transaction?.id &&
              swapStatus?.message?.includes('asmempool')
                ? `Waiting confirmation of the ${swapResponse.quoteAmount} ${swapInfo.quote} provider sent`
                : null}
              {swapStatus?.transaction?.id &&
              swapStatus?.message?.includes('Atomic Swap is ready') &&
              !this.state.txId
                ? `Funds are ready to claim ${swapResponse.quoteAmount} ${swapInfo.quote}`
                : null}
              {swapStatus?.transaction?.id &&
              swapStatus?.message?.includes('Atomic Swap is ready') &&
              this.state.txId
                ? `Claiming funds ${swapResponse.quoteAmount} ${swapInfo.quote}`
                : null} */}
          </Typography>
        </Paper>
        {/* ) : null} */}

        {/* {currentBlockHeight > 0 &&
        refundFile.timeoutBlockHeight > currentBlockHeight ? (
          <p className={classes.infosm}>
            Warning: You can't refund your coins yet! <br />
            Current Stacks blockheight: {currentBlockHeight} <br />
            Refund timeout blockheight: {refundFile.timeoutBlockHeight}
            {'\n'}
            <br />* Refund will fail until chain reaches refund timeout
            blockheight. <br />
            Please wait ~
            {(refundFile.timeoutBlockHeight - currentBlockHeight) * 10} more
            minutes.
          </p>
        ) : null} */}
        {/* <p className={classes.info}>
          {getCurrencyName(currency)}
          Click to trigger Refund
          Use same account you used for locking the STX
        </p> */}

        {/* <SButton
          size="large"
          pl="base-tight"
          pr={'base'}
          py="tight"
          fontSize={2}
          mode="primary"
          position="relative"
          className={classes.sbuttoncl}
          // ref={ref}
          onClick={() =>
            currency === 'STX'
              ? refundStx(
                  refundFile,
                  setRefundTransactionHash,
                  setDestinationAddress
                )
              : refundToken(
                  refundFile,
                  setRefundTransactionHash,
                  setDestinationAddress
                )
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
        </SButton> */}

        {/* {(swapInfo.base === 'STX' || swapInfo.base === 'USDA') &&
        swapStatus.message !== 'Atomic Swap is ready' ? ( */}
        {currency !== 'BTC' && (
          <Button
            variant="contained"
            endIcon={<AccountBalanceWallet />}
            sx={{ margin: 'auto' }}
            // ref={this.ref}
            disabled={
              this.state.txId ||
              (this.state.currentBlockHeight > 0 &&
                refundFile.timeoutBlockHeight > this.state.currentBlockHeight)
            }
            onClick={() =>
              currency === 'STX'
                ? this.refundStx(
                    refundFile,
                    setRefundTransactionHash,
                    setDestinationAddress
                  )
                : this.refundToken(
                    refundFile,
                    setRefundTransactionHash,
                    setDestinationAddress
                  )
            }
            size="large"
          >
            Refund {currency}
          </Button>
        )}
        {/* ) : null} */}
        {/* </View>
        ) : null} */}

        {currency === 'BTC' &&
        this.state.bitcoinBlockHeight > 0 &&
        refundFile.swapResponse?.origBlockHeight <=
          this.state.bitcoinBlockHeight ? (
          <View className={classes.wrapper}>
            {/* {bitcoinBlockHeight > 0 &&
            refundFile.swapResponse?.origBlockHeight > bitcoinBlockHeight ? (
              <p className={classes.infosm}>
                Warning: You can't refund your coins yet! <br />
                Current Bitcoin blockheight: {bitcoinBlockHeight} <br />
                Refund timeout blockheight:{' '}
                {refundFile.swapResponse?.origBlockHeight}
                {'\n'}
                <br />* Refund will fail until chain reaches refund timeout
                blockheight. <br />
                Please wait ~
                {(refundFile.swapResponse?.origBlockHeight -
                  bitcoinBlockHeight) *
                  10}{' '}
                more minutes.
              </p>
            ) : null} */}
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
          </View>
        ) : null}

        {this.state.explorerLink && (
          <Button
            href={this.state.explorerLink}
            // underline="none"
            sx={{ m: 1, color: 'white', display: 'flex !important', mt: 3 }}
            target="_blank"
            rel="noreferrer"
            variant="outlined"
            endIcon={<OpenInNew sx={{ verticalAlign: 'middle' }} />}
            fullWidth
          >
            View on Explorer
          </Button>
        )}
      </View>
    );
  }
}

// );

// StyledInputDestinationAddress.propTypes = {
InputDestinationAddress.propTypes = {
  classes: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  setDestinationAddress: PropTypes.func.isRequired,
  refundFile: PropTypes.object.isRequired,
  setRefundTransactionHash: PropTypes.func,
};

// const InputDestinationAddress = injectSheet(InputDestinationAddressStyles)(
//   StyledInputDestinationAddress
// );

export default injectSheet(InputDestinationAddressStyles)(
  InputDestinationAddress
);

// export default InputDestinationAddress;
