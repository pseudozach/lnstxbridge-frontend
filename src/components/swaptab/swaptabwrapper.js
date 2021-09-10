import React from 'react';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import { network, ServiceWarnings } from '../../constants';
import { decimals } from '../../utils';
import Web3 from 'web3';
import Web3Modal from "web3modal";

// StacksRegtest, StacksMainnet
import { StacksTestnet, StacksMocknet } from '@stacks/network';
import { AppConfig, UserSession, showConnect, openContractCall } from '@stacks/connect';
// import { useConnect, doContractCall } from '@stacks/connect-react';

// import { useHandleClaimHey } from '../../utils/dotx'

import {
  // uintCV,
  // intCV,
  bufferCV,
  // stringAsciiCV,
  // stringUtf8CV,
  // standardPrincipalCV,
  // trueCV,
  // makeStandardSTXPostCondition,
  FungibleConditionCode,
  // PostConditionMode,
  // createSTXPostCondition,
  parsePrincipalString,
  StacksMessageType,
  PostConditionType
} from '@stacks/transactions';
// import { bufferCV } from '@stacks/transactions/dist/clarity/types/bufferCV';

// import { ContractABIs } from 'boltz-core';
// // // @ts-ignore 
// // import { ERC20 } from 'boltz-core/typechain/ERC20';
// // import { ERC20Swap } from 'boltz-core/typechain/ERC20Swap';
// // import { EtherSwap } from 'boltz-core/typechain/EtherSwap';
// import { Signer, providers, Contract, Wallet } from 'ethers';

import {
  // erc20tokenaddress,
  // rbtcswapaddress,
  erc20swapaddress,
} from '../../constants';
import { BN } from 'bn.js';
import bigInt from 'big-integer';

// const BigNum = require('bn.js');
// const networkConfig = new NetworkConfig("http://localhost:3999")
// let networkConfig 
// {url: 'http://localhost:3999'}
// const mocknet = new StacksMocknet();
const mocknet = new StacksMocknet({url: "http://localhost:3999"});
// mocknet.coreApiUrl = 'http://localhost:3999';
const testnet = new StacksTestnet();
// const mainnet = new StacksMainnet();
// const regtest = new StacksRegtest();
// regtest.coreApiUrl = 'http://localhost:3999';
let activeNetwork = mocknet
activeNetwork = testnet

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

// only for testing!
let stxcontractaddres = "STR187KT73T0A8M0DEWDX06TJR2B8WM0WP9VGZY3"; //mocknet
// stxcontractaddres = "ST15RGYVK9ACFQWMFFA2TVASDVZH38B4VAV4WF6BJ" //testnet

let stxcontractname = "stxswap_v3"


class SwapTabWrapper extends React.Component {
  constructor(props) {
    super(props);

    if (props.warnings.includes(ServiceWarnings.ReverseSwapsDisabled)) {
      this.reverseSwapsDisabled = true;
    }

    this.quoteStep = new BigNumber('0.0001').toFixed(4);
    this.baseStep = new BigNumber('1').dividedBy(decimals).toFixed(8);

    this.state = {
      baseAsset: {},
      quoteAsset: {},
      disabled: false,
      error: false,
      inputError: false,
      base: 'STX',
      quote: 'BTC ⚡',
      minAmount: new BigNumber('0'),
      maxAmount: new BigNumber('0'),
      baseAmount: new BigNumber('0.05'),
      quoteAmount: new BigNumber('0'),
      feeAmount: new BigNumber('0'),
      errorMessage: '',
      web3: null,
      provider: null,
    };
    
    // const handleFaucetCall = useHandleClaimHey();

  }

  connectWallet = async () => {
    // const providerOptions = {
    //   /* See Provider Options Section */
    // };

    const web3Modal = new Web3Modal({
      // network: "mainnet", // optional
      // cacheProvider: true, // optional
      // providerOptions // required
    });
    // console.log("web3modal defined");
    const provider = await web3Modal.connect();
    console.log("web3 provider ready: ", provider);
    this.provider = provider;

    const web3 = new Web3(provider);
    console.log("web3 ready: ", web3);
    this.web3 = web3;

    console.log("web3.eth.accounts.currentProvider.selectedAddress ", web3.eth.accounts.currentProvider.selectedAddress);


    var erc20swapabi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"preimage","type":"bytes32"}],"name":"Claim","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":false,"internalType":"address","name":"claimAddress","type":"address"},{"indexed":true,"internalType":"address","name":"refundAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"Lockup","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"preimageHash","type":"bytes32"}],"name":"Refund","type":"event"},{"inputs":[{"internalType":"bytes32","name":"preimage","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"refundAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"claimAddress","type":"address"},{"internalType":"address","name":"refundAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"hashValues","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"claimAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"lock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address payable","name":"claimAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"lockPrepayMinerfee","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"claimAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"refund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"swaps","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}];
    var erc20swapcontract = new web3.eth.Contract(erc20swapabi, erc20swapaddress);
    console.log(erc20swapcontract.methods.lock)
  }  

  connectStacksWallet = async () => {
    // console.log("connectStacksWallet, ", userSession);
    // if(userSession.isUserSignedIn()) {
    //   let userData = userSession.loadUserData();
    //   // console.log("userData, network: ", userData, network);
    //   if(network==="mainnet"){
    //     let userstxaddress = userData.profile.stxAddress.mainnet;
    //   } else {
    //     let userstxaddress = userData.profile.stxAddress.testnet;
    //   }
    // }

    showConnect({
        appDetails: {
          name: 'Stacks.Swap',
          icon: window.location.origin + '/favicon.ico',
        },
        redirectTo: '/',
        finished: () => {
          window.location.reload();
        },
        userSession: userSession,
    });  
  }

  stacksUserSession = () => {
    // console.log("stacksUserSession: ", userSession);
    let userstxaddress;
    if(userSession.isUserSignedIn()) {
      let userData = userSession.loadUserData();
      // console.log("userData, network: ", userData, network);
      if(network==="mainnet"){
        userstxaddress = userData.profile.stxAddress.mainnet;
      } else {
        userstxaddress = userData.profile.stxAddress.testnet;
      }

      userstxaddress = "Logged in as " + userstxaddress.slice(0,5) + "..." + userstxaddress.slice(-5);
    }
    return userstxaddress;
  }

  stacksLogout = () => {
    userSession.signUserOut();
  }

  lockStx = async (swapInfo, swapResponse) => {
    console.log("lockStx: ", swapInfo, swapResponse);
    const postConditionAddress = stxcontractaddres;
    const postConditionCode = FungibleConditionCode.LessEqual;
    // const amount = uintCV(parseInt(2000000));
    const postConditionAmount = new BN(2000000);
    // const postConditionAmount = new BigNumber(2000000)
    // const postConditionAmount = Buffer.from('00000000000000000000000000100000','hex');
    // const postConditions = [
    //   makeStandardSTXPostCondition(postConditionAddress, postConditionCode, postConditionAmount),
    // ];
    const postConditions = [
      this.createSTXPostCondition(postConditionAddress, postConditionCode, postConditionAmount),
    ];
    // console.log("postConditions: ", postConditions, typeof(postConditions[0].amount), postConditions[0].amount.toArrayLike);
    // bufferCV(Buffer.from('00000000000000000000000000100000','hex')), -> 1 STX == 1048576₁₀

      // (lockStx (preimageHash (buff 32)) (amount (buff 16)) (claimAddress (buff 42)) (refundAddress (buff 42)) (timelock (buff 16))
    const functionArgs = [
      bufferCV(Buffer.from('4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a', 'hex')),
      bufferCV(Buffer.from('00000000000000000000000000100000','hex')),
      bufferCV(Buffer.from('01','hex')),
      bufferCV(Buffer.from('01','hex')),
      bufferCV(Buffer.from('000000000000000000000000000012b4','hex')),
      // bufferCV(Buffer.from('hello, world')),
      // bufferCV(Buffer.from('hello, world')),
      // stringAsciiCV(thisthing.form.question),
      // uintCV(parseInt(thisthing.form.paypervote)),
      // standardPrincipalCV(thisthing.form.oracle.trim()),
      // uintCV(parseInt(unixtime)),
      // stringAsciiCV("manual"),
      // uintCV(1234),
      // intCV(-234),
      // bufferCV(Buffer.from('hello, world')),
      // stringUtf8CV('hey-utf8'),
      // trueCV(),
    ];
    // console.log("functionArgs: ", JSON.stringify(functionArgs));
    // return false;
    const options = {
      network: activeNetwork,
      contractAddress: stxcontractaddres,
      contractName: stxcontractname,
      functionName: 'lockStx',
      functionArgs,
      appDetails: {
        name: 'stxswap',
        icon: window.location.origin + './favicon.ico',
      },
      authOrigin: "localhost:3888",
      postConditions,
      onFinish: data => {
        console.log('Stacks Transaction:', data.stacksTransaction);
        console.log('Transaction ID:', data.txId);
        console.log('Raw transaction:', data.txRaw);
        // +thisthing.activeNetworkStr
        const explorerTransactionUrl = 'https://explorer.stacks.co/txid/'+data.txId+'?chain=';
        console.log('View transaction in explorer:', explorerTransactionUrl);
      // thisthing.isLoading = false;
     //  	db.ref(thisthing.contractname).push({account: thisthing.userData.profile.stxAddress[thisthing.activeNetworkStr], question: thisthing.form.question, paypervote: thisthing.form.paypervote, oracle: thisthing.form.oracle.trim(), txid: "https://explorer.stacks.co/txid/"+data.txId+"?chain="+thisthing.activeNetworkStr, resolveTime: thisthing.datetime, unixtime: unixtime, resolveType:"manual", yescount: 0, nocount: 0, balance:0, resolved: false, result: false,  createdAt: firebase.database.ServerValue.TIMESTAMP});
      // this.$notify({
      //   title: 'Create Market',
      //   text: 'Tx broadcasted. Please wait for it to be confirmed: ' + explorerTransactionUrl,
      //   type: 'success',
      //   duration: 10000,
      // });
      // this.$emit('exit', true);
      },
    };
    console.log("2options: ", options);
    await openContractCall(options);

    // const onFinish = useCallback((data) => {
    //   // void setIsLoading(false);
    //   console.log("onFinish ", data)
    // }, []);
  
    // const onCancel = useCallback(() => {
    //   // void setIsLoading(false);
    //   console.log("onCancel ", data)
    // }, []);
    // // setIsLoading

    // // const { doContractCall } = useConnect();
    // console.log("doContractCall");
    // const handleFaucetCall = useHandleClaimHey(network, stxcontractaddres, functionArgs);
    // handleFaucetCall()

    // void doContractCall({
    //   stxcontractaddres,
    //   contractName: 'stxswap_v2',
    //   functionName: 'lockStx',
    //   functionArgs: functionArgs,
    //   onFinish: data => {
    //     console.log('Stacks Transaction:', data.stacksTransaction);
    //     console.log('Transaction ID:', data.txId);
    //     console.log('Raw transaction:', data.txRaw);
    //     // +thisthing.activeNetworkStr
    //     const explorerTransactionUrl = 'https://explorer.stacks.co/txid/'+data.txId+'?chain=';
    //     console.log('View transaction in explorer:', explorerTransactionUrl);
    //   // thisthing.isLoading = false;
    //  //  	db.ref(thisthing.contractname).push({account: thisthing.userData.profile.stxAddress[thisthing.activeNetworkStr], question: thisthing.form.question, paypervote: thisthing.form.paypervote, oracle: thisthing.form.oracle.trim(), txid: "https://explorer.stacks.co/txid/"+data.txId+"?chain="+thisthing.activeNetworkStr, resolveTime: thisthing.datetime, unixtime: unixtime, resolveType:"manual", yescount: 0, nocount: 0, balance:0, resolved: false, result: false,  createdAt: firebase.database.ServerValue.TIMESTAMP});
    //   // this.$notify({
    //   //   title: 'Create Market',
    //   //   text: 'Tx broadcasted. Please wait for it to be confirmed: ' + explorerTransactionUrl,
    //   //   type: 'success',
    //   //   duration: 10000,
    //   // });
    //   // this.$emit('exit', true);
    //   },
    //   // onCancel,
    //   network: mocknet,
    //   // stxAddress: address,
    // });

  }

  createSTXPostCondition(principal, conditionCode, amount) {
    if (typeof principal === 'string') {
        principal = parsePrincipalString(principal);
    }
    return {
        type: StacksMessageType.PostCondition,
        conditionType: PostConditionType.STX,
        principal,
        conditionCode,
        amount: this.intToBN(amount, false),
    };
  }
  intToBytes(value, signed, byteLength) {
    return this.intToBN(value, signed).toArrayLike(Buffer, 'be', byteLength);
  }
  intToBN(value, signed) {
    const bigInt = this.intToBigInt(value, signed);
    return new BN(bigInt.toString());
  }
  intToBigInt(value, signed) {
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

  lockFunds = async (swapInfo, swapResponse) => {
    console.log("enter lockFunds, swapInfo, swapResponse ", swapInfo, swapResponse);
    if(!this.web3) {
      this.connectWallet();
    }

    console.log("got web3: ", this.web3);

    // const signer = this.connectEthereum(this.provider, this.provider.address);
    // const { etherSwap, erc20Swap, token } = this.getContracts(signer);
  
    // const preimageHash = "this.getHexBuffer(argv.preimageHash)";
    // const amount = "BigNumber.from(argv.amount).mul(etherDecimals)";
  
    const boltzAddress = "await getBoltzAddress()";
    console.log("boltzAddress: ", boltzAddress);
  
    if (boltzAddress === undefined) {
      console.log('Could not lock coins because the address of Boltz could not be queried');
      return;
    }
  
    // var erc20swapabi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"preimage","type":"bytes32"}],"name":"Claim","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":false,"internalType":"address","name":"claimAddress","type":"address"},{"indexed":true,"internalType":"address","name":"refundAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"Lockup","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"preimageHash","type":"bytes32"}],"name":"Refund","type":"event"},{"inputs":[{"internalType":"bytes32","name":"preimage","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"refundAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"claimAddress","type":"address"},{"internalType":"address","name":"refundAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"hashValues","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"claimAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"lock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address payable","name":"claimAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"lockPrepayMinerfee","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"preimageHash","type":"bytes32"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"claimAddress","type":"address"},{"internalType":"uint256","name":"timelock","type":"uint256"}],"name":"refund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"swaps","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}];
    // var erc20swapcontract = this.web3.eth.contract(erc20swapabi).at(erc20swapaddress);

    console.log("web3.eth.accounts[0] ", this.web3.eth.accounts[0]);
    
    // erc20swapcontract.lock.sendTransaction(parameter_1,parameter_2,parameter_n,{
    //             from:web3.eth.accounts[0],
    //             gas:4000000},function (error, result){ //get callback from function which is your transaction key
    //                 if(!error){
    //                     console.log(result);
    //                 } else{
    //                     console.log(error);
    //                 }
    //         });



    // let transaction;
    // : ContractTransaction;
  
    // if (argv.token) {
    //   console.log("rsk erc20Swap.lock to erc20SwapAddress: ", Constants.erc20SwapAddress);
    //   await token.approve(Constants.erc20SwapAddress, amount);
    //   console.log("rsk erc20Swap.lock after approve: ", preimageHash, amount, Constants.erc20TokenAddress, boltzAddress, argv.timelock);
    //   transaction = await erc20Swap.lock(
    //     preimageHash,
    //     amount,
    //     Constants.erc20TokenAddress,
    //     boltzAddress,
    //     argv.timelock,
    //   );
    // } else {
    //   console.log("rsk etherSwap.lock to claimAddress: ", boltzAddress);
    //   transaction = await etherSwap.lock(
    //     preimageHash,
    //     boltzAddress,
    //     argv.timelock,
    //     {
    //       value: amount,
    //     },
    //   );
    // }
  
    // await transaction.wait(1);
    // console.log(`Sent ${argv.token ? 'ERC20 token' : 'Rbtc'} in: ${transaction.hash}`);
  }

  // connectEthereum = (providerUrl, signerAddress) => {
  //   const provider = new providers.JsonRpcProvider(providerUrl);
  //   console.log("rsk connectEthereum signerAddress: ", signerAddress);
  //   return provider.getSigner(signerAddress);
  // };
  
  // getContracts = (signer) => {
  //   return {
  //     token: new Contract(
  //       erc20tokenaddress,
  //       ContractABIs.ERC20,
  //       signer,
  //     ), 
  //     // as any as ERC20,
  //     etherSwap: new Contract(
  //       rbtcswapaddress,
  //       ContractABIs.EtherSwap,
  //       signer,
  //     ),
  //     //  as any as EtherSwap,
  //     erc20Swap: new Contract(
  //       erc20swapaddress,
  //       ContractABIs.ERC20Swap,
  //       signer,
  //     )
  //     //  as any as ERC20Swap,
  //   };
  // };

  getHexBuffer = (input) => {
    return Buffer.from(input, 'hex');
  };

  updateAssets = (isBase, symbol, isLightning) => {
    if (isBase) {
      this.baseAsset = {
        symbol,
        isLightning,
      };
    } else {
      this.quoteAsset = {
        symbol,
        isLightning,
      };
    }
  };

  parseBoltSuffix = (entry, isBase) => {
    const index = entry.lastIndexOf('⚡');
    const isLightning = index !== -1;

    const symbol = isLightning ? entry.substr(0, index - 1) : entry;

    this.updateAssets(isBase, symbol, isLightning);

    return symbol;
  };

  getSymbol = () => {
    return `${this.parseBoltSuffix(
      this.state.base,
      true
    )}/${this.parseBoltSuffix(this.state.quote, false)}`;
  };

  componentWillMount = () => {
    if (localStorage.getItem('quote')) {
      this.setState({
        base: localStorage.getItem('base'),
        quote: localStorage.getItem('quote'),
        baseAmount: new BigNumber(localStorage.getItem('baseAmount')),
      });
    }
  };

  componentDidMount = () => {
    const symbol = this.getSymbol();
    const limits = this.props.limits[symbol];
    console.log("symbol, limits ", symbol, limits);
    // console.log("swaptabwrapper.229 TODO revert")
    this.setState(
      {
        minAmount: new BigNumber(limits.minimal),
        maxAmount: new BigNumber(limits.maximal),
        rate: this.props.rates[symbol],
      },
      () => {
        this.updateQuoteAmount(this.state.baseAmount);
        this.componentDidUpdate({}, {});
      }
    );
  };

  componentDidUpdate = (_, prevState) => {
    const { base, quote, baseAmount, inputError } = this.state;

    // If rate is undefined disable input
    if (this.state.rate !== prevState.rate) {
      this.noRateAvailable();
    }

    // Update the rate if the request finished or the currencies changed
    if (
      prevState.base !== this.state.base ||
      prevState.quote !== this.state.quote
    ) {
      const symbol = this.getSymbol();

      // Swapping from chain to chain or from Lightning to Lightning is not supported right now
      if (
        base === quote ||
        (this.baseAsset.isLightning && this.quoteAsset.isLightning)
      ) {
        this.setState({
          rate: undefined,
          error: true,
          errorMessage: 'Choose a different asset',
        });
        return;
      }

      if (!this.baseAsset.isLightning && !this.quoteAsset.isLightning) {
        this.setState({
          rate: undefined,
          error: true,
          errorMessage: 'Coming soon',
        });
        return;
      }

      // Show an error for reverse swaps if they are disabled
      if (this.reverseSwapsDisabled && this.baseAsset.isLightning) {
        this.setState({
          rate: undefined,
          error: true,
          errorMessage: 'Currently not available',
        });
        return;
      }

      if (inputError) {
        this.setState({
          error: true,
          errorMessage: 'Invalid amount',
        });
      }

      const rate = this.props.rates[symbol];
      const limits = this.props.limits[symbol];
      const feePercentage = this.props.fees.percentages[symbol];
      // console.log("swaptabwrapper.549 minAmount: ", minAmount)
      this.setState(
        {
          rate,
          feePercentage,
          minAmount: new BigNumber(limits.minimal).dividedBy(decimals),
          maxAmount: new BigNumber(limits.maximal).dividedBy(decimals),
          error: false,
        },
        () => this.updateQuoteAmount(this.state.baseAmount)
      );
    }

    if (!this.state.inputError && !this.state.error) {
      localStorage.setItem('base', base);
      localStorage.setItem('quote', quote);
      localStorage.setItem('baseAmount', baseAmount);
    }
  };

  /**
   * @returns the miner fee in the smallest denomination of the currency
   */
  calculateMinerFee = () => {
    const { minerFees } = this.props.fees;

    if (this.baseAsset.isLightning) {
      const { lockup, claim } = minerFees[this.quoteAsset.symbol].reverse;

      return lockup + claim;
    } else {
      return minerFees[this.baseAsset.symbol].normal;
    }
  };

  /**
   * @param { BigNumber } baseAmount
   * @param { BigNumber } rate
   */
  calculateFee = (baseAmount, rate) => {
    const feePercentage = new BigNumber(this.state.feePercentage);

    const percentageFee = feePercentage.times(baseAmount);

    let minerFee = new BigNumber(this.calculateMinerFee()).dividedBy(decimals);

    if (this.baseAsset.isLightning) {
      minerFee = minerFee.times(new BigNumber(1).dividedBy(rate));
    }

    if (isNaN(percentageFee.toNumber())) {
      return new BigNumber(0);
    }

    return percentageFee.plus(minerFee);
  };

  /**
   * @param { BigNumber } baseAmount
   */
  checkBaseAmount = baseAmount => {
    const { minAmount, maxAmount } = this.state;

    return (
      baseAmount.isLessThanOrEqualTo(maxAmount) &&
      baseAmount.isGreaterThanOrEqualTo(minAmount)
    );
  };

  updatePair = (quote, base) => {
    this.setState({ base, quote, error: false, errorMessage: '' });
  };

  noRateAvailable = () => {
    this.state.rate
      ? this.setState({ disabled: false })
      : this.setState({ disabled: true });
  };

  updateBaseAmount = quoteAmount => {
    const amount = new BigNumber(quoteAmount);
    const rate = new BigNumber(this.state.rate.rate);

    const newBase = amount.dividedBy(rate);
    const fee = this.calculateFee(newBase, rate);

    const newBaseWithFee = fee.plus(newBase);
    const inputError = !this.checkBaseAmount(newBaseWithFee);

    this.setState({
      quoteAmount: amount,
      baseAmount: new BigNumber(newBaseWithFee.toFixed(8)),
      feeAmount: fee,
      inputError,
      errorMessage: 'Invalid amount',
    });
  };

  updateQuoteAmount = baseAmount => {
    if (!this.state.rate) return;

    const amount = new BigNumber(baseAmount.toString());
    const rate = new BigNumber(this.state.rate.rate);

    let fee = this.calculateFee(amount, rate);

    const quote = amount
      .times(rate)
      .minus(fee.times(rate))
      .toFixed(8);

    let newQuote = new BigNumber(quote);

    if (newQuote.isLessThanOrEqualTo(0)) {
      newQuote = new BigNumber('0');
    }

    const inputError = !this.checkBaseAmount(amount);
    this.setState({
      quoteAmount: newQuote,
      baseAmount: amount,
      feeAmount: fee,
      inputError,
      errorMessage: 'Invalid amount',
    });
  };

  shouldSubmit = () => {
    if(!userSession.isUserSignedIn()) {
      console.log("not signed in yet");
      // alert("Please connect wallet first.");
      this.connectStacksWallet();
      return false;
    }
    const { error, rate, baseAmount, quoteAmount } = this.state;
    if (error === false && this.rate !== 'Not found') {
      const state = {
        baseAmount: baseAmount.toFixed(8),
        quoteAmount: quoteAmount.toFixed(8),
        base: this.baseAsset.symbol,
        quote: this.quoteAsset.symbol,
        isReverseSwap: this.baseAsset.isLightning,
        pair: {
          id: rate.pair,
          orderSide: rate.orderSide,
        },
      };

      this.props.onPress(state);
    }
  };

  parseRate = () => {
    const rate = this.state.rate;

    if (rate) {
      const exactRate = new BigNumber(rate.rate);
      return exactRate.toFixed(5);
    } else {
      return 'Not found';
    }
  };

  switchPair = () => {
    this.setState(
      state => ({
        base: state.quote,
        quote: state.base,
        baseAmount: state.quoteAmount,
      }),
      () => this.updateQuoteAmount(this.state.baseAmount)
    );
  };

  render() {
    const { feeAmount } = this.state;
    const feePercentage = this.props.fees.percentages[this.getSymbol()] * 100;

    return this.props.children({
      feePercentage,
      quote: this.state.quote,
      disabled: this.state.disabled,
      base: this.state.base,
      errorMessage: this.state.errorMessage,
      error: this.state.error,
      inputError: this.state.inputError,
      minAmount: this.state.minAmount.toNumber(),
      maxAmount: this.state.maxAmount.toNumber(),
      feeAmount: feeAmount.isZero() ? 0 : feeAmount.toFixed(8),
      quoteAmount: this.state.quoteAmount.toNumber(),
      baseAmount: this.state.baseAmount.toNumber(),
      classes: this.props.classes,
      onPress: this.props.onPress,
      limits: this.props.limits,
      currencies: this.props.currencies,
      rate: this.parseRate(),
      updateQuoteAmount: this.updateQuoteAmount,
      updateBaseAmount: this.updateBaseAmount,
      switchPair: this.switchPair,
      updatePair: this.updatePair,
      shouldSubmit: this.shouldSubmit,
      connectWallet: this.connectWallet,
      connectStacksWallet: this.connectStacksWallet,
      stacksUserSession: this.stacksUserSession,
      lockStx: this.lockStx,
      lockFunds: this.lockFunds,
      createSTXPostCondition: this.createSTXPostCondition,
      intToBN: this.intToBN,
      intToBytes: this.intToBytes,
      baseStep: this.baseStep,
      quoteStep: this.quoteStep,
      stacksLogout: this.stacksLogout,
    });
  }
}

SwapTabWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  classes: PropTypes.object,
  warnings: PropTypes.array.isRequired,
  onPress: PropTypes.func,
  fees: PropTypes.object.isRequired,
  rates: PropTypes.object.isRequired,
  limits: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
};

export default SwapTabWrapper;
